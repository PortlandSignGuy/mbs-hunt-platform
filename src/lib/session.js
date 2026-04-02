/**
 * MBS Hunt Platform — Session Helper
 *
 * Manages a lightweight player session token in localStorage.
 * The token is set after registration and used to identify the
 * player across page reloads without requiring full auth.
 */

const SESSION_KEY = 'mbs-session';

/**
 * Read the current session from localStorage.
 * Returns { playerId, huntSlug, email, name, registeredAt } or null.
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Write a session object to localStorage.
 * @param {{ playerId: string, huntSlug?: string, email: string, name: string, registeredAt: string }} session
 */
export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Update specific fields on the existing session without replacing it.
 * No-op if no session exists.
 */
export function patchSession(patch) {
  const current = getSession();
  if (!current) return;
  setSession({ ...current, ...patch });
}

/**
 * Clear the session (logout / reset).
 */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Returns true if a valid session exists.
 */
export function hasSession() {
  return getSession() !== null;
}
