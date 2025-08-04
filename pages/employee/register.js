"use client";
import Layout from "@/components/layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Swal from "sweetalert2";
import { registerUser } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const loading = useSelector((state) => state.auth.loading);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    workStatus: "",
    acceptUpdates: false,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .required("Mobile number is required"),
    workStatus: Yup.string()
      .required("Work status is required")
      .oneOf(["experienced", "fresher"], "Invalid work status"),
  });

  const handleSubmit = async (values) => {
    const roleId = values.workStatus === "experienced" ? 2 : 3;

    const data = await dispatch(
      registerUser(
        { ...values, roleId },
        {
          showSuccess: (msg) =>
            Swal.fire({
              icon: "success",
              title: "Success",
              text: msg,
              timer: 1500,
              showConfirmButton: false,
            }),
          showError: (msg) =>
            Swal.fire({
              icon: "error",
              title: "Error",
              text: msg,
            }),
        }
      )
    );
    if (!data) return;
    navigate.push("/login");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4 register-container">
      <div
        className="row justify-content-center w-100"
        style={{ marginTop: "2rem" }}
      >
        {/* Left Info Section */}
        <div className="col-lg-5 mb-4 mb-lg-0">
          <div className="info-card h-100">
            <div className="card-body text-center d-flex flex-column">
              <div className="decorative-shape">
                <div className="shape-circle"></div>
              </div>

              <div className="mt-5 pt-4">
                <h3 className="mb-4 text-gradient">Unlock Your Potential</h3>
                <ul className="list-unstyled text-start ps-0">
                  <li className="mb-3 d-flex align-items-start">
                    <div className="icon-badge bg-primary me-3">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Build Your Profile</h5>
                      <p className="mb-0 small">
                        Let recruiters find you based on your skills and
                        experience
                      </p>
                    </div>
                  </li>

                  <li className="mb-3 d-flex align-items-start">
                    <div className="icon-badge bg-info me-3">
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Job Alerts</h5>
                      <p className="mb-0 small">
                        Get personalized job recommendations delivered to your
                        inbox
                      </p>
                    </div>
                  </li>

                  <li className="d-flex align-items-start">
                    <div className="icon-badge bg-success me-3">
                      <i className="bi bi-emoji-smile-fill"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Career Growth</h5>
                      <p className="mb-0 small">
                        Find opportunities that match your skills and career
                        goals
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-auto pt-4">
                <div className="testimonial-card p-3 rounded">
                  <div className="d-flex align-items-center">
                    <div className="avatar me-3">
                      <div
                        className="bg-light text-dark rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <i className="bi bi-person-fill fs-4"></i>
                      </div>
                    </div>
                    <div>
                      <p className="mb-0 fst-italic text-white">
                        "DEI Champions helped me find my dream job in just 2
                        weeks!"
                      </p>
                      <p className="mb-0 small mt-1 text-white">
                        - Priya Sharma, Product Designer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="col-lg-6">
          <div className="card register-form-card border-0 mx-auto">
            <div className="card-body" style={{ padding: "3rem" }}>
              <div className="text-center mb-4">
                <h2 className="fw-bold text-gradient mb-1">
                  Join DEI Champions
                </h2>
                <p className="mb-0">
                  Create your profile and start your journey today
                </p>
                <div className="divider-line my-3 mx-auto"></div>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values }) => (
                  <Form>
                    {/* Full Name */}
                    <div className="mb-3">
                      <label
                        htmlFor="nameField"
                        className="form-label fw-medium"
                      >
                        Full name<span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person text-primary"></i>
                        </span>
                        <Field
                          type="text"
                          name="name"
                          className="form-control form-control-lg border-start-0"
                          placeholder="Enter your full name"
                          id="nameField"
                        />
                      </div>
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label
                        htmlFor="emailField"
                        className="form-label fw-medium"
                      >
                        Email ID<span className="text-danger">*</span>
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
                      <div className="form-text small">
                        We'll send relevant jobs and updates to this email
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    {/* Password */}
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
                          placeholder="Create a strong password"
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
                      <div className="form-text small">
                        This helps your account stay protected
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                      <label
                        htmlFor="phoneField"
                        className="form-label fw-medium"
                      >
                        Mobile number<span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-phone text-primary"></i>
                        </span>
                        <span className="input-group-text bg-light border-end-0 border-start-0 country-code">
                          +91
                        </span>
                        <Field
                          type="tel"
                          name="phone"
                          className="form-control form-control-lg border-start-0"
                          placeholder="Enter 10-digit mobile number"
                          id="phoneField"
                          maxLength="10"
                        />
                      </div>
                      <div className="form-text small">
                        Recruiters will contact you on this number
                      </div>
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    {/* Work Status */}
                    <div className="mb-4">
                      <label className="form-label fw-medium d-block mb-3">
                        Work status<span className="text-danger">*</span>
                      </label>
                      <div className="d-flex gap-3 status-cards">
                        <label
                          className={`status-card ${
                            values.workStatus === "experienced" ? "active" : ""
                          }`}
                        >
                          <Field
                            type="radio"
                            name="workStatus"
                            value="experienced"
                            className="d-none"
                          />
                          <div className="card-icon">
                            <i className="bi bi-briefcase-fill"></i>
                          </div>
                          <div className="fw-medium">I'm experienced</div>
                          <div className="small text-muted">
                            I have work experience (excluding internships)
                          </div>
                        </label>

                        <label
                          className={`status-card ${
                            values.workStatus === "fresher" ? "active" : ""
                          }`}
                        >
                          <Field
                            type="radio"
                            name="workStatus"
                            value="fresher"
                            className="d-none"
                          />
                          <div className="card-icon">
                            <i className="bi bi-mortarboard-fill"></i>
                          </div>
                          <div className="fw-medium">I'm a fresher</div>
                          <div className="small text-muted">
                            I am a student/Haven't worked after graduation
                          </div>
                        </label>
                      </div>
                      <ErrorMessage
                        name="workStatus"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    {/* Updates Checkbox */}
                    <div className="mb-4">
                      <div className="form-check">
                        <Field
                          type="checkbox"
                          name="acceptUpdates"
                          className="form-check-input"
                          id="acceptUpdates"
                        />
                        <label
                          htmlFor="acceptUpdates"
                          className="form-check-label small"
                        >
                          Send me important updates & promotions via SMS, email,
                          and WhatsApp
                        </label>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      className="btn btn-primary w-100 btn-lg fw-bold register-btn"
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
                          Registering...
                        </>
                      ) : (
                        "Register now"
                      )}
                    </button>
                  </Form>
                )}
              </Formik>

              {/* Terms */}
              <div className="mt-4 text-center small terms-text">
                <p>
                  By clicking Register, you agree to the{" "}
                  <Link href="#" className="text-link">
                    Terms and Conditions
                  </Link>{" "}
                  &{" "}
                  <Link href="#" className="text-link">
                    Privacy Policy
                  </Link>{" "}
                  of DEI Champions.com
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-4 text-center small footer-links">
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-2">
            <Link href="#" className="text-muted">
              About Us
            </Link>
            <Link href="#" className="text-muted">
              Contact Us
            </Link>
            <Link href="#" className="text-muted">
              FAQs
            </Link>
            <Link href="#" className="text-muted">
              Terms and Conditions
            </Link>
            <Link href="#" className="text-muted">
              Report a Problem
            </Link>
            <Link href="#" className="text-muted">
              Privacy Policy
            </Link>
          </div>
          <div className="text-muted">
            All rights reserved © {new Date().getFullYear()} Info Edge India
            Ltd.
          </div>
        </div>
      </div>
    </div>
  );
}
