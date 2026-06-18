"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ApplicationForm from "@/components/ApplicationForm";
import useRequireAuth from "@/lib/useRequireAuth";

export default function SubscribedPage() {
  const router = useRouter();
  const { checked } = useRequireAuth();

  if (!checked) {
    return (
      <>
        <Header />
        <main className="container-narrow">
          <p className="page-subtitle">Loading…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container-narrow">
        <span className="back-link" onClick={() => router.push("/dashboard")}>
          ← Back to dashboard
        </span>
        <ApplicationForm mode="subscribed" />
      </main>
    </>
  );
}
