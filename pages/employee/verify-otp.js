"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function VerifyOTP() {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const { email } = navigate.query; // Get email from query params
  const loading = useSelector((state) => state.auth.loading);

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = useRef([]);

  //   // Redirect to login if no email is provided
  //   useEffect(() => {
  //     if (!email && navigate.isReady) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Access Denied",
  //         text: "Please login first to access this page.",
  //       }).then(() => {
  //         navigate.push("/login");
  //       });
  //     }
  //   }, [email, navigate.isReady]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, []);

  // Start resend timer on component mount
  useEffect(() => {
    if (email) {
      startResendTimer();
    }
  }, [email]);

  const handleOtpChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (!/^[0-9]*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, ""); // Remove non-digits

    if (pastedData.length >= 6) {
      const newOtpValues = pastedData.slice(0, 6).split("");
      setOtpValues(newOtpValues);

      // Focus the last input or next empty input
      const lastIndex = Math.min(5, newOtpValues.length - 1);
      otpRefs.current[lastIndex]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otpValues.join("");

    if (otpCode.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Incomplete OTP",
        text: "Please enter the complete 6-digit OTP code",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Replace this with your actual OTP verification API call
      console.log("Verifying OTP:", otpCode, "for email:", email);

      // Simulate API call
      const response = await verifyOtpAPI(email, otpCode);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Verification Successful!",
          text: "You have been successfully logged in.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Store auth token if provided
        if (response.token) {
          localStorage.setItem("authToken", response.token);
        }

        // Redirect to dashboard or intended page
        setTimeout(() => {
          navigate.push("/dashboard");
        }, 2000);
      } else {
        throw new Error(response.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: error.message || "Invalid OTP code. Please try again.",
      });

      // Clear OTP inputs and focus first input
      setOtpValues(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    try {
      console.log("Resending OTP to:", email);

      // Replace this with your actual resend OTP API call
      const response = await resendOtpAPI(email);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "OTP Sent",
          text: "A new verification code has been sent to your email",
          timer: 1500,
          showConfirmButton: false,
        });

        startResendTimer();
        setOtpValues(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      } else {
        throw new Error(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);

      Swal.fire({
        icon: "error",
        title: "Resend Failed",
        text: error.message || "Failed to resend OTP. Please try again.",
      });
    }
  };

  // Mock API functions - replace with your actual API calls
  const verifyOtpAPI = async (email, otp) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock verification logic
    if (otp === "123456") {
      return {
        success: true,
        message: "OTP verified successfully",
        token: "mock-jwt-token-here",
      };
    } else {
      return {
        success: false,
        message: "Invalid OTP code",
      };
    }
  };

  const resendOtpAPI = async (email) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "OTP sent successfully",
    };
  };

  //   if (!email) {
  //     return null; // Will redirect to login
  //   }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4 register-container">
      <div className="row justify-content-center w-100">
        <div className="col-lg-5 col-md-7 col-sm-9">
          <div className="card login-form-card border-0 mx-auto">
            <div className="card-body p-5">
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
                  Verify Your Email
                </h3>
                <p className="text-muted">
                  We've sent a 6-digit verification code to
                </p>
                <p className="fw-medium text-primary">{email}</p>
                <div className="divider-line my-3 mx-auto"></div>
              </div>

              {/* OTP Input */}
              <div className="mb-4">
                <label className="form-label fw-medium text-center d-block mb-3">
                  Enter Verification Code
                </label>
                <div
                  className="d-flex justify-content-center gap-2 otp-container"
                  //   onPaste={handlePaste}
                >
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      className="form-control otp-input text-center"
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength="1"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      disabled={isVerifying}
                    />
                  ))}
                </div>
                <p className="small text-muted text-center mt-2">
                  <i className="bi bi-info-circle me-1"></i>
                  You can paste the complete code from your email
                </p>
              </div>

              {/* Verify Button */}
              <button
                className="btn btn-success w-100 btn-lg fw-bold verify-btn mb-4"
                // onClick={handleOtpSubmit}
                disabled={isVerifying || otpValues.join("").length !== 6}
              >
                {isVerifying ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Verify & Continue
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="small text-muted mb-2">
                  Didn't receive the code?
                </p>
                {resendTimer > 0 ? (
                  <p className="small text-primary">
                    <i className="bi bi-clock me-1"></i>
                    Resend in {resendTimer}s
                  </p>
                ) : (
                  <button
                    className="btn btn-link p-0 text-link fw-medium"
                    // onClick={handleResendOtp}
                    disabled={isVerifying}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Resend Code
                  </button>
                )}
              </div>

              {/* Back to login */}
              <div className="mt-4 text-center">
                <Link
                  href="/login"
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
