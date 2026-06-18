"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import useRequireAuth from "@/lib/useRequireAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { checked } = useRequireAuth();

  if (!checked) {
    return (
      <>
        <Header />
        <main className="container">
          <p className="page-subtitle">Loading…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container">
        <h1 className="page-title">Choose how you'd like to track</h1>
        <p className="page-subtitle">
          Select the option that matches your access type.
        </p>

        <div className="choice-grid">
          <div className="choice-card" onClick={() => router.push("/paid")}>
            <span className="choice-badge paid">Paid Customer</span>
            <h3>Paid Customer</h3>
            <p>Purchase access to track your application.</p>
            <button className="btn btn-accent">Continue</button>
          </div>

          <div
            className="choice-card"
            onClick={() => router.push("/subscribed")}
          >
            <span className="choice-badge sub">Subscribed Customer</span>
            <h3>Subscribed Customer</h3>
            <p>Directly view application status.</p>
            <button className="btn btn-primary">Continue</button>
          </div>
        </div>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} VFS Global — DHA Application Tracker
        (Prototype)
      </footer>
    </>
  );
}
