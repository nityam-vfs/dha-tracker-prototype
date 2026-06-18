"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";

// Client-side guard: redirects to "/" when no session exists.
export default function useRequireAuth() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [session, setSessionState] = useState(null);

  useEffect(() => {
    const current = getSession();
    if (!current) {
      router.replace("/");
      return;
    }
    setSessionState(current);
    setChecked(true);
  }, [router]);

  return { checked, session };
}
