"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { getVerifyEmail } from "@/api/auth";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showVerificationButton, setShowVerificationButton] = useState(true);

  const verifyEmail = async () => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Invalid Link",
        text: "Verification token is missing. Please use the link from your email.",
      });
      return;
    }

    setIsVerifying(true);
    setShowVerificationButton(false);

    try {
      const response = await getVerifyEmail(token);

      if (response && response.success) {
        setIsVerified(true);
        Swal.fire({
          icon: "success",
          title: "Email Verified!",
          text:
            response.message || "Your email has been successfully verified.",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        // Handle API response with error
        const errorMessage = response?.message || "Verification failed";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setIsError(true);

      let errorTitle = "Verification Failed";
      let errorText =
        error.message || "Failed to verify email. Please try again.";

      if (error.message.includes("expired")) {
        errorTitle = "Link Expired";
        errorText =
          "This verification link has expired. Please request a new one.";
      } else if (
        error.message.includes("Invalid") ||
        error.message.includes("invalid")
      ) {
        errorTitle = "Invalid Link";
        errorText =
          "This verification link is invalid. Please use the link from your email.";
      } else if (error.message.includes("already verified")) {
        errorTitle = "Already Verified";
        errorText = "Your email is already verified. You can proceed to login.";
        setIsVerified(true);
      }

      Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorText,
        confirmButtonText: "Try Again",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  const handleGoToDashboard = () => {
    router.push("/employee");
  };

  const handleVerifyClick = () => {
    verifyEmail();
  };

  return (
    <div className="verify-e-container min-vh-100 d-flex align-items-center justify-content-center py-4">
      <style jsx>{`
        .verify-e-card {
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border: none;
          overflow: hidden;
        }

        .verify-e-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
          text-align: center;
        }

        .verify-e-logo {
          width: 120px;
          height: 120px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          border: 3px solid rgba(255, 255, 255, 0.3);
        }

        .verify-e-title {
          color: white;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .verify-e-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
        }

        .verify-e-body {
          padding: 3rem;
        }

        .verify-e-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .verify-e-success {
          color: #28a745;
        }

        .verify-e-error {
          color: #dc3545;
        }

        .verify-e-loading {
          color: #667eea;
        }

        .verify-e-message {
          font-size: 1.2rem;
          color: #6c757d;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .verify-e-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          padding: 12px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .verify-e-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }

        .verify-e-btn:active {
          transform: translateY(0);
        }

        .verify-e-btn-outline {
          background: transparent;
          border: 2px solid #667eea;
          color: #667eea;
          box-shadow: none;
        }

        .verify-e-btn-outline:hover {
          background: #667eea;
          color: white;
        }

        .verify-e-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .verify-e-progress {
          height: 6px;
          background: #e9ecef;
          border-radius: 3px;
          overflow: hidden;
          margin: 2rem 0;
        }

        .verify-e-progress-bar {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
          animation: progress-animation 2s ease-in-out infinite;
        }

        @keyframes progress-animation {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .verify-e-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .verify-e-feature {
          text-align: center;
          padding: 1rem;
          border-radius: 10px;
          background: rgba(102, 126, 234, 0.1);
          transition: transform 0.3s ease;
        }

        .verify-e-feature:hover {
          transform: translateY(-5px);
        }

        .verify-e-feature-icon {
          font-size: 2rem;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .verify-e-back-link {
          color: #6c757d;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .verify-e-back-link:hover {
          color: #667eea;
        }

        .verify-e-instructions {
          background: rgba(102, 126, 234, 0.05);
          border-left: 4px solid #667eea;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 2rem 0;
          text-align: left;
        }

        .verify-e-instructions h5 {
          color: #667eea;
          margin-bottom: 1rem;
        }

        .verify-e-instructions ol {
          padding-left: 1.5rem;
          margin-bottom: 0;
        }

        .verify-e-instructions li {
          margin-bottom: 0.5rem;
          color: #6c757d;
        }
      `}</style>

      <div className="row justify-content-center w-100">
        <div className="col-lg-5 col-md-8 col-sm-10">
          <div className="verify-e-card">
            {/* Header */}
            <div className="verify-e-header">
              {/* <h1 className="verify-e-title">Email Verification</h1>
              <p className="verify-e-subtitle">Securing your account</p> */}
            </div>

            {/* Body */}
            <div className="verify-e-body text-center">
              <div className="text-center mb-5">
                <div className="header-logo mb-4">
                  <div className="d-flex justify-content-center">
                    <img
                      alt="jobBox"
                      src="../assets/imgs/page/dashboard/logo2.png"
                      style={{ width: "75%", height: "auto" }}
                    />
                  </div>
                </div>
                <h3 className="fw-bold text-gradient mb-2">
                  Email Verification
                </h3>
                <p className="text-muted">Securing your account</p>
                <div className="divider-line my-3 mx-auto"></div>
              </div>
              {showVerificationButton && !isVerified && !isError && (
                <div className="verify-e-welcome-section">
                  <div className="verify-e-icon verify-e-loading">
                    <i className="bi bi-envelope-check"></i>
                  </div>
                  <h3 className="fw-bold mb-3">Verify Your Email Address</h3>
                  <p className="verify-e-message">
                    Welcome! To complete your registration and secure your
                    account, please verify your email address by clicking the
                    button below.
                  </p>

                  <button
                    className="verify-e-btn btn text-white verify-e-animation"
                    onClick={handleVerifyClick}
                    disabled={!token}
                  >
                    <i className="bi bi-shield-check me-2"></i>
                    {token ? "Verify My Email" : "Invalid Verification Link"}
                  </button>

                  {!token && (
                    <div className="alert alert-warning mt-3">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Verification token is missing. Please use the link from
                      your email.
                    </div>
                  )}
                </div>
              )}

              {isVerifying && (
                <div className="verify-e-loading-section">
                  <div className="verify-e-icon verify-e-loading verify-e-animation">
                    <i className="bi bi-envelope-check"></i>
                  </div>
                  <h3 className="fw-bold mb-3">Verifying Your Email</h3>
                  <p className="verify-e-message">
                    Please wait while we verify your email address. This will
                    only take a moment...
                  </p>
                  <div className="verify-e-progress">
                    <div className="verify-e-progress-bar"></div>
                  </div>
                </div>
              )}

              {isVerified && (
                <div className="verify-e-success-section">
                  <div className="verify-e-icon verify-e-success verify-e-animation">
                    <i className="bi bi-patch-check"></i>
                  </div>
                  <h3 className="fw-bold mb-3 text-success">
                    Email Verified Successfully!
                  </h3>
                  <p className="verify-e-message">
                    Congratulations! Your email has been successfully verified.
                    You now have full access to all features of your account.
                  </p>

                  <div className="verify-e-features">
                    <div className="verify-e-feature">
                      <div className="verify-e-feature-icon">
                        <i className="bi bi-person-check"></i>
                      </div>
                      <h6>Profile Complete</h6>
                      <small>Your account is now fully verified</small>
                    </div>
                    <div className="verify-e-feature">
                      <div className="verify-e-feature-icon">
                        <i className="bi bi-shield-lock"></i>
                      </div>
                      <h6>Secure Access</h6>
                      <small>Enhanced account security</small>
                    </div>
                    <div className="verify-e-feature">
                      <div className="verify-e-feature-icon">
                        <i className="bi bi-bell"></i>
                      </div>
                      <h6>Notifications</h6>
                      <small>Receive important updates</small>
                    </div>
                  </div>

                  <button
                    className="verify-e-btn btn text-white verify-e-animation"
                    onClick={handleGoToDashboard}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    Go to Dashboard
                  </button>
                </div>
              )}

              {isError && (
                <div className="verify-e-error-section">
                  <div className="verify-e-icon verify-e-error">
                    <i className="bi bi-exclamation-triangle"></i>
                  </div>
                  <h3 className="fw-bold mb-3 text-danger">
                    Verification Failed
                  </h3>
                  <p className="verify-e-message">
                    We couldn't verify your email address. This might be due to
                    an expired verification link or technical issues.
                  </p>

                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <button
                      className="verify-e-btn btn text-white"
                      onClick={handleVerifyClick}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Try Again
                    </button>
                    <Link href="/login" className="btn verify-e-btn-outline">
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Login
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
