"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setSession } from "@/lib/session";

const HARDCODED_OTP = "123456";

export default function LoginForm() {
  const router = useRouter();

  const [step, setStep] = useState("email"); // "email" | "otp"
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});
    setInfo("");

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    try {
      // Register the user (mock or Supabase) when signing up.
      if (mode === "signup") {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrors({ email: data.message || "Sign up failed." });
          setLoading(false);
          return;
        }
      }

      // Simulate OTP dispatch.
      setStep("otp");
      setInfo(`OTP sent to ${email}. Use 123456 to continue.`);
    } catch {
      setErrors({ email: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrors({});

    if (otp.trim().length !== 6) {
      setErrors({ otp: "OTP must be 6 digits." });
      return;
    }

    if (otp.trim() !== HARDCODED_OTP) {
      setErrors({ otp: "Invalid OTP. Hint: it's 123456." });
      return;
    }

    setLoading(true);
    setSession(email.trim());
    router.push("/dashboard");
  };

  return (
    <div className="card login-card">
      <h2 className="card-title">
        {mode === "login" ? "Sign in to track" : "Create an account"}
      </h2>
      <p className="card-subtitle">
        {step === "email"
          ? "Enter your email to receive a one-time password."
          : "Enter the 6-digit OTP we sent to your email."}
      </p>

      {info && <div className="alert alert-info">{info}</div>}

      {step === "email" && (
        <form onSubmit={handleSendOtp} noValidate>
          <div className="field">
            <label className="label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className={`input ${errors.email ? "input-error" : ""}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && (
              <p className="field-hint error">{errors.email}</p>
            )}
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Send OTP"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp} noValidate>
          <div className="field">
            <label className="label" htmlFor="otp">
              One-Time Password
            </label>
            <input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              className={`input ${errors.otp ? "input-error" : ""}`}
              placeholder="123456"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
            {errors.otp ? (
              <p className="field-hint error">{errors.otp}</p>
            ) : (
              <p className="field-hint muted">Demo OTP is 123456.</p>
            )}
          </div>

          <button className="btn btn-accent" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Verify & Continue"}
          </button>

          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setStep("email");
                setOtp("");
                setInfo("");
                setErrors({});
              }}
            >
              ← Change email
            </button>
          </div>
        </form>
      )}

      <div className="divider" />

      <div style={{ textAlign: "center", fontSize: 14, color: "var(--muted)" }}>
        {mode === "login" ? "New to VFS Tracker? " : "Already have an account? "}
        <button
          type="button"
          className="btn-link"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setStep("email");
            setErrors({});
            setInfo("");
            setOtp("");
          }}
        >
          {mode === "login" ? "Create an account" : "Sign in"}
        </button>
      </div>
    </div>
  );
}
