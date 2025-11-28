"use client";
import Layout from "@/components/layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Swal from "sweetalert2";
import { registerJobPoster } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import cityStateData from "@/utils/cityState.json";
import { getDepartments } from "@/api/job";

export default function JobPosterRegistration() {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [cities, setCities] = useState([]);
  const loading = useSelector((state) => state.auth.loading);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const states = cityStateData.data.map((item) => item.state);
  const [selectedState, setSelectedState] = useState("");
  const { departments } = useSelector((state) => state.job);
  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  const initialValues = {
    mobile: "",
    companyAccountType: "",
    name: "",
    email: "",
    password: "",
    companyName: "",
    companySize: "",
    companyWebsite: "",
    hiringFor: "company",
    department: "",
    companyType: "",
    gstNumber: "",
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
    companyAccountType: Yup.string()
      .required("Account type is required")
      .oneOf(["company", "individual"], "Invalid account type"),
  });

  const step2ValidationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),

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
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
  });

  const step3ValidationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company name is required"),
    companySize: Yup.string().required("Company size is required"),
    hiringFor: Yup.string()
      .required("Hiring for is required")
      .oneOf(["company", "consultancy"], "Invalid hiring type"),
    department: Yup.string().required("Department is required"),
    companyType: Yup.string().required("Company type is required"),
    gstNumber: Yup.string().optional(),
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

  const handleSubmit = async (values, { setTouched }) => {
    // Mark all fields as touched to show errors
    const allFields = Object.keys(values);
    const touchedObj = {};
    allFields.forEach((field) => {
      touchedObj[field] = true;
    });
    setTouched(touchedObj);

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    const data = await dispatch(
      registerJobPoster(values, {
        showSuccess: () =>
          Swal.fire({
            icon: "info",
            title: "Please check your mail",
            text: "We've sent you an OTP.",
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

    if (!data) return;

    if (data?.success) {
      navigate.push({
        pathname: "/employers/otp-verify",
        query: { userId: data.data.userId, roleId: data.data.roleId },
      });
    }
  };

  const handleFieldBlur = (fieldName, setTouched) => {
    setTouched({ [fieldName]: true });
  };

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
  ];

  const companyTypes = [
    "Private Limited",
    "Public Limited",
    "Partnership",
    "Proprietorship",
    "LLP (Limited Liability Partnership)",
    "Non-Profit",
    "Other",
  ];

  // Convert departments to department options
  const departmentOptions =
    departments?.map((category) => ({
      value: category._id,
      label: category.name,
    })) || [];

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
              values.companyAccountType === "company" ? "active" : ""
            }`}
          >
            <Field
              type="radio"
              name="companyAccountType"
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
              values.companyAccountType === "individual" ? "active" : ""
            }`}
          >
            <Field
              type="radio"
              name="companyAccountType"
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
          name="companyAccountType"
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
          Full Name<span className="text-danger">*</span>
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
          />
        </div>
        <ErrorMessage
          name="name"
          component="div"
          className="text-danger small mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="form-label">
          Company Email ID<span className="text-danger">*</span>
        </label>
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-envelope text-primary"></i>
          </span>
          <Field
            type="email"
            name="email"
            className="form-control form-control-lg border-start-0"
            placeholder="Enter your Company email address"
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

  const renderStep3 = ({ errors, touched, setFieldTouched }) => (
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
              onBlur={() => setFieldTouched("companyName", true, true)}
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
              onBlur={() => setFieldTouched("companySize", true, true)}
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
          <label className="form-label">Website (Optional)</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-globe text-primary"></i>
            </span>
            <Field
              type="text"
              name="companyWebsite"
              className="form-control form-control-lg border-start-0"
              placeholder="https://yourcompany.com"
            />
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <label className="form-label">
            Hiring For<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-briefcase text-primary"></i>
            </span>
            <Field
              as="select"
              name="hiringFor"
              className="form-control form-control-lg border-start-0"
              onBlur={() => setFieldTouched("hiringFor", true, true)}
            >
              <option value="company">Your company</option>
              <option value="consultancy">A consultancy</option>
            </Field>
          </div>
          <ErrorMessage
            name="hiringFor"
            component="div"
            className="text-danger small mt-1"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <label className="form-label">
            Department<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-diagram-3 text-primary"></i>
            </span>
            <Field
              as="select"
              name="department"
              className="form-control form-control-lg border-start-0"
              onBlur={() => setFieldTouched("department", true, true)}
            >
              <option value="">Select department</option>
              {departmentOptions.map((department) => (
                <option key={department.value} value={department.value}>
                  {department.label}
                </option>
              ))}
            </Field>
          </div>
          <ErrorMessage
            name="department"
            component="div"
            className="text-danger small mt-1"
          />
        </div>

        <div className="col-md-6 mb-4">
          <label className="form-label">
            Company Type<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-building-gear text-primary"></i>
            </span>
            <Field
              as="select"
              name="companyType"
              className="form-control form-control-lg border-start-0"
              onBlur={() => setFieldTouched("companyType", true, true)}
            >
              <option value="">Select company type</option>
              {companyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Field>
          </div>
          <ErrorMessage
            name="companyType"
            component="div"
            className="text-danger small mt-1"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <label className="form-label">GST Number (Optional)</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-receipt text-primary"></i>
            </span>
            <Field
              type="text"
              name="gstNumber"
              className="form-control form-control-lg border-start-0"
              placeholder="Enter GST number"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = (values, setFieldValue, setFieldTouched) => (
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
            onBlur={() => setFieldTouched("address", true, true)}
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
              onChange={(e) => {
                const stateValue = e.target.value;
                setSelectedState(stateValue);
                setFieldValue("state", stateValue, true);

                if (stateValue) {
                  const selected = cityStateData.data.find(
                    (item) => item.state === stateValue
                  );
                  setCities(selected ? selected.cities : []);
                } else {
                  setCities([]);
                }
              }}
              onBlur={() => setFieldTouched("state", true, true)}
            >
              <option value="">Select State</option>
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
            City<span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-building text-primary"></i>
            </span>
            <Field
              as="select"
              name="city"
              className="form-control form-control-lg border-start-0"
              onBlur={() => setFieldTouched("city", true, true)}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Field>
          </div>
          <ErrorMessage
            name="city"
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
              onBlur={() => setFieldTouched("pincode", true, true)}
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
                  <div className="header-logo">
                    <div className="d-flex justify-content-center">
                      <img
                        alt="jobBox"
                        src="../assets/imgs/page/dashboard/logo2.png"
                        style={{ width: "60%", height: "auto" }}
                      />
                    </div>
                  </div>
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
                  validateOnBlur={true}
                  validateOnChange={false}
                >
                  {({
                    values,
                    setFieldValue,
                    setFieldTouched,
                    errors,
                    touched,
                  }) => (
                    <Form>
                      {currentStep === 1 && renderStep1(values)}
                      {currentStep === 2 && renderStep2()}
                      {currentStep === 3 &&
                        renderStep3({ errors, touched, setFieldTouched })}
                      {currentStep === 4 &&
                        renderStep4(values, setFieldValue, setFieldTouched)}

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
                          style={{
                            width: currentStep === 1 ? "100%" : "auto",
                          }}
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
                Already have an account?{" "}
                <Link href="/employers/login">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
