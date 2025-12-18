"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resendMobileOtp, verifyOtpUser } from "@/api/auth";

export default function VerifyOTP() {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const { userId, roleId, email = "" } = navigate.query; // Get userId, roleId, and email from query params
  const loading = useSelector((state) => state.auth.loading);

  const [mobileOtpValues, setMobileOtpValues] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [resendTimer, setResendTimer] = useState(600); // 10 minutes in seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const mobileOtpRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (mobileOtpRefs.current[0]) {
      mobileOtpRefs.current[0].focus();
    }
  }, []);

  // Start resend timer on component mount
  useEffect(() => {
    if (userId && roleId) {
      startResendTimer();
    }
  }, [userId, roleId]);

  // Format timer to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (!/^[0-9]*$/.test(value)) return;

    const newMobileOtpValues = [...mobileOtpValues];
    newMobileOtpValues[index] = value;
    setMobileOtpValues(newMobileOtpValues);

    // Auto-focus next input
    if (value && index < 5) {
      mobileOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !mobileOtpValues[index] && index > 0) {
      mobileOtpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, ""); // Remove non-digits

    if (pastedData.length >= 6) {
      const newOtpValues = pastedData.slice(0, 6).split("");
      setMobileOtpValues(newOtpValues);
      const lastIndex = Math.min(5, newOtpValues.length - 1);
      mobileOtpRefs.current[lastIndex]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const mobileOtpCode = mobileOtpValues.join("");

    // Check if mobile OTP is provided
    if (mobileOtpCode.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Incomplete OTP",
        text: "Please enter mobile OTP (6 digits)",
      });
      return;
    }

    // Check if userId and roleId are available
    if (!userId || !roleId) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "User information not found. Please try again.",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const payload = {
        userId: userId,
        roleId: roleId,
        emailOtp: null, // Set to null for employees
        mobileOtp: mobileOtpCode,
      };

      console.log("Sending OTP payload:", payload); // For debugging

      const data = await dispatch(
        verifyOtpUser(payload, {
          showSuccess: (msg) =>
            Swal.fire({
              icon: "success",
              title: "Verification Successful!",
              text: msg,
              timer: 2000,
              showConfirmButton: false,
            }),
          showError: (msg) =>
            Swal.fire({
              icon: "error",
              title: "Verification Failed",
              text: msg,
            }),
        })
      );

      if (data?.success) {
        navigate.push("/job-seeker/update-profile");
      } else {
        // clear OTPs if invalid
        setMobileOtpValues(["", "", "", "", "", ""]);
        mobileOtpRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: error.message || "Invalid OTP code. Please try again.",
      });
      setMobileOtpValues(["", "", "", "", "", ""]);
      mobileOtpRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(600); // 10 minutes
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
      console.log("Resending OTP for:", { userId, roleId, email });

      // Replace this with your actual resend OTP API call
      const response = await resendOtpAPI(userId, roleId, email);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "OTP Sent",
          text: "New verification code has been sent to your mobile",
          timer: 1500,
          showConfirmButton: false,
        });

        startResendTimer();
        setMobileOtpValues(["", "", "", "", "", ""]);
        mobileOtpRefs.current[0]?.focus();
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

  const resendOtpAPI = async (userId, roleId, email) => {
    return resendMobileOtp({ userId });
  };

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
                  Verify Your Account
                </h3>
                <p className="text-muted">
                  We've sent verification code to your mobile number
                </p>
                {email && <p className="fw-medium text-primary">{email}</p>}
                <div className="divider-line my-3 mx-auto"></div>

                {/* Expiry Timer */}
                <div className="alert alert-warning py-2 mb-3">
                  <div className="d-flex align-items-center justify-content-center">
                    <i className="bi bi-clock-history me-2"></i>
                    <span className="fw-medium">
                      Code expires in: {formatTime(resendTimer)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile OTP Input */}
              <div className="mb-4">
                <label className="form-label fw-medium text-center d-block mb-3">
                  Mobile Verification Code
                </label>
                <div
                  className="d-flex justify-content-center gap-2 otp-container"
                  onPaste={handlePaste}
                >
                  {mobileOtpValues.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => (mobileOtpRefs.current[index] = el)}
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
                  <i className="bi bi-phone me-1"></i>
                  Check your mobile for the verification code
                </p>
              </div>

              <div className="alert alert-info py-2 mb-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-info-circle me-2"></i>
                  <small>
                    Enter the 6-digit OTP sent to your mobile number to verify
                    your account
                  </small>
                </div>
              </div>

              {/* Verify Button */}
              <button
                className="btn btn-success w-100 btn-lg fw-bold verify-btn mb-4"
                onClick={handleOtpSubmit}
                disabled={isVerifying || mobileOtpValues.join("").length !== 6}
              >
                {isVerifying ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
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
                    Resend in {formatTime(resendTimer)}
                  </p>
                ) : (
                  <button
                    className="btn btn-link p-0 text-link fw-medium"
                    onClick={handleResendOtp}
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
