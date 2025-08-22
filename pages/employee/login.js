"use client";
import Layout from "@/components/layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Swal from "sweetalert2";
import { loginUser } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const loading = useSelector((state) => state.auth.loading);
  const [showPassword, setShowPassword] = useState(false);

  const loginInitialValues = {
    email: "",
    password: "",
    remember: false,
  };

  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLoginSubmit = async (values) => {
    console.log("Login Data", values);

    try {
      const data = await dispatch(
        loginUser(values, {
          showSuccess: (msg) =>
            Swal.fire({
              icon: "info",
              title: "Please check your mail",
              text: "We’ve sent you an OTP.",
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
      console.log("🚀data --->", data);

      if (data?.success) {
        navigate.push({
          pathname: "/verify-otp",
          query: { email: values.email },
        });
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
                      <Link href="/forgot-password" className="text-link small">
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
  );
}
