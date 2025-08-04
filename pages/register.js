"use client";
import Layout from "@/components/layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Swal from "sweetalert2";
import { registerUser } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const loading = useSelector((state) => state.auth.loading);

  const initialValues = {
    name: "",
    email: "",
    username: "",
    company: "",
    phone: "",
    password: "",
    roleId: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must be valid (e.g. user@example.com)"
      )
      .required("Email is required"),
    username: Yup.string().required("Username is required"),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
      .min(10, "Phone number must be at least 10 digits")
      .max(13, "Phone number must be at most 15 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(8, "Min 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),

    // ✅ move roleId above company
    roleId: Yup.string().required(
      "Please select whether you are an employer or employee"
    ),

    // ✅ now this works correctly
    company: Yup.string().when("roleId", {
      is: "employer",
      then: (schema) => schema.required("Company name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const ROLE = {
    ADMIN: 1,
    JOB_POSTER: 2,
    JOB_SEEKER: 3,
  };

  const handleSubmit = async (values) => {
    if (values.roleId === "employer") {
      values.roleId = ROLE.JOB_POSTER;
    } else if (values.roleId === "employee") {
      values.roleId = ROLE.JOB_SEEKER;
    }
    const data = await dispatch(
      registerUser(values, {
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
      })
    );
    if (!data) return;
    navigate.push("/login");
    console.log("🚀data --->", data);
  };

  return (
    <>
      {/* <Layout breadcrumbTitle="Create new account" breadcrumbActive="Register"> */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-4">
        <div className="col-md-6 col-lg-6 col-xl-5">
          <div className="card shadow-sm p-3">
            <div className="text-center mb-3">
              <h4 className="text-brand-1">Register</h4>
              <p className="text-muted small">
                Start for free today. No credit card required.
              </p>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values }) => (
                <Form>
                  <div className="form-group mb-2">
                    <label htmlFor="name" className="form-label small">
                      Full Name *
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="form-control form-control-sm"
                      placeholder="John Doe"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label htmlFor="email" className="form-label small">
                      Email *
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control form-control-sm"
                      placeholder="email@example.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label htmlFor="username" className="form-label small">
                      Username *
                    </label>
                    <Field
                      type="text"
                      name="username"
                      className="form-control form-control-sm"
                      placeholder="yourusername"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label className="form-label small">Register as *</label>
                    <div className="d-flex gap-3">
                      <div className="form-check vertical-center">
                        <Field
                          type="radio"
                          name="roleId"
                          value="employer"
                          className="form-check-input"
                          id="employer"
                        />
                        <label
                          htmlFor="employer"
                          className="form-check-label small"
                        >
                          Job Poster
                        </label>
                      </div>
                      <div className="form-check vertical-center">
                        <Field
                          type="radio"
                          name="roleId"
                          value="employee"
                          className="form-check-input"
                          id="employee"
                        />
                        <label
                          htmlFor="employee"
                          className="form-check-label small"
                        >
                          Job seeker
                        </label>
                      </div>
                    </div>
                    <ErrorMessage
                      name="roleId"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>

                  {values.roleId === "employer" && (
                    <div className="form-group mb-2">
                      <label htmlFor="company" className="form-label small">
                        Company *
                      </label>
                      <Field
                        type="text"
                        name="company"
                        className="form-control form-control-sm"
                        placeholder="Your Company"
                      />
                      <ErrorMessage
                        name="company"
                        component="div"
                        className="text-danger mt-1 small"
                      />
                    </div>
                  )}

                  <div className="form-group mb-2">
                    <label htmlFor="phone" className="form-label small">
                      Phone Number *
                    </label>
                    <Field
                      type="tel"
                      name="phone"
                      className="form-control form-control-sm"
                      placeholder="+1 (555) 123-4567"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label htmlFor="password" className="form-label small">
                      Password *
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="form-control form-control-sm"
                      placeholder="********"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label small"
                    >
                      Confirm Password *
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      className="form-control form-control-sm"
                      placeholder="********"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>

                  <button
                    className="btn btn-brand-1 hover-up w-100 btn-sm button"
                    type="submit"
                    disabled={loading}
                    aria-label="Register"
                    name="login"
                  >
                    {loading ? "submiting..." : "Register"}
                  </button>

                  <div className="text-center text-muted mt-2">
                    <small>
                      Already have an account?{" "}
                      <Link href="/login">Sign in</Link>
                    </small>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* </Layout> */}
    </>
  );
}
