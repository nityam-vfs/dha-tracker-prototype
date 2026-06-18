"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import useRequireAuth from "@/lib/useRequireAuth";
import { getOrder, updateOrder } from "@/lib/order";

// Demo card details, prefilled for the prototype only.
const DEMO_CARD = {
  name: "DEMO USER",
  number: "4242 4242 4242 4242",
  expiry: "12/29",
  cvv: "123",
};

export default function PaymentPage() {
  const router = useRouter();
  const { checked } = useRequireAuth();

  const [order, setOrderState] = useState(null);
  const [card, setCard] = useState(DEMO_CARD);
  const [phase, setPhase] = useState("form"); // "form" | "processing" | "success"

  useEffect(() => {
    if (!checked) return;
    const current = getOrder();
    if (!current || !current.records?.length) {
      router.replace("/dashboard");
      return;
    }
    setOrderState(current);
  }, [checked, router]);

  if (!checked || !order) {
    return (
      <>
        <Header />
        <main className="container-narrow">
          <p className="page-subtitle">Loading…</p>
        </main>
      </>
    );
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setPhase("processing");
    // Simulate a payment gateway round-trip.
    await new Promise((r) => setTimeout(r, 1600));
    updateOrder({ paid: true, paidAt: new Date().toISOString() });
    setPhase("success");
  };

  return (
    <>
      <Header />
      <main className="container-narrow">
        {phase !== "success" && (
          <span className="back-link" onClick={() => router.push("/dashboard")}>
            ← Back to applications
          </span>
        )}

        {phase === "success" ? (
          <div className="card" style={{ textAlign: "center" }}>
            <div className="success-check">✓</div>
            <h2 className="card-title" style={{ marginBottom: 6 }}>
              Payment Successful
            </h2>
            <p className="card-subtitle">
              We've received your payment of <strong>${order.amount}</strong>.
              Your order is confirmed.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => router.push("/confirmation")}
            >
              View Order Confirmation
            </button>
          </div>
        ) : (
          <div className="card">
            <h2 className="card-title">Payment</h2>
            <p className="card-subtitle">
              Demo checkout — card details are prefilled for the prototype.
            </p>

            <div className="summary-box">
              <div className="summary-row">
                <span>
                  {order.records.length} application
                  {order.records.length > 1 ? "s" : ""} × ${order.unitPrice}
                </span>
                <strong>${order.amount}</strong>
              </div>
              <div className="summary-row total">
                <span>Total due</span>
                <strong>${order.amount}</strong>
              </div>
            </div>

            <form onSubmit={handlePay}>
              <div className="field">
                <label className="label">Cardholder Name</label>
                <input
                  className="input"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="label">Card Number</label>
                <input
                  className="input"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                />
              </div>
              <div className="card-row">
                <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="label">Expiry</label>
                  <input
                    className="input"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard({ ...card, expiry: e.target.value })
                    }
                  />
                </div>
                <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="label">CVV</label>
                  <input
                    className="input"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  />
                </div>
              </div>

              <button
                className="btn btn-accent"
                type="submit"
                disabled={phase === "processing"}
                style={{ marginTop: 18 }}
              >
                {phase === "processing" ? (
                  <span className="spinner" />
                ) : (
                  `Pay $${order.amount}`
                )}
              </button>
            </form>

            <div className="helper-note">
              This is a simulated payment. No real card is charged.
            </div>
          </div>
        )}
      </main>
    </>
  );
}
