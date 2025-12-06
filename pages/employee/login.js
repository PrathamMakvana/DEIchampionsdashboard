"use client";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Swal from "sweetalert2";
import { loginEmployer, getuserProfileCompletionData } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import PageHead from "@/components/layout/PageHead";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);
  const profileCompletionData = useSelector(
    (state) => state.auth.profileCompletion
  );
  const [showPassword, setShowPassword] = useState(false);

  // Check profile completion and redirect if not 100%
  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (user) {
        // Dispatch to get latest profile completion data
        await dispatch(getuserProfileCompletionData());

        // Check if profile completion exists and is less than 100%
        if (
          profileCompletionData &&
          profileCompletionData.profileCompletion < 100
        ) {
          navigate.push("/employee/Profile-details");
        }
      }
    };

    checkProfileCompletion();
  }, [user, profileCompletionData, dispatch, navigate]);

  const loginInitialValues = {
    email: "",
    password: "",
    remember: false,
  };

  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleLoginSubmit = async (values) => {
    try {
      const data = await dispatch(
        loginEmployer(values, {
          showSuccess: (msg) =>
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: msg || "Welcome back 👋",
              timer: 2000,
              showConfirmButton: false,
            }),
          showError: (msg) =>
            Swal.fire({
              icon: "error",
              title: "Error",
              text: msg,
            }),
        })
      );

      if (data?.success) {
        // NEW: Check if OTP verification is required (inactive user)
        if (data?.data?.requiresOtpVerification) {
          // Show info message about OTP sent
          Swal.fire({
            icon: "info",
            title: "Verification Required",
            text: "OTP has been sent to your registered mobile number. Please verify to activate your account.",
            timer: 3000,
            showConfirmButton: false,
          });

          // Redirect to OTP verification page based on roleId
          const roleId = data.data.roleId;
          const userId = data.data.userId;

          if (roleId === 2) {
            // Employer
            navigate.push({
              pathname: "/employers/otp-verify",
              query: { userId: userId, roleId: roleId },
            });
          } else if (roleId === 3) {
            // Employee
            navigate.push({
              pathname: "/employee/otp-verify",
              query: { userId: userId, roleId: roleId },
            });
          }
          return;
        }

        // Active user - proceed with normal login flow
        // After successful login, check profile completion (for employees)
        const profileData = await dispatch(getuserProfileCompletionData());

        // Redirect based on profile completion
        if (profileData?.profileCompletion < 100) {
          navigate.push("/employee/Profile-details");
        } else {
          navigate.push("/employee");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Login failed. Please try again.",
      });
    }
  };

  return (
    <>
      <PageHead headTitle="Employee Login - DEI Champions Job Portal" />
      <div className="min-vh-100 d-flex align-items-center justify-content-center py-4 register-container">
        <div className="row justify-content-center w-100">
          <div className="col-lg-5 col-md-7 col-sm-9">
            <div className="card login-form-card border-0 mx-auto">
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="header-logo">
                    <div className="d-flex justify-content-center">
                      <img
                        alt="jobBox"
                        src="../assets/imgs/page/dashboard/logo2.png"
                        style={{ width: "75%", height: "auto" }}
                      />
                    </div>
                  </div>

                  <div className="divider-line my-3 mx-auto"></div>
                </div>

                <Formik
                  initialValues={loginInitialValues}
                  validationSchema={loginValidationSchema}
                  onSubmit={handleLoginSubmit}
                >
                  {() => (
                    <Form>
                      <div className="mb-3">
                        <label
                          htmlFor="emailField"
                          className="form-label fw-medium"
                        >
                          Email Address<span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-envelope text-primary"></i>
                          </span>
                          <Field
                            type="email"
                            name="email"
                            className="form-control form-control-lg border-start-0"
                            placeholder="Enter your email address"
                            id="emailField"
                          />
                        </div>
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="passwordField"
                          className="form-label fw-medium"
                        >
                          Password<span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-lock text-primary"></i>
                          </span>
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-control form-control-lg border-start-0"
                            placeholder="Enter your password"
                            id="passwordField"
                          />
                          <span
                            className="input-group-text bg-light border-start-0 password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i
                              className={`bi ${
                                showPassword ? "bi-eye-slash" : "bi-eye"
                              } text-muted`}
                            ></i>
                          </span>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                          <Field
                            type="checkbox"
                            name="remember"
                            className="form-check-input"
                            id="remember"
                          />
                          <label
                            htmlFor="remember"
                            className="form-check-label small"
                          >
                            Remember me
                          </label>
                        </div>
                        <Link
                          href="/forgot-password"
                          className="text-link small"
                        >
                          Forgot Password?
                        </Link>
                      </div>

                      <button
                        className="btn btn-primary w-100 btn-lg fw-bold login-btn mb-4"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </Form>
                  )}
                </Formik>

                <div className="mt-4 text-center">
                  <p className="small text-muted">
                    Don't have an account?{" "}
                    <Link
                      href="/employee/register"
                      className="text-link fw-medium"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
