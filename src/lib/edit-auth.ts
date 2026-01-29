const AUTH_STORAGE_KEY = "edit_access";
const AUTH_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 2 weeks

let reloadCheckDone = false;

function clearAuthIfReload(): void {
  if (reloadCheckDone || typeof window === "undefined") return;
  reloadCheckDone = true;
  const nav = performance.getEntriesByType?.("navigation")?.[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (nav?.type === "reload") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function isAuthValid(): boolean {
  if (typeof window === "undefined") return false;
  clearAuthIfReload();
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) return false;
    const { timestamp } = JSON.parse(authData);
    const elapsed = Date.now() - timestamp;
    return elapsed < AUTH_DURATION_MS;
  } catch {
    return false;
  }
}

export function setAuthGranted(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ granted: true, timestamp: Date.now() })
  );
}
