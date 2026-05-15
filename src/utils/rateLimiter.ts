type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

function readHistory(key: string) {
  if (typeof window === "undefined") {
    return [] as number[];
  }

  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) {
      return [] as number[];
    }

    const parsed = JSON.parse(raw) as number[];
    return parsed.filter((entry) => Number.isFinite(entry));
  } catch {
    return [] as number[];
  }
}

function writeHistory(key: string, values: number[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(key, JSON.stringify(values));
}

export function createRateLimiter({ key, limit, windowMs }: RateLimitOptions) {
  return {
    check(): RateLimitResult {
      const now = Date.now();
      const history = readHistory(key).filter(
        (entry) => now - entry < windowMs,
      );

      const allowed = history.length < limit;
      if (allowed) {
        history.push(now);
        writeHistory(key, history);
      }

      const retryAfterMs =
        history.length === 0 ? 0 : windowMs - (now - history[0]);

      return {
        allowed,
        remaining: Math.max(limit - history.length, 0),
        retryAfterMs: Math.max(retryAfterMs, 0),
      };
    },
    reset() {
      if (typeof window === "undefined") {
        return;
      }

      window.sessionStorage.removeItem(key);
    },
  };
}
