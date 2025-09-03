import { useFormik } from "formik";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import CompanyImageGallery from "@/components/elements/ImageGallery";
import { updateEmployersProfile } from "@/api/auth";
import Swal from "sweetalert2";
import DynamicSelect from "@/components/elements/DynamicSelect";
import { getJobCategories } from "@/api/job";
import * as Yup from "yup";
import cityStateData from "@/utils/cityState.json";

const states = cityStateData.data.map((item) => item.state);

export default function CompanyProfileUpdate() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("Unverified");
  const [cities, setCities] = useState([]);

  const logoFileInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setVerificationStatus(user.companyVerified ? "Verified" : "Unverified");
    }
    if (user?.profilePhotoUrl) {
      setLogoPreview(user.profilePhotoUrl);
    }
    if (user?.bannerPhotoUrl) {
      setBannerPreview(user.bannerPhotoUrl);
    }
  }, [user]);

  const { jobCategories } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(getJobCategories());
  }, [dispatch]);

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company name is required"),
    name: Yup.string().required("Contact person name is required"),
    companySize: Yup.string().required("Company size is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    mobile: Yup.string().required("Mobile number is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  });

  const formik = useFormik({
    initialValues: {
      companyName: user?.companyName || "",
      name: user?.name || "",
      companyDesignation: user?.companyDesignation || "",
      companyWebsite: user?.companyWebsite || "",
      companySize: user?.companySize || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      pincode: user?.pincode || "",

      tagline: user?.tagline || "",
      aboutUs: user?.companyDescription || "",
      recruitments: user?.recruitments || "",
      people: user?.people || "",
      category: user?.city || "",
      salary: user?.city || "",
      memberSince: user?.memberSince
        ? new Date(user.memberSince).toISOString().split("T")[0]
        : "",
      currentPassword: "",
      newPassword: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("Form submitted:", values);

      const formData = new FormData();

      // append form fields
      for (const key in values) {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      }

      // append files if they exist
      if (logoFile) formData.append("logo", logoFile);
      if (bannerFile) formData.append("banner", bannerFile);

      const data = await dispatch(
        updateEmployersProfile(formData, {
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

      if (data.success) {
        setLogoFile(null);
        setBannerFile(null);
      }
    },
  });

  // When state changes (Formik-controlled), update cities
  useEffect(() => {
    const selectedState = formik.values.state;
    if (selectedState) {
      const selected = cityStateData.data.find(
        (item) => item.state === selectedState
      );
      setCities(selected ? selected.cities : []);
    } else {
      setCities([]);
    }
  }, [formik.values.state]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file); // store actual file
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file); // store actual file
      const reader = new FileReader();
      reader.onload = (e) => setBannerPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = (fieldId) => {
    const passwordInput = document.getElementById(fieldId);
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    const eyeIcon = document.querySelector(
      `#toggle${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} i`
    );
    eyeIcon.classList.toggle("bi-eye");
    eyeIcon.classList.toggle("bi-eye-slash");
  };

  return (
    <>
      <Layout>
        <div className="container py-4">
          <form onSubmit={formik.handleSubmit}>
            {/* Basic Information Card */}
            <div className="upd-pro-card mb-4">
              <div className="upd-pro-card-header">
                <i className="bi bi-info-circle me-2"></i> Basic Information
              </div>
              <div className="upd-pro-card-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <div
                      className="upd-pro-avatar"
                      onClick={() => logoFileInputRef.current.click()}
                      style={{ cursor: "pointer" }}
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Company Logo"
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span id="logoInitials">
                          {user?.companyName
                            ? user.companyName.substring(0, 2).toUpperCase()
                            : "KS"}
                        </span>
                      )}
                      <input
                        type="file"
                        ref={logoFileInputRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleLogoUpload}
                      />
                    </div>
                    <div className="mb-3">
                      <span
                        className={`upd-pro-status-badge ${
                          verificationStatus === "Verified"
                            ? "upd-pro-verified"
                            : ""
                        }`}
                      >
                        {verificationStatus}
                      </span>
                    </div>
                    <div className="upd-pro-account-type">
                      Member Since:{" "}
                      {user?.memberSince
                        ? new Date(user.memberSince).toLocaleDateString()
                        : "2015"}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-6 upd-pro-form-group">
                        <label className="upd-pro-form-label">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          className={`form-control upd-pro-form-control ${
                            formik.touched.companyName &&
                            formik.errors.companyName
                              ? "is-invalid"
                              : ""
                          }`}
                          name="companyName"
                          value={formik.values.companyName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          required
                        />
                        {formik.touched.companyName &&
                          formik.errors.companyName && (
                            <div className="invalid-feedback">
                              {formik.errors.companyName}
                            </div>
                          )}
                      </div>
                      <div className="col-md-6 upd-pro-form-group">
                        <label className="upd-pro-form-label">
                          Contact Person *
                        </label>
                        <input
                          type="text"
                          className={`form-control upd-pro-form-control ${
                            formik.touched.name && formik.errors.name
                              ? "is-invalid"
                              : ""
                          }`}
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          required
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="invalid-feedback">
                            {formik.errors.name}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 upd-pro-form-group">
                        <label className="upd-pro-form-label">
                          Member Since
                        </label>
                        <input
                          type="date"
                          className="form-control upd-pro-form-control"
                          name="memberSince"
                          value={formik.values.memberSince}
                          onChange={formik.handleChange}
                        />
                      </div>
                      <div className="col-md-6 upd-pro-form-group">
                        <label className="upd-pro-form-label">Website</label>
                        <input
                          type="url"
                          className="form-control upd-pro-form-control"
                          name="companyWebsite"
                          value={formik.values.companyWebsite}
                          onChange={formik.handleChange}
                        />
                      </div>
                      <div className="col-md-6 upd-pro-form-group">
                        <label className="upd-pro-form-label">
                          Company Size *
                        </label>
                        <select
                          className={`form-select upd-pro-form-control ${
                            formik.touched.companySize &&
                            formik.errors.companySize
                              ? "is-invalid"
                              : ""
                          }`}
                          name="companySize"
                          value={formik.values.companySize}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          <option value="">Select size</option>
                          <option value="1-10 employees">1-10 employees</option>
                          <option value="11-50 employees">
                            11-50 employees
                          </option>
                          <option value="51-200 employees">
                            51-200 employees
                          </option>
                          <option value="201-500 employees">
                            201-500 employees
                          </option>
                          <option value="501-1000 employees">
                            501-1000 employees
                          </option>
                          <option value="1000+ employees">
                            1000+ employees
                          </option>
                        </select>
                        {formik.touched.companySize &&
                          formik.errors.companySize && (
                            <div className="invalid-feedback">
                              {formik.errors.companySize}
                            </div>
                          )}
                      </div>
                      <div className="col-md-6 upd-pro-form-group">
                        <label className="upd-pro-form-label">
                          Account Status
                        </label>
                        <div
                          className="form-control upd-pro-form-control"
                          style={{
                            backgroundColor: "#e8f5e9",
                            color: "#2e7d32",
                            fontWeight: "500",
                          }}
                        >
                          <i className="bi bi-check-circle-fill me-2"></i>{" "}
                          Active
                        </div>
                      </div>
                      <div className="col-md-12 upd-pro-form-group">
                        <label className="upd-pro-form-label">Tagline</label>
                        <input
                          type="text"
                          className="form-control upd-pro-form-control"
                          name="tagline"
                          value={formik.values.tagline}
                          onChange={formik.handleChange}
                          placeholder="Enter your company tagline"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="upd-pro-card mb-4">
              <div className="upd-pro-card-header">
                <i className="bi bi-geo-alt me-2"></i> Contact Information
              </div>
              <div className="upd-pro-card-body">
                <div className="row">
                  <div className="col-md-6 upd-pro-form-group">
                    <label className="upd-pro-form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className={`form-control upd-pro-form-control ${
                        formik.touched.email && formik.errors.email
                          ? "is-invalid"
                          : ""
                      }`}
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                      disabled
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="invalid-feedback">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 upd-pro-form-group">
                    <label className="upd-pro-form-label">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      className={`form-control upd-pro-form-control ${
                        formik.touched.mobile && formik.errors.mobile
                          ? "is-invalid"
                          : ""
                      }`}
                      name="mobile"
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    />
                    {formik.touched.mobile && formik.errors.mobile && (
                      <div className="invalid-feedback">
                        {formik.errors.mobile}
                      </div>
                    )}
                  </div>
                  <div className="col-md-12 upd-pro-form-group">
                    <label className="upd-pro-form-label">Address *</label>
                    <input
                      type="text"
                      className={`form-control upd-pro-form-control ${
                        formik.touched.address && formik.errors.address
                          ? "is-invalid"
                          : ""
                      }`}
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    />
                    {formik.touched.address && formik.errors.address && (
                      <div className="invalid-feedback">
                        {formik.errors.address}
                      </div>
                    )}
                  </div>

                  {/* <div className="col-md-3 upd-pro-form-group">
                    <label className="upd-pro-form-label">City *</label>
                    <input
                      type="text"
                      className={`form-control upd-pro-form-control ${
                        formik.touched.city && formik.errors.city
                          ? "is-invalid"
                          : ""
                      }`}
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    />
                    {formik.touched.city && formik.errors.city && (
                      <div className="invalid-feedback">
                        {formik.errors.city}
                      </div>
                    )}
                  </div>
                  <div className="col-md-3 upd-pro-form-group">
                    <label className="upd-pro-form-label">State *</label>
                    <input
                      type="text"
                      className={`form-control upd-pro-form-control ${
                        formik.touched.state && formik.errors.state
                          ? "is-invalid"
                          : ""
                      }`}
                      name="state"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    />
                    {formik.touched.state && formik.errors.state && (
                      <div className="invalid-feedback">
                        {formik.errors.state}
                      </div>
                    )}
                  </div> */}
                  <div className="col-md-3 upd-pro-form-group">
                    <label className="upd-pro-form-label">State *</label>
                    <select
                      name="state"
                      className={`form-control upd-pro-form-control ${
                        formik.touched.state && formik.errors.state
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.state}
                      onChange={(e) => {
                        formik.handleChange(e); // update Formik value
                        const stateValue = e.target.value;

                        if (stateValue) {
                          const selected = cityStateData.data.find(
                            (item) => item.state === stateValue
                          );
                          setCities(selected ? selected.cities : []);
                          formik.setFieldValue("city", ""); // reset city
                        } else {
                          setCities([]);
                          formik.setFieldValue("city", "");
                        }
                      }}
                      onBlur={formik.handleBlur}
                      required
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {formik.touched.state && formik.errors.state && (
                      <div className="invalid-feedback">
                        {formik.errors.state}
                      </div>
                    )}
                  </div>

                  {/* City Dropdown */}
                  <div className="col-md-3 upd-pro-form-group">
                    <label className="upd-pro-form-label">City *</label>
                    <select
                      name="city"
                      className={`form-control upd-pro-form-control ${
                        formik.touched.city && formik.errors.city
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {formik.touched.city && formik.errors.city && (
                      <div className="invalid-feedback">
                        {formik.errors.city}
                      </div>
                    )}
                  </div>
                  <div className="col-md-3 upd-pro-form-group">
                    <label className="upd-pro-form-label">Pincode *</label>
                    <input
                      type="text"
                      className={`form-control upd-pro-form-control ${
                        formik.touched.pincode && formik.errors.pincode
                          ? "is-invalid"
                          : ""
                      }`}
                      name="pincode"
                      value={formik.values.pincode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    />
                    {formik.touched.pincode && formik.errors.pincode && (
                      <div className="invalid-feedback">
                        {formik.errors.pincode}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery Card */}
            <CompanyImageGallery />

            {/* About Us Card */}
            <div className="upd-pro-card mb-4">
              <div className="upd-pro-card-header">
                <i className="bi bi-card-text me-2"></i> About Us
              </div>
              <div className="upd-pro-card-body">
                <div className="upd-pro-form-group">
                  <label className="upd-pro-form-label">
                    About Your Company
                  </label>
                  <textarea
                    className="form-control upd-pro-form-control upd-pro-textarea"
                    placeholder="Describe your company's mission, values, and what makes it unique..."
                    name="aboutUs"
                    rows={10}
                    value={formik.values.aboutUs}
                    onChange={formik.handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Recruitments Card */}
            <div className="upd-pro-card mb-4">
              <div className="upd-pro-card-header">
                <i className="bi bi-people me-2"></i> Recruitments
              </div>
              <div className="upd-pro-card-body">
                <div className="upd-pro-form-group">
                  <label className="upd-pro-form-label">
                    Recruitment Information
                  </label>
                  <textarea
                    className="form-control upd-pro-form-control upd-pro-textarea"
                    placeholder="Describe your recruitment process, opportunities, etc..."
                    name="recruitments"
                    rows={6}
                    value={formik.values.recruitments}
                    onChange={formik.handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* People Card */}
            <div className="upd-pro-card mb-4">
              <div className="upd-pro-card-header">
                <i className="bi bi-person-circle me-2"></i> People
              </div>
              <div className="upd-pro-card-body">
                <div className="upd-pro-form-group">
                  <label className="upd-pro-form-label">People & Culture</label>
                  <textarea
                    className="form-control upd-pro-form-control upd-pro-textarea"
                    placeholder="Describe your company culture, team, etc..."
                    name="people"
                    rows={6}
                    value={formik.values.people}
                    onChange={formik.handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div className="upd-pro-card mb-4">
              <div className="upd-pro-card-header">
                <i className="bi bi-image me-2"></i> Banner Image
              </div>
              <div className="upd-pro-card-body">
                <div className="text-center mb-3">
                  <div
                    className="upd-pro-banner-preview"
                    onClick={() => bannerFileInputRef.current.click()}
                    style={{ cursor: "pointer" }}
                  >
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Company Banner"
                        className="upd-pro-banner-img"
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <span>
                          <i className="bi bi-image me-2"></i> Click to upload
                          banner
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={bannerFileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleBannerUpload}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-light upd-pro-btn-outline"
              >
                <i className="bi bi-x-circle me-2"></i> Cancel
              </button>
              <button type="submit" className="btn upd-pro-btn-primary">
                <i className="bi bi-check-circle me-2"></i> Save Changes
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
