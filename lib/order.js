"use client";

// Holds the in-progress standard-user order while moving between the
// dashboard → payment → confirmation pages. Uses sessionStorage so it
// clears when the tab closes and never collides with the auth session.
const ORDER_KEY = "vfs_order";

export function setOrder(order) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function getOrder() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function updateOrder(patch) {
  const current = getOrder();
  if (!current) return null;
  const next = { ...current, ...patch };
  setOrder(next);
  return next;
}

export function clearOrder() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ORDER_KEY);
}
