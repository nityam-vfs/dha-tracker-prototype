"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrackForm from "@/components/TrackForm";
import useRequireAuth from "@/lib/useRequireAuth";

export default function DashboardPage() {
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
        <TrackForm />
      </main>

      <Footer />
    </>
  );
}
