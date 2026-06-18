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
        onClick={() => router.push(email ? "/dashboard" : "/")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/customer-logo.svg"
          alt="VFS Global"
          className="header-logo-img"
        />
      </div>

      <div className="header-actions">
        {showAuth && email && (
          <>
            <span className="header-email">{email}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        <span className="header-lang">English ▾</span>
      </div>
    </header>
  );
}
