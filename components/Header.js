"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getSession } from "@/lib/session";

export default function Header({ showAuth = true }) {
  const router = useRouter();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const session = getSession();
    setEmail(session?.email ?? null);
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  return (
    <header className="header">
      <div
        className="header-brand"
        style={{ cursor: "pointer" }}
        onClick={() => router.push(email ? "/dashboard" : "/")}
      >
        <span className="header-logo">VFS</span>
        VFS Application Tracker
      </div>

      {showAuth && email && (
        <div className="header-actions">
          <span className="header-email">{email}</span>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
