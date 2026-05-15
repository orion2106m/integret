import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useShellStore } from "../store/shellStore";
import type { ShellUser, UserRole } from "../types/shell.types";
import { recordAuditLog } from "../utils/auditLog";
import { createRateLimiter } from "../utils/rateLimiter";
import { sanitizeEmail, sanitizeText } from "../utils/sanitizer";
import { supabase } from "./supabaseClient";

const loginLimiter = createRateLimiter({
  key: "zenith-login-attempts",
  limit: 5,
  windowMs: 15 * 60 * 1000,
});

const inactivityTimeoutMs = 15 * 60 * 1000;

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  session: Session | null;
  user: ShellUser | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function initialsFrom(user: User) {
  const fromName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "U";
  return fromName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "U")
    .join("");
}

function getRoleFromUser(user: User): UserRole {
  const role = user.app_metadata?.role;
  if (role === "super_admin" || role === "admin" || role === "user") {
    return role;
  }

  return "user";
}

async function fetchRoleFromProfiles(userId: string): Promise<UserRole> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.warn("Failed to fetch user role from profiles:", error);
      return "user";
    }

    const role = data?.role;
    if (role === "super_admin" || role === "admin" || role === "user") {
      return role;
    }

    return "user";
  } catch (err) {
    console.error("Error fetching role from profiles:", err);
    return "user";
  }
}

function buildShellUser(user: User): ShellUser {
  return {
    id: user.id,
    email: user.email ?? "",
    nombre: sanitizeText(
      (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        user.email ??
        "Usuario Zenith",
    ),
    rol: getRoleFromUser(user),
    avatarIniciales: initialsFrom(user),
  };
}

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const setUsuario = useShellStore((state) => state.setUsuario);
  const addAlerta = useShellStore((state) => state.addAlerta);
  const clearAlertas = useShellStore((state) => state.clearAlertas);
  const inactivityTimer = useRef<number | null>(null);

  const syncSession = useCallback(
    async (nextSession: Session | null) => {
      setSession(nextSession);

      if (!nextSession?.user) {
        setUsuario(null);
        clearAlertas();
        return;
      }

      // Fetch role from profiles table
      const profileRole = await fetchRoleFromProfiles(nextSession.user.id);
      const shellUser = buildShellUser(nextSession.user);
      shellUser.rol = profileRole;
      setUsuario(shellUser);
    },
    [clearAlertas, setUsuario],
  );

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      window.clearTimeout(inactivityTimer.current);
    }

    if (!session) {
      return;
    }

    inactivityTimer.current = window.setTimeout(() => {
      void supabase.auth.signOut({ scope: "local" });
    }, inactivityTimeoutMs);
  }, [session]);

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }

      syncSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setTimeout(() => {
        if (!mounted) {
          return;
        }

        syncSession(nextSession);
        setLoading(false);

        if (event === "SIGNED_IN" && nextSession?.user) {
          void recordAuditLog({
            actorId: nextSession.user.id,
            actorRole: getRoleFromUser(nextSession.user),
            action: "auth.sign_in",
            entity: "session",
            entityId: nextSession.user.id,
            severity: "info",
          });
        }

        if (event === "SIGNED_OUT") {
          clearAlertas();
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (inactivityTimer.current) {
        window.clearTimeout(inactivityTimer.current);
      }
    };
  }, [clearAlertas, syncSession]);

  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ] as const;

    const onActivity = () => {
      resetInactivityTimer();
    };

    events.forEach((eventName) => {
      window.addEventListener(eventName, onActivity, { passive: true });
    });

    window.addEventListener("visibilitychange", onActivity);
    resetInactivityTimer();

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, onActivity);
      });
      window.removeEventListener("visibilitychange", onActivity);
      if (inactivityTimer.current) {
        window.clearTimeout(inactivityTimer.current);
      }
    };
  }, [resetInactivityTimer, session]);

  useEffect(() => {
    if (!session?.access_token) {
      return;
    }

    supabase.realtime.setAuth(session.access_token);
  }, [session?.access_token]);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    const role = getRoleFromUser(session.user);
    if (role !== "super_admin") {
      return;
    }

    const channel = supabase.channel("zenith-super-admin-alerts", {
      config: { private: true },
    });

    channel
      .on("broadcast", { event: "incident" }, ({ payload }) => {
        const nextPayload = payload as {
          titulo?: string;
          detalle?: string;
          severidad?: string;
          rolOrigen?: UserRole;
        };

        addAlerta({
          id: crypto.randomUUID(),
          titulo: nextPayload.titulo ?? "Incidente del sistema",
          detalle:
            nextPayload.detalle ?? "Se recibió una alerta en tiempo real.",
          severidad:
            nextPayload.severidad === "danger" ||
            nextPayload.severidad === "warning"
              ? nextPayload.severidad
              : "warning",
          creadoEn: new Date().toISOString(),
          leida: false,
          rolOrigen: nextPayload.rolOrigen,
        });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [addAlerta, session?.user]);

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const limiterResult = loginLimiter.check();
    if (!limiterResult.allowed) {
      throw new Error(
        `Demasiados intentos. Intenta de nuevo en ${Math.ceil(limiterResult.retryAfterMs / 1000)} segundos.`,
      );
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: sanitizeEmail(email),
      password: sanitizeText(password),
    });

    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (session?.user) {
      await recordAuditLog({
        actorId: session.user.id,
        actorRole: getRoleFromUser(session.user),
        action: "auth.sign_out",
        entity: "session",
        entityId: session.user.id,
        severity: "info",
      });
    }

    await supabase.auth.signOut({ scope: "local" });
    loginLimiter.reset();
  }, [session]);

  const refreshSession = useCallback(async () => {
    await supabase.auth.refreshSession();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const role = session ? getRoleFromUser(session.user) : null;
    const user = session?.user ? buildShellUser(session.user) : null;

    return {
      session,
      user,
      role,
      loading,
      isAuthenticated: Boolean(session?.user),
      signIn,
      signOut,
      refreshSession,
      hasRole: (...roles: UserRole[]) => (role ? roles.includes(role) : false),
    };
  }, [loading, refreshSession, session, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
