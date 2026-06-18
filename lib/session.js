"use client";

// Tiny localStorage-based session helper (simulated auth, no real provider).
const SESSION_KEY = "vfs_session";

export function setSession(email) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ email, loggedInAt: Date.now() })
  );
}

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
