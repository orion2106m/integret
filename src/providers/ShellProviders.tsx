import { useEffect, type ReactNode } from "react";
import { AuthProvider } from "../auth/AuthContext";
import { ModalManagerProvider } from "../modals/ModalManager";
import { useShellStore } from "../store/shellStore";

function ThemeSynchronizer() {
  const theme = useShellStore((state) => state.tema);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }, [theme]);

  return null;
}

export interface ShellProvidersProps {
  children: ReactNode;
}

export function ShellProviders({ children }: ShellProvidersProps) {
  return (
    <>
      <ThemeSynchronizer />
      <AuthProvider>
        <ModalManagerProvider>{children}</ModalManagerProvider>
      </AuthProvider>
    </>
  );
}
