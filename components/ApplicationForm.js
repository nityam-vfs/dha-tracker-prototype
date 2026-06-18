"use client";

import { useState } from "react";
import ApplicationStatus from "./ApplicationStatus";
import Toast from "./Toast";

/**
 * Shared lookup form for both Paid and Subscribed flows.
 * - mode="paid": requires a simulated payment step before revealing status.
 * - mode="subscribed": reveals status immediately on a valid match.
 */
export default function ApplicationForm({ mode }) {
  const isPaid = mode === "paid";

  const [passport, setPassport] = useState("");
  const [vfsRef, setVfsRef] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  const [application, setApplication] = useState(null);
  const [paid, setPaid] = useState(false);
  const [toast, setToast] = useState("");

  const validate = () => {
    const next = {};
    if (!passport.trim()) next.passport = "Passport number is required.";
    if (!vfsRef.trim()) next.vfsRef = "VFS reference number is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetResult = () => {
    setApplication(null);
    setPaid(false);
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetResult();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/validateApplication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passport: passport.trim(),
          vfs_ref: vfsRef.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setApiError(
          data.message ||
            "No application found for the provided details. Please check and try again."
        );
        return;
      }

      setApplication(data.application);

      if (isPaid) {
        // Paid flow: keep status hidden until payment is simulated.
        setPaid(false);
      } else {
        // Subscribed flow: status is immediately available.
        setToast("Application found");
      }
    } catch {
      setApiError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    // Simulate a payment gateway round-trip.
    await new Promise((r) => setTimeout(r, 1200));
    setPaying(false);
    setPaid(true);
    setToast("Payment successful");
  };

  const showStatus = isPaid ? application && paid : Boolean(application);

  return (
    <div>
      <Toast message={toast} onClose={() => setToast("")} />

      <div className="card">
        <h2 className="card-title">
          {isPaid ? "Paid Application Lookup" : "Subscriber Lookup"}
        </h2>
        <p className="card-subtitle">
          {isPaid
            ? "Validate your details, complete payment, and view your status."
            : "Enter your details to view your application status instantly."}
        </p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="label" htmlFor="passport">
              Passport Number
            </label>
            <input
              id="passport"
              className={`input ${errors.passport ? "input-error" : ""}`}
              placeholder="e.g. P12345"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
            />
            {errors.passport && (
              <p className="field-hint error">{errors.passport}</p>
            )}
          </div>

          <div className="field">
            <label className="label" htmlFor="vfsRef">
              VFS Reference Number
            </label>
            <input
              id="vfsRef"
              className={`input ${errors.vfsRef ? "input-error" : ""}`}
              placeholder="e.g. VFS001"
              value={vfsRef}
              onChange={(e) => setVfsRef(e.target.value)}
            />
            {errors.vfsRef && (
              <p className="field-hint error">{errors.vfsRef}</p>
            )}
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Validate Application"}
          </button>
        </form>

        <div className="helper-note">
          Try demo records — Passport <strong>P12345</strong> / Ref{" "}
          <strong>VFS001</strong> (Under Process) or <strong>P99999</strong> /{" "}
          <strong>VFS002</strong> (Approved).
        </div>
      </div>

      {/* Paid flow: payment step shown after a valid match, before status. */}
      {isPaid && application && !paid && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="alert alert-success">
            ✓ Application verified. Complete payment to view your status.
          </div>
          <button
            className="btn btn-accent"
            onClick={handlePayment}
            disabled={paying}
          >
            {paying ? <span className="spinner" /> : "Proceed to Payment"}
          </button>
        </div>
      )}

      {showStatus && <ApplicationStatus application={application} />}
    </div>
  );
}
