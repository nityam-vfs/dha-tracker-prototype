"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setSession } from "@/lib/session";

const HARDCODED_OTP = "123456";

export default function LoginForm() {
  const router = useRouter();

  const [step, setStep] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [robot, setRobot] = useState(false);
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSendOtp = (e) => {
    e.preventDefault();
    const next = {};

    if (!validateEmail(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!robot) {
      next.robot = "Please confirm you are not a robot.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Simulate OTP dispatch (no real provider).
    setInfo(`OTP sent to ${email}. Use 123456 to continue.`);
    setStep("otp");
  };

  const handleVerifyOtp = async (e) => {
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
    try {
      // Resolve (or create) the user account so the dashboard knows how to
      // categorize them. The category itself is never shown in the UI.
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors({ otp: data.message || "Could not sign you in." });
        setLoading(false);
        return;
      }

      setSession(email.trim().toLowerCase());
      router.push("/dashboard");
    } catch {
      setErrors({ otp: "Something went wrong. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h1 className="login-title">SIGN IN</h1>

      {info && <div className="alert alert-info">{info}</div>}

      {step === "email" && (
        <form onSubmit={handleSendOtp} noValidate>
          <div className="field">
            <label className="label" htmlFor="email">
              Email
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

          <div className="login-row">
            <label className="robot-check">
              <input
                type="checkbox"
                checked={robot}
                onChange={(e) => setRobot(e.target.checked)}
              />
              I&apos;m not a robot
            </label>
          </div>
          {errors.robot && (
            <p className="field-hint error" style={{ marginTop: 0 }}>
              {errors.robot}
            </p>
          )}

          <button className="btn btn-accent" type="submit" disabled={loading}>
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

      <p className="field-hint muted login-hint">
        Demo login — email: any address, OTP: <strong>123456</strong>. Use{" "}
        <strong>premium@vfs.com</strong> for premium access.
      </p>
    </div>
  );
}
