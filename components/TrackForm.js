"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { setOrder } from "@/lib/order";
import StatusBadge from "./StatusBadge";
import ApplicationStatus from "./ApplicationStatus";
import Toast from "./Toast";

const PRICE_PER_RECORD = 5;
const emptyRecord = () => ({ passport: "", vfs_ref: "" });

export default function TrackForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState(null); // "premium" | "standard"
  const [loadingType, setLoadingType] = useState(true);

  const [records, setRecords] = useState([emptyRecord()]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [validating, setValidating] = useState(false);

  // Validation results: array of { record, valid, application } or null.
  const [validated, setValidated] = useState(null);
  const [toast, setToast] = useState("");

  // Resolve the user's category from the server (kept off the visible UI).
  useEffect(() => {
    const session = getSession();
    const currentEmail = session?.email;
    if (!currentEmail) return;
    setEmail(currentEmail);

    (async () => {
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentEmail }),
        });
        const data = await res.json();
        setUserType(data?.type === "premium" ? "premium" : "standard");
      } catch {
        setUserType("standard");
      } finally {
        setLoadingType(false);
      }
    })();
  }, []);

  const updateRecord = (index, field, value) => {
    setRecords((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
    // Any change invalidates previous results.
    if (validated) setValidated(null);
  };

  const addRecord = () => {
    setRecords((prev) => [...prev, emptyRecord()]);
    if (validated) setValidated(null);
  };

  const removeRecord = (index) => {
    setRecords((prev) => prev.filter((_, i) => i !== index));
    if (validated) setValidated(null);
  };

  const validateFields = () => {
    const next = {};
    records.forEach((r, i) => {
      if (!r.passport.trim()) next[`passport-${i}`] = "Passport is required.";
      if (!r.vfs_ref.trim()) next[`vfs_ref-${i}`] = "VFS reference is required.";
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateRecord = async (record) => {
    const res = await fetch("/api/validateApplication", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passport: record.passport.trim(),
        vfs_ref: record.vfs_ref.trim(),
      }),
    });
    const data = await res.json();
    return { record, valid: Boolean(data.valid), application: data.application };
  };

  // Both flows validate first. Premium views status for free; standard then pays.
  const handleValidate = async () => {
    setApiError("");
    setValidated(null);
    if (!validateFields()) return;

    setValidating(true);
    try {
      const settled = await Promise.all(
        records.map((r) =>
          validateRecord({
            passport: r.passport.trim(),
            vfs_ref: r.vfs_ref.trim(),
          })
        )
      );
      setValidated(settled);
      const validCount = settled.filter((s) => s.valid).length;
      setToast(
        validCount > 0
          ? `${validCount} application${validCount > 1 ? "s" : ""} validated`
          : "No matching applications found"
      );
    } catch {
      setApiError("Unable to reach the server. Please try again.");
    } finally {
      setValidating(false);
    }
  };

  // Standard: pay only for the valid (found) applications.
  const handleProceedToPayment = () => {
    const validRecords = validated
      .filter((s) => s.valid)
      .map((s) => ({ passport: s.record.passport, vfs_ref: s.record.vfs_ref }));

    if (validRecords.length === 0) return;

    setOrder({
      email,
      records: validRecords,
      unitPrice: PRICE_PER_RECORD,
      amount: validRecords.length * PRICE_PER_RECORD,
      invoiceNo: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      paid: false,
    });

    router.push("/payment");
  };

  if (loadingType) {
    return (
      <div className="card">
        <p className="page-subtitle" style={{ margin: 0 }}>
          Loading…
        </p>
      </div>
    );
  }

  const isStandard = userType === "standard";
  const validResults = validated ? validated.filter((s) => s.valid) : [];
  const payableTotal = validResults.length * PRICE_PER_RECORD;

  return (
    <div>
      <Toast message={toast} onClose={() => setToast("")} />

      <div className="card">
        <h2 className="card-title">Verify Visa / Permit Applications</h2>
        <p className="card-subtitle">
          Enter the passport number and VFS reference for each visa or permit
          you want to verify. You can add more than one.
        </p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        {records.map((record, index) => (
          <div key={index} className="record-row">
            <div className="record-head">
              <span className="record-index">Application {index + 1}</span>
              {records.length > 1 && (
                <button
                  type="button"
                  className="btn-link record-remove"
                  onClick={() => removeRecord(index)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="field-grid">
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label">Passport Number</label>
                <input
                  className={`input ${
                    errors[`passport-${index}`] ? "input-error" : ""
                  }`}
                  placeholder="e.g. P12345"
                  value={record.passport}
                  onChange={(e) =>
                    updateRecord(index, "passport", e.target.value)
                  }
                />
                {errors[`passport-${index}`] && (
                  <p className="field-hint error">
                    {errors[`passport-${index}`]}
                  </p>
                )}
              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label">VFS Reference Number</label>
                <input
                  className={`input ${
                    errors[`vfs_ref-${index}`] ? "input-error" : ""
                  }`}
                  placeholder="e.g. VFS001"
                  value={record.vfs_ref}
                  onChange={(e) =>
                    updateRecord(index, "vfs_ref", e.target.value)
                  }
                />
                {errors[`vfs_ref-${index}`] && (
                  <p className="field-hint error">
                    {errors[`vfs_ref-${index}`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn-link add-record"
          onClick={addRecord}
        >
          + Add another application
        </button>

        <div className="divider" />

        <button
          className="btn btn-primary"
          onClick={handleValidate}
          disabled={validating}
        >
          {validating ? <span className="spinner" /> : "Validate Applications"}
        </button>

        <div className="helper-note">
          Try demo records — Passport <strong>P12345</strong> / Ref{" "}
          <strong>VFS001</strong> (Under Process) or <strong>P99999</strong> /{" "}
          <strong>VFS002</strong> (Approved).
        </div>
      </div>

      {/* Validation results (both user types) */}
      {validated && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="results-toolbar">
            <h3 className="card-title" style={{ marginBottom: 0 }}>
              Validation Results
            </h3>
            {!isStandard && validResults.length > 0 && (
              <a
                className="btn btn-excel"
                href="/sample-applications.xls"
                download
              >
                ⬇ Download Excel
              </a>
            )}
          </div>
          <p className="card-subtitle">
            {validResults.length} of {validated.length} application
            {validated.length > 1 ? "s" : ""} found.
          </p>

          {validated.map((result, index) => (
            <div
              key={index}
              className={`result-row ${result.valid ? "valid" : "invalid"}`}
            >
              <div>
                <div className="result-ref">
                  {result.record.passport} / {result.record.vfs_ref}
                </div>
                <div className="result-meta">
                  {result.valid
                    ? isStandard
                      ? "Application found"
                      : `${result.application.applicant} • ${result.application.type}`
                    : "No matching application found"}
                </div>
              </div>
              {result.valid ? (
                isStandard ? (
                  <span className="status-badge status-approved">
                    <span className="status-dot" />
                    Valid
                  </span>
                ) : (
                  <StatusBadge status={result.application.status} />
                )
              ) : (
                <span className="field-hint error" style={{ margin: 0 }}>
                  Not found
                </span>
              )}
            </div>
          ))}

          {/* Premium: full status detail inline, free of charge */}
          {!isStandard &&
            validResults.map((result, index) => (
              <ApplicationStatus key={index} application={result.application} />
            ))}

          {/* Standard: pay for the valid applications to view full status */}
          {isStandard && validResults.length > 0 && (
            <>
              <div className="divider" />
              <div className="summary-row">
                <span>
                  {validResults.length} valid application
                  {validResults.length > 1 ? "s" : ""} × ${PRICE_PER_RECORD}
                </span>
                <strong>${payableTotal}</strong>
              </div>
              <button
                className="btn btn-accent"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment — ${payableTotal}
              </button>
              <p className="field-hint muted" style={{ marginTop: 10 }}>
                You only pay for applications that were successfully validated.
              </p>
            </>
          )}

          {isStandard && validResults.length === 0 && (
            <div className="alert alert-error" style={{ marginTop: 8 }}>
              None of the entered applications could be validated. Please check
              your details and try again.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
