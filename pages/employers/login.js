"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Swal from "sweetalert2";
import { loginEmployer } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";

const LoginPage = () => {
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
    email: Yup.string()
      .email("Invalid email address")
      .test("is-company-email", "Only company email is allowed", (value) => {
        if (!value) return false;

        // Block list (public domains)
        const publicDomains = [
          "gmail.com",
          "yahoo.com",
          "hotmail.com",
          "outlook.com",
          "live.com",
          "icloud.com",
          "aol.com",
          "protonmail.com",
          "zoho.com",
        ];

        const domain = value.split("@")[1];
        return domain && !publicDomains.includes(domain.toLowerCase());
      })
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLoginSubmit = async (values) => {
    try {
      const data = await dispatch(
        loginEmployer(values, {
          showSuccess: () =>
            Swal.fire({
              icon: "success",
              title: "Login Successful!",
              text: "Welcome back 👋",
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

      console.log("🚀data 222--->", data);

      if (data?.success) {
        navigate.push("/employers");
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
    <div className="box-content">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="rt-card bg-white p-4 p-md-5 position-relative overflow-hidden">
            <div className="rt-decoration rt-decoration-1"></div>
            <div className="rt-decoration rt-decoration-2"></div>

            <div className="header-logo mb-3">
              <div className="d-flex justify-content-center">
                <img
                  alt="jobBox"
                  src="../assets/imgs/page/dashboard/logo2.png"
                  style={{ width: "60%", height: "auto" }}
                />
              </div>
            </div>

            <h2 className="text-center mb-4">Recruiter Login</h2>
            <p className="text-center text-muted mb-4">
              Access your Dei Champions recruiter account to find top diverse
              talent
            </p>

            <Formik
              initialValues={loginInitialValues}
              validationSchema={loginValidationSchema}
              onSubmit={handleLoginSubmit}
            >
              {() => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Company Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <Field
                        type="email"
                        name="email"
                        className="form-control rt-input"
                        id="email"
                        placeholder="your@company.com"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger small mt-1"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control rt-input"
                        id="password"
                        placeholder="••••••••"
                      />
                      <span
                        className="input-group-text password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
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
                      <label className="form-check-label" htmlFor="remember">
                        Remember me
                      </label>
                    </div>
                    <Link href="/forgot-password" className="rt-link">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    className="btn rt-btn-primary w-100 py-2 mb-3"
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
                      "Login"
                    )}
                  </button>

                  <div className="rt-divider">
                    <span className="rt-divider-text">OR</span>
                  </div>

                  <div className="text-center mt-3">
                    <p>
                      New to Dei Champions?{" "}
                      <Link href="/employers/register" className="rt-link">
                        Create recruiter account
                      </Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
