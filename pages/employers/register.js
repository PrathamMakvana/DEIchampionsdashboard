"use client";
import Layout from "@/components/layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Swal from "sweetalert2";
import { registerJobPoster } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";

export default function JobPosterRegistration() {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const loading = useSelector((state) => state.auth.loading);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const initialValues = {
    mobile: "",
    accountType: "individual",
    fullName: "",
    email: "",
    password: "",
    companyName: "",
    companyEmail: "",
    designation: "",
    companySize: "",
    industry: "",
    website: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    acceptTerms: false,
  };

  const step1ValidationSchema = Yup.object().shape({
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid mobile number")
      .required("Mobile number is required"),
    accountType: Yup.string()
      .required("Account type is required")
      .oneOf(["company", "individual"], "Invalid account type"),
  });

  const step2ValidationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number and special character"
      )
      .required("Password is required"),
  });

  const step3ValidationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company name is required"),
    companyEmail: Yup.string()
      .email("Invalid email address")
      .required("Company email is required"),
    designation: Yup.string().required("Designation is required"),
    companySize: Yup.string().required("Company size is required"),
    industry: Yup.string().required("Industry is required"),
  });

  const finalValidationSchema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Invalid pincode")
      .required("Pincode is required"),
    acceptTerms: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions")
      .required("You must accept the terms and conditions"),
  });

  const getValidationSchema = () => {
    switch (currentStep) {
      case 1:
        return step1ValidationSchema;
      case 2:
        return step2ValidationSchema;
      case 3:
        return step3ValidationSchema;
      case 4:
        return finalValidationSchema;
      default:
        return step1ValidationSchema;
    }
  };

  const handleSubmit = async (values) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    console.log("Job Poster Registration Data", values);

    const data = await dispatch(
      registerJobPoster(values, {
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
  };

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Real Estate",
    "Media",
    "Other",
  ];

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const renderStep1 = (values) => (
    <div className="form-section">
      <h2 className="section-title">
        <i className="bi bi-person-badge me-2"></i>
        Basic Details
      </h2>
      <p className="mb-4 text-muted">
        We need these details to identify you and create your account
      </p>

      <div className="mb-4">
        <label className="form-label">
          Mobile Number<span className="text-danger">*</span>
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
            name="mobile"
            className="form-control form-control-lg border-start-0"
            placeholder="Enter your mobile number"
            maxLength="10"
          />
        </div>
        <ErrorMessage
          name="mobile"
          component="div"
          className="text-danger small mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="form-label">
          You're creating account as<span className="text-danger">*</span>
        </label>
        <div className="status-cards">
          <label
            className={`status-card ${
              values.accountType === "company" ? "active" : ""
            }`}
          >
            <Field
              type="radio"
              name="accountType"
              value="company"
              className="d-none"
            />
            <div className="card-icon">
              <i className="bi bi-building"></i>
            </div>
            <h5 className="fw-medium">Company/Business</h5>
            <p className="text-muted small mb-0">Registered business entity</p>
          </label>

          <label
            className={`status-card ${
              values.accountType === "individual" ? "active" : ""
            }`}
          >
            <Field
              type="radio"
              name="accountType"
              value="individual"
              className="d-none"
            />
            <div className="card-icon">
              <i className="bi bi-person"></i>
            </div>
            <h5 className="fw-medium">Individual/Proprietor</h5>
            <p className="text-muted small mb-0">
              Sole proprietor or individual
            </p>
          </label>
        </div>
        <ErrorMessage
          name="accountType"
          component="div"
          className="text-danger small mt-1"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-section">
      <h2 className="section-title">
        <i className="bi bi-person-circle me-2"></i>
        Personal Details
      </h2>
      <p className="mb-4 text-muted">
        Your personal information for account verification
      </p>

      <div className="mb-4">
        <label className="form-label">
          Full Name (as per PAN)<span className="text-danger">*</span>
        </label>
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-person text-primary"></i>
          </span>
          <Field
            type="text"
            name="fullName"
            className="form-control form-control-lg border-start-0"
            placeholder="Enter your full name as per PAN"
          />
        </div>
        <ErrorMessage
          name="fullName"
          component="div"
          className="text-danger small mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="form-label">
          Official Email ID<span className="text-danger">*</span>
        </label>
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-envelope text-primary"></i>
          </span>
          <Field
            type="email"
            name="email"
            className="form-control form-control-lg border-start-0"
            placeholder="Enter your official email address"
          />
        </div>
        <ErrorMessage
          name="email"
          component="div"
          className="text-danger small mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="form-label">
          Create Password<span className="text-danger">*</span>
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
          Use 8 or more characters with a mix of letters, numbers & symbols
        </div>
        <ErrorMessage
          name="password"
          component="div"
          className="text-danger small mt-1"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-section">
      <h2 className="section-title">
        <i className="bi bi-building me-2"></i>
        Company Details
      </h2>
      <p className="mb-4 text-muted">Information about your organization</p>

      <div className="row">
        <div className="col-md-6 mb-4">
          <label className="form-label">
            Company Name<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-building text-primary"></i>
            </span>
            <Field
              type="text"
              name="companyName"
              className="form-control form-control-lg border-start-0"
              placeholder="Enter company name"
            />
          </div>
          <ErrorMessage
            name="companyName"
            component="div"
            className="text-danger small mt-1"
          />
        </div>

        <div className="col-md-6 mb-4">
          <label className="form-label">
            Company Email<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-envelope text-primary"></i>
            </span>
            <Field
              type="email"
              name="companyEmail"
              className="form-control form-control-lg border-start-0"
              placeholder="company@domain.com"
            />
          </div>
          <ErrorMessage
            name="companyEmail"
            component="div"
            className="text-danger small mt-1"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <label className="form-label">
            Your Designation<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-briefcase text-primary"></i>
            </span>
            <Field
              type="text"
              name="designation"
              className="form-control form-control-lg border-start-0"
              placeholder="e.g., HR Manager, CEO"
            />
          </div>
          <ErrorMessage
            name="designation"
            component="div"
            className="text-danger small mt-1"
          />
        </div>

        <div className="col-md-6 mb-4">
          <label className="form-label">
            Company Size<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-people text-primary"></i>
            </span>
            <Field
              as="select"
              name="companySize"
              className="form-control form-control-lg border-start-0"
            >
              <option value="">Select company size</option>
              {companySizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Field>
          </div>
          <ErrorMessage
            name="companySize"
            component="div"
            className="text-danger small mt-1"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <label className="form-label">
            Industry<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-diagram-3 text-primary"></i>
            </span>
            <Field
              as="select"
              name="industry"
              className="form-control form-control-lg border-start-0"
            >
              <option value="">Select industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </Field>
          </div>
          <ErrorMessage
            name="industry"
            component="div"
            className="text-danger small mt-1"
          />
        </div>

        <div className="col-md-6 mb-4">
          <label className="form-label">Website (Optional)</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-globe text-primary"></i>
            </span>
            <Field
              type="url"
              name="website"
              className="form-control form-control-lg border-start-0"
              placeholder="https://yourcompany.com"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-section">
      <h2 className="section-title">
        <i className="bi bi-geo-alt me-2"></i>
        Address Details
      </h2>
      <p className="mb-4 text-muted">
        Your company/business address information
      </p>

      <div className="mb-4">
        <label className="form-label">
          Complete Address<span className="text-danger">*</span>
        </label>
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-house text-primary"></i>
          </span>
          <Field
            as="textarea"
            name="address"
            className="form-control border-start-0"
            rows="3"
            placeholder="Enter complete address"
          />
        </div>
        <ErrorMessage
          name="address"
          component="div"
          className="text-danger small mt-1"
        />
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <label className="form-label">
            City<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-building text-primary"></i>
            </span>
            <Field
              type="text"
              name="city"
              className="form-control form-control-lg border-start-0"
              placeholder="Enter city"
            />
          </div>
          <ErrorMessage
            name="city"
            component="div"
            className="text-danger small mt-1"
          />
        </div>

        <div className="col-md-4 mb-4">
          <label className="form-label">
            State<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-map text-primary"></i>
            </span>
            <Field
              as="select"
              name="state"
              className="form-control form-control-lg border-start-0"
            >
              <option value="">Select state</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Field>
          </div>
          <ErrorMessage
            name="state"
            component="div"
            className="text-danger small mt-1"
          />
        </div>

        <div className="col-md-4 mb-4">
          <label className="form-label">
            Pincode<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-mailbox text-primary"></i>
            </span>
            <Field
              type="text"
              name="pincode"
              className="form-control form-control-lg border-start-0"
              placeholder="Enter pincode"
              maxLength="6"
            />
          </div>
          <ErrorMessage
            name="pincode"
            component="div"
            className="text-danger small mt-1"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="form-check">
          <Field
            type="checkbox"
            name="acceptTerms"
            className="form-check-input"
            id="acceptTerms"
          />
          <label htmlFor="acceptTerms" className="form-check-label">
            I agree to the{" "}
            <Link href="/terms" className="text-link">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-link">
              Privacy Policy
            </Link>
            <span className="text-danger">*</span>
          </label>
        </div>
        <ErrorMessage
          name="acceptTerms"
          component="div"
          className="text-danger small mt-1"
        />
      </div>
    </div>
  );

  const renderProgressBar = () => (
    <div className="progress-container mb-4">
      <div className="progress">
        <div
          className="progress-bar bg-primary"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>
      {/* <div className="progress-steps">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`progress-step ${step <= currentStep ? "active" : ""}`}
          >
            {step}
          </div>
        ))}
      </div> */}
    </div>
  );

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4 register-container">
      <div className="container">
        <div
          className="row justify-content-center"
          style={{
            marginLeft: "0px",
            marginRight: "0px",
          }}
        >
          <div className="col-lg-8">
            <div className="register-form-card">
              <div className="form-header">
                <div className="logo-container text-center mb-4">
                  <div className="logo">DEI CHAMPIONS</div>
                  <div className="logo-subtitle mt-1">Job Portal</div>
                </div>
                <h1 className="form-title">Create Account as Job Poster</h1>
                <p className="form-subtitle">
                  Register to post jobs and find the best talent for your
                  organization
                </p>
                {renderProgressBar()}
              </div>

              <div className="form-body">
                <Formik
                  initialValues={initialValues}
                  validationSchema={getValidationSchema()}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ values }) => (
                    <Form>
                      {currentStep === 1 && renderStep1(values)}
                      {currentStep === 2 && renderStep2()}
                      {currentStep === 3 && renderStep3()}
                      {currentStep === 4 && renderStep4()}

                      <div className="d-flex justify-content-between">
                        {currentStep > 1 && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setCurrentStep(currentStep - 1)}
                          >
                            <i className="bi bi-arrow-left me-2"></i>
                            Previous
                          </button>
                        )}

                        <button
                          type="submit"
                          className="btn btn-primary register-btn ms-auto"
                          disabled={loading}
                          style={{ width: currentStep === 1 ? "100%" : "auto" }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Processing...
                            </>
                          ) : currentStep === 4 ? (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              Create Account
                            </>
                          ) : (
                            <>
                              Continue
                              <i className="bi bi-arrow-right ms-2"></i>
                            </>
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>

              <div className="form-footer">
                Already have an account? <Link href="/login">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
