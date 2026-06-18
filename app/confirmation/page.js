"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";
import useRequireAuth from "@/lib/useRequireAuth";
import { getOrder, clearOrder } from "@/lib/order";

export default function ConfirmationPage() {
  const router = useRouter();
  const { checked } = useRequireAuth();

  const [order, setOrder] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checked) return;
    const current = getOrder();
    if (!current || !current.paid) {
      router.replace("/dashboard");
      return;
    }
    setOrder(current);

    (async () => {
      try {
        const settled = await Promise.all(
          current.records.map(async (record) => {
            const res = await fetch("/api/validateApplication", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(record),
            });
            const data = await res.json();
            return {
              record,
              valid: Boolean(data.valid),
              application: data.application,
            };
          })
        );
        setResults(settled);
      } finally {
        setLoading(false);
      }
    })();
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

  const invoiceDate = new Date(order.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleDone = () => {
    clearOrder();
    router.push("/dashboard");
  };

  return (
    <>
      <Header />
      <main className="container">
        <div className="confirm-banner">
          <div className="success-check">✓</div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>
              Order Confirmed
            </h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>
              Invoice {order.invoiceNo} • {invoiceDate}
            </p>
          </div>
        </div>

        <div className="confirm-grid">
          {/* Application statuses */}
          <div className="card">
            <h2 className="card-title">Application Status</h2>
            <p className="card-subtitle">
              Results for the applications you searched.
            </p>

            {loading ? (
              <p className="page-subtitle">Fetching latest status…</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="status-item">
                  <div className="status-item-head">
                    <span className="detail-value">
                      {result.record.passport} / {result.record.vfs_ref}
                    </span>
                    {result.valid ? (
                      <StatusBadge status={result.application.status} />
                    ) : (
                      <StatusBadge status="Rejected" />
                    )}
                  </div>
                  {result.valid ? (
                    <div className="status-item-body">
                      <span className="detail-label">
                        {result.application.applicant} •{" "}
                        {result.application.type}
                      </span>
                      <div className="status-item-fields">
                        <span>
                          Permit No:{" "}
                          <strong>
                            {result.application.permit_number || "—"}
                          </strong>
                        </span>
                        <span>
                          Valid Until:{" "}
                          <strong>
                            {result.application.valid_until || "—"}
                          </strong>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="status-item-body">
                      <span className="detail-label error-text">
                        No application found for these details.
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Invoice */}
          <div className="card invoice-card">
            <div className="invoice-head">
              <div>
                <span className="invoice-logo">VFS</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="invoice-title">INVOICE</div>
                <div className="detail-label">{order.invoiceNo}</div>
              </div>
            </div>

            <div className="invoice-meta">
              <div>
                <div className="detail-label">Billed To</div>
                <div className="detail-value">{order.email}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="detail-label">Date</div>
                <div className="detail-value">{invoiceDate}</div>
              </div>
            </div>

            <div className="divider" />

            {order.records.map((record, index) => (
              <div key={index} className="detail-row">
                <span className="detail-label">
                  Application search — {record.passport}
                </span>
                <span className="detail-value">${order.unitPrice}</span>
              </div>
            ))}

            <div className="detail-row">
              <span className="detail-label">Subtotal</span>
              <span className="detail-value">${order.amount}</span>
            </div>
            <div className="invoice-total">
              <span>Total Paid</span>
              <span>${order.amount}</span>
            </div>

            <div className="paid-stamp">PAID</div>
          </div>
        </div>

        <div style={{ maxWidth: 320, margin: "8px auto 0" }}>
          <button className="btn btn-primary" onClick={handleDone}>
            Done
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}