// pages/reset-password.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { resetPassword } from "@/api/auth";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [isLoading, setIsLoading] = useState(false);

  // Formik validation schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("🚀token --->", token);
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid or missing reset token",
        });
        return;
      }

      setIsLoading(true);

      try {
        const result = await resetPassword(
          {
            token,
            newPassword: values.password,
            confirmPassword: values.confirmPassword,
          },
          {
            showSuccess: (message) => {
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: message,
                timer: 3000,
                showConfirmButton: false,
              }).then(() => {
                router.push("/login");
              });
            },
            showError: (errorMessage) => {
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
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: result.message || "Password reset successfully",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            router.push("/login");
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="auth-page">
      <Head>
        <title>Reset Password - DEI Champions Job Portal</title>
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
          <h4 className="mt-4">Set New Password</h4>
          <p className="text-muted">Create a new password for your account</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="auth-form">
          {token ? (
            <div className="alert alert-info">
              <i className="fas fa-shield-alt me-2"></i>Security token detected
            </div>
          ) : (
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>Missing or
              invalid security token
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              New Password
            </label>
            <div className="input-group">
              <input
                type="password"
                className={`form-control form-control-lg ${
                  formik.touched.password && formik.errors.password
                    ? "is-invalid"
                    : ""
                }`}
                id="password"
                name="password"
                placeholder="Enter new password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                disabled={isLoading}
              />
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="invalid-feedback d-block">
                {formik.errors.password}
              </div>
            ) : (
              <div className="form-text small">
                Must be at least 8 characters with uppercase, lowercase, and
                number
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-group">
              <input
                type="password"
                className={`form-control form-control-lg ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "is-invalid"
                    : ""
                }`}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                disabled={isLoading}
              />
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
            </div>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="invalid-feedback d-block">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 btn-lg mb-3"
            disabled={isLoading || !token || !formik.isValid}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Updating Password...
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
