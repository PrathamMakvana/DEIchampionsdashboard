// pages/forgot-password.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { forgotPassword } from "@/api/auth";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await forgotPassword(
        { email },
        {
          showSuccess: (message) => {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: message,
              timer: 3000,
              showConfirmButton: false,
            });
            setSubmitted(true);
          },
          showError: (errorMessage) => {
            setError(errorMessage);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: errorMessage,
            });
          },
        }
      );

      // If API returns success but no SweetAlert triggered
      if (result && result.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await forgotPassword(
        { email },
        {
          showSuccess: (message) => {
            Swal.fire({
              icon: "success",
              title: "Resent!",
              text: message,
              timer: 3000,
              showConfirmButton: false,
            });
          },
          showError: (errorMessage) => {
            setError(errorMessage);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: errorMessage,
            });
          },
        }
      );
    } catch (err) {
      setError("Failed to resend email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Head>
        <title>Forgot Password - DEI Champions Job Portal</title>
      </Head>

      <div className="auth-container">
        <div className="auth-header">
          <div className="d-flex align-items-center">
            <div className="header-logo mb-3">
              <div className="d-flex justify-content-center">
                <img
                  alt="DEI Champions"
                  src="assets/imgs/page/dashboard/logo2.png"
                  style={{ width: "60%", height: "auto" }}
                />
              </div>
            </div>
          </div>
          <h2 className="mt-4">Reset Your Password</h2>
          <p className="text-muted">
            {submitted
              ? "We've sent a reset link to your email"
              : "Enter your email to reset your password"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

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
                disabled={isLoading}
              />
              <div className="form-text">
                We'll send a password reset link to this email
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 btn-lg mb-3"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Sending Reset Link...
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
              <button
                type="button"
                className="btn btn-link text-primary p-0"
                onClick={handleResend}
                disabled={isLoading}
              >
                {isLoading ? "Resending..." : "Resend"}
              </button>{" "}
              or check your spam folder.
            </p>
            <div className="d-grid gap-2 mt-4">
              <Link href="/login" className="btn btn-outline-primary">
                Return to Login
              </Link>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
              >
                Reset Another Email
              </button>
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
