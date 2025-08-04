// pages/forgot-password.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="auth-page">
      <Head>
        <title>Forgot Password - DEI Champions Job Portal</title>
      </Head>

      <div className="auth-container">
        <div className="auth-header">
          <div className="d-flex align-items-center">
            <div className="logo-circle bg-primary me-2">
              <span className="text-white fw-bold">DEI</span>
            </div>
            <span className="fw-bold text-dark">Champions</span>
          </div>
          <h2 className="mt-4">Reset Your Password</h2>
          <p className="text-muted">
            {submitted
              ? "We've sent a reset link to your email"
              : "Enter your email to reset your password"}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                id="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="form-text">
                We'll send a password reset link to this email
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 btn-lg mb-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <div className="text-center mt-3">
              <Link href="/login" className="text-decoration-none">
                <i className="fas fa-arrow-left me-2"></i>Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="auth-success text-center">
            <div className="success-icon mb-4">
              <div className="circle-bg bg-primary">
                <i className="fas fa-check text-white"></i>
              </div>
            </div>
            <h4 className="mb-3">Reset Email Sent!</h4>
            <p className="text-muted mb-4">
              We've sent instructions to reset your password to{" "}
              <strong>{email}</strong>. Please check your inbox and follow the
              link to create a new password.
            </p>
            <p className="text-muted small">
              Didn't receive the email?{" "}
              <a href="#" className="text-primary">
                Resend
              </a>{" "}
              or check your spam folder.
            </p>
            <div className="d-grid mt-4">
              <Link href="/login" className="btn btn-outline-primary">
                Return to Login
              </Link>
            </div>
          </div>
        )}

        <div className="auth-footer mt-4 text-center">
          <p className="text-muted small mb-0">
            © {new Date().getFullYear()} DEI Champions Job Portal. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
