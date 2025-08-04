// pages/reset-password.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="auth-page">
      <Head>
        <title>Reset Password - DEI Champions Job Portal</title>
      </Head>

      <div className="auth-container">
        <div className="auth-header">
          <div className="d-flex align-items-center">
            <div className="logo-circle bg-primary me-2">
              <span className="text-white fw-bold">DEI</span>
            </div>
            <span className="fw-bold text-dark">Champions</span>
          </div>
          <h2 className="mt-4">Set New Password</h2>
          <p className="text-muted">
            {success
              ? "Your password has been successfully reset"
              : "Create a new password for your account"}
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="auth-form">
            {token ? (
              <div className="alert alert-info">
                <i className="fas fa-shield-alt me-2"></i>Security token
                detected
              </div>
            ) : (
              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>Missing
                security token
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <div className="input-group">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
              <div className="form-text small">
                Must be at least 8 characters
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="input-group">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 btn-lg mb-3"
              disabled={isLoading || !token}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Updating...
                </>
              ) : (
                "Reset Password"
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
              <div className="circle-bg bg-success">
                <i className="fas fa-check text-white"></i>
              </div>
            </div>
            <h4 className="mb-3">Password Updated!</h4>
            <p className="text-muted mb-4">
              Your password has been successfully updated. You can now log in
              with your new credentials.
            </p>
            <div className="d-grid">
              <Link href="/login" className="btn btn-primary">
                Continue to Login
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
