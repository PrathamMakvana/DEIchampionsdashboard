import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import DynamicSelect from "@/components/elements/DynamicSelect";
import { getJobCategories, getJobTypes } from "@/api/job";
import { updateUserProfileWithResume } from "@/api/auth";
import Swal from "sweetalert2";
import moment from "moment";

const salaryOptions = [
  { value: "10-20 lac", label: "10-20 lac" },
  { value: "20-30 lac", label: "20-30 lac" },
  { value: "30-40 lac", label: "30-40 lac" },
  { value: "40-50 lac", label: "40-50 lac" },
];

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
    .required("Mobile number is required"),
  workStatus: Yup.string().required("Work status is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  dateOfBirth: Yup.date()
    .nullable()
    .max(new Date(), "Date of birth cannot be in the future"),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
  employeeDescription: Yup.string().required("Description is required"),
  education: Yup.array().of(
    Yup.object().shape({
      degree: Yup.string().required("Degree is required"),
      institution: Yup.string().required("Institution is required"),
      graduationYear: Yup.number()
        .typeError("Graduation year must be a number")
        .min(1950, "Year must be >= 1950")
        .max(2030, "Year must be <= 2030")
        .required("Graduation year is required"),
    })
  ),
  experience: Yup.array().of(
    Yup.object().shape({
      companyName: Yup.string().required("Company name is required"),
      position: Yup.string().required("Position is required"),
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date().nullable(),
      currentJob: Yup.boolean(),
      description: Yup.string().nullable(),
    })
  ),
});

export default function UserProfileUpdate() {
  const user = useSelector((state) => state.auth.user);
  console.log("🚀user --->", user);
  const dispatch = useDispatch();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [skills, setSkills] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);

  const { jobCategories, jobTypes, loading } = useSelector(
    (state) => state.job
  );

  useEffect(() => {
    dispatch(getJobCategories());
    dispatch(getJobTypes());
  }, [dispatch]);

  useEffect(() => {
    if (user?.profilePhotoUrl) {
      setPhotoPreview(user.profilePhotoUrl);
    }
    if (user?.resumeUrl) {
      setResumeFileName(user.resumeUrl.split("/").pop());
    }
  }, [user]);

  const defaultInitialValues = {
    name: "",
    email: "",
    mobile: "",
    dateOfBirth: null,
    employeeDescription: "",
    gender: "",
    workStatus: "unemployed",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    currentPassword: "",
    newPassword: "",
    jobType: "",
    department: "",
    category: "",
    salaryRange: "",
    preferredLocations: "",
    education: [
      {
        degree: "",
        institution: "",
        graduationYear: "",
      },
    ],
    experience: [
      {
        companyName: "",
        position: "",
        startDate: "",
        endDate: "",
        currentJob: false,
        description: "",
      },
    ],
  };

  const formik = useFormik({
    initialValues: defaultInitialValues,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, validateForm }) => {
      try {
        setIsSubmitting(true);

        // Validate the form before submission
        const errors = await validateForm();

        // If there are validation errors, don't submit
        if (Object.keys(errors).length > 0) {
          // Mark all fields as touched to show errors
          const touched = {};
          Object.keys(values).forEach((key) => {
            touched[key] = true;
          });
          formik.setTouched(touched);

          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please fix all the errors before submitting the form",
            timer: 3000,
          });
          return;
        }

        const formData = new FormData();

        // Append all form fields
        Object.keys(values).forEach((key) => {
          if (values[key] !== null && values[key] !== undefined) {
            if (
              ["skills", "education", "experience", "preferences"].includes(key)
            ) {
              formData.append(key, JSON.stringify(values[key]));
            } else {
              formData.append(key, values[key]);
            }
          }
        });

        // Append photo file if exists
        if (photoFile) {
          formData.append("photo", photoFile);
        }

        // Append resume file if exists
        if (resumeFile) {
          formData.append("resume", resumeFile);
        }

        // Append skills
        formData.append("skills", JSON.stringify(skills));

        const data = await dispatch(
          updateUserProfileWithResume(formData, {
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

        if (data?.success) {
          setPhotoFile(null);
          setResumeFile(null);
        }
      } catch (error) {
        console.error("Submission error:", error);
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "Something went wrong. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (user) {
      formik.setValues({
        ...defaultInitialValues,
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        dateOfBirth: user.dateOfBirth
          ? moment(user.dateOfBirth).format("YYYY-MM-DD")
          : "",
        gender: user.gender || "",
        employeeDescription: user.employeeDescription || "",
        workStatus: user.workStatus || "unemployed",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        pincode: user.pincode || "",
        education:
          user.education?.length > 0
            ? user.education
            : defaultInitialValues.education,
        experience:
          user.experience?.length > 0
            ? user.experience
            : defaultInitialValues.experience,
        jobType: user.preferences?.jobTypes?.[0] || "",
        department: user.preferences?.department?.[0] || "",
        category: user.preferences?.category?.[0] || "",
        salaryRange: user.preferences?.salary_range || "",
        preferredLocations:
          user.preferences?.preffered_locations?.join(", ") || "",
      });

      setSkills(user.skills || []);
    }
  }, [user]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  const addSkill = () => {
    const skillInput = document.getElementById("skillInput");
    const skill = skillInput.value.trim();
    if (skill) {
      setSkills([...skills, skill]);
      skillInput.value = "";
    }
  };

  const removeSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const togglePasswordVisibility = (fieldId) => {
    const passwordInput = document.getElementById(fieldId);
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
  };

  const handleCancel = () => {
    // Reset form to initial values
    if (user) {
      formik.setValues({
        ...defaultInitialValues,
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        dateOfBirth: user.dateOfBirth
          ? moment(user.dateOfBirth).format("YYYY-MM-DD")
          : "",
        gender: user.gender || "",
        employeeDescription: user.employeeDescription || "",
        workStatus: user.workStatus || "unemployed",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        pincode: user.pincode || "",
        education:
          user.education?.length > 0
            ? user.education
            : defaultInitialValues.education,
        experience:
          user.experience?.length > 0
            ? user.experience
            : defaultInitialValues.experience,
        jobType: user.preferences?.jobTypes?.[0] || "",
        department: user.preferences?.department?.[0] || "",
        category: user.preferences?.category?.[0] || "",
        salaryRange: user.preferences?.salary_range || "",
        preferredLocations:
          user.preferences?.preffered_locations?.join(", ") || "",
      });
      setSkills(user.skills || []);
    }
    formik.setTouched({});
  };

  return (
    <>
      <Layout>
        <div>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              {/* Basic Information Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-person me-2"></i> Basic Information
                </div>
                <div className="user-upt-profile-card-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div
                        className="user-upt-profile-avatar"
                        onClick={() => fileInputRef.current.click()}
                        style={{ cursor: "pointer" }}
                      >
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Profile Photo"
                            className="user-upt-profile-photo-preview"
                            style={{ display: "block" }}
                          />
                        ) : (
                          <span id="photoInitials">
                            {user?.name ? user.name.charAt(0) : "U"}
                          </span>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handlePhotoUpload}
                        />
                      </div>
                      <div className="mb-3">
                        <span className="user-upt-profile-status-badge">
                          {user?.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="user-upt-profile-work-status">
                        {formik.values.workStatus === "unemployed"
                          ? "Looking for job"
                          : "Employed"}
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            className={`form-control user-upt-profile-form-control ${
                              formik.touched.name && formik.errors.name
                                ? "is-invalid"
                                : ""
                            }`}
                            name="name"
                            placeholder="Enter your full name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.name && formik.errors.name && (
                            <div className="text-danger small mt-1">
                              {formik.errors.name}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            className={`form-control user-upt-profile-form-control ${
                              formik.touched.email && formik.errors.email
                                ? "is-invalid"
                                : ""
                            }`}
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled
                          />
                          {formik.touched.email && formik.errors.email && (
                            <div className="text-danger small mt-1">
                              {formik.errors.email}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            className={`form-control user-upt-profile-form-control ${
                              formik.touched.mobile && formik.errors.mobile
                                ? "is-invalid"
                                : ""
                            }`}
                            name="mobile"
                            placeholder="Enter your mobile number"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.mobile && formik.errors.mobile && (
                            <div className="text-danger small mt-1">
                              {formik.errors.mobile}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            className={`form-control user-upt-profile-form-control ${
                              formik.touched.dateOfBirth &&
                              formik.errors.dateOfBirth
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="YYYY-MM-DD"
                            name="dateOfBirth"
                            value={formik.values.dateOfBirth || ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.dateOfBirth &&
                            formik.errors.dateOfBirth && (
                              <div className="text-danger small mt-1">
                                {formik.errors.dateOfBirth}
                              </div>
                            )}
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Gender
                          </label>
                          <select
                            className="form-select user-upt-profile-form-control"
                            name="gender"
                            value={formik.values.gender}
                            onChange={formik.handleChange}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">
                              Prefer not to say
                            </option>
                          </select>
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Work Status *
                          </label>
                          <select
                            className={`form-select user-upt-profile-form-control ${
                              formik.touched.workStatus &&
                              formik.errors.workStatus
                                ? "is-invalid"
                                : ""
                            }`}
                            name="workStatus"
                            value={formik.values.workStatus}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option value="">Select Status</option>
                            <option value="employed">Employed</option>
                            <option value="unemployed">Unemployed</option>
                            <option value="student">Student</option>
                            <option value="self-employed">Self-Employed</option>
                          </select>
                          {formik.touched.workStatus &&
                            formik.errors.workStatus && (
                              <div className="text-danger small mt-1">
                                {formik.errors.workStatus}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="col-md-12 user-upt-profile-form-group">
                        <label className="user-upt-profile-form-label">
                          Description *
                        </label>
                        <textarea
                          className={`form-control user-upt-profile-form-control ${
                            formik.touched.employeeDescription &&
                            formik.errors.employeeDescription
                              ? "is-invalid"
                              : ""
                          }`}
                          name="employeeDescription"
                          placeholder="Write a short description about yourself"
                          rows="4"
                          value={formik.values.employeeDescription}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.employeeDescription &&
                          formik.errors.employeeDescription && (
                            <div className="text-danger small mt-1">
                              {formik.errors.employeeDescription}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-geo-alt me-2"></i> Location Information
                </div>
                <div className="user-upt-profile-card-body">
                  <div className="row">
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Address *
                      </label>
                      <input
                        type="text"
                        className={`form-control user-upt-profile-form-control ${
                          formik.touched.address && formik.errors.address
                            ? "is-invalid"
                            : ""
                        }`}
                        name="address"
                        placeholder="Enter your address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.address && formik.errors.address && (
                        <div className="text-danger small mt-1">
                          {formik.errors.address}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        City *
                      </label>
                      <input
                        type="text"
                        className={`form-control user-upt-profile-form-control ${
                          formik.touched.city && formik.errors.city
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter your city"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.city && formik.errors.city && (
                        <div className="text-danger small mt-1">
                          {formik.errors.city}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        State *
                      </label>
                      <input
                        type="text"
                        className={`form-control user-upt-profile-form-control ${
                          formik.touched.state && formik.errors.state
                            ? "is-invalid"
                            : ""
                        }`}
                        name="state"
                        placeholder="Enter your state"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.state && formik.errors.state && (
                        <div className="text-danger small mt-1">
                          {formik.errors.state}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your country"
                        className="form-control user-upt-profile-form-control"
                        name="country"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        className={`form-control user-upt-profile-form-control ${
                          formik.touched.pincode && formik.errors.pincode
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter your pincode"
                        name="pincode"
                        value={formik.values.pincode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.pincode && formik.errors.pincode && (
                        <div className="text-danger small mt-1">
                          {formik.errors.pincode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-tools me-2"></i> Skills
                </div>
                <div className="user-upt-profile-card-body">
                  <div className="user-upt-profile-form-group">
                    <label className="user-upt-profile-form-label">
                      Your Skills
                    </label>
                    <div className="user-upt-profile-skill-input-container justify-content-between">
                      <input
                        type="text"
                        className="form-control user-upt-profile-form-control"
                        placeholder="Add a skill"
                        id="skillInput"
                        style={{ width: "calc(100% - 120px)" }}
                      />
                      <button
                        type="button"
                        className="user-upt-profile-add-btn"
                        onClick={addSkill}
                      >
                        <i className="bi bi-plus-lg"></i> Add
                      </button>
                    </div>
                    <div id="skillsContainer">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="user-upt-profile-skill-badge"
                        >
                          {skill}
                          <span
                            className="user-upt-profile-skill-remove"
                            onClick={() => removeSkill(index)}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-book me-2"></i> Education
                </div>
                <div className="user-upt-profile-card-body">
                  <FieldArray name="education">
                    {({ push, remove }) => (
                      <div id="educationContainer">
                        {formik.values.education.map((entry, index) => (
                          <div key={index} className="user-upt-profile-entry">
                            {formik.values.education.length > 1 && (
                              <button
                                type="button"
                                className="user-upt-profile-remove-btn"
                                onClick={() => remove(index)}
                              >
                                <i className="bi bi-x-circle"></i>
                              </button>
                            )}
                            <div className="row">
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Degree *
                                </label>
                                <input
                                  type="text"
                                  className={`form-control user-upt-profile-form-control ${
                                    formik.touched.education?.[index]?.degree &&
                                    formik.errors.education?.[index]?.degree
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  name={`education[${index}].degree`}
                                  placeholder="e.g. Bachelor of Science in Computer Science"
                                  value={formik.values.education[index].degree}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.education?.[index]?.degree &&
                                  formik.errors.education?.[index]?.degree && (
                                    <div className="text-danger small mt-1">
                                      {formik.errors.education[index].degree}
                                    </div>
                                  )}
                              </div>
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Institution *
                                </label>
                                <input
                                  type="text"
                                  className={`form-control user-upt-profile-form-control ${
                                    formik.touched.education?.[index]
                                      ?.institution &&
                                    formik.errors.education?.[index]
                                      ?.institution
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  placeholder="e.g. University of Example"
                                  name={`education[${index}].institution`}
                                  value={
                                    formik.values.education[index].institution
                                  }
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.education?.[index]
                                  ?.institution &&
                                  formik.errors.education?.[index]
                                    ?.institution && (
                                    <div className="text-danger small mt-1">
                                      {
                                        formik.errors.education[index]
                                          .institution
                                      }
                                    </div>
                                  )}
                              </div>
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Graduation Year *
                                </label>
                                <input
                                  type="number"
                                  className={`form-control user-upt-profile-form-control ${
                                    formik.touched.education?.[index]
                                      ?.graduationYear &&
                                    formik.errors.education?.[index]
                                      ?.graduationYear
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  placeholder="e.g. 2020"
                                  min="1950"
                                  max="2030"
                                  name={`education[${index}].graduationYear`}
                                  value={
                                    formik.values.education[index]
                                      .graduationYear
                                  }
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.education?.[index]
                                  ?.graduationYear &&
                                  formik.errors.education?.[index]
                                    ?.graduationYear && (
                                    <div className="text-danger small mt-1">
                                      {
                                        formik.errors.education[index]
                                          .graduationYear
                                      }
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="user-upt-profile-add-btn"
                          onClick={() =>
                            push({
                              degree: "",
                              institution: "",
                              graduationYear: "",
                            })
                          }
                        >
                          <i className="bi bi-plus-lg me-2"></i> Add Education
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              {/* Experience Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-briefcase me-2"></i> Work Experience
                </div>
                <div className="user-upt-profile-card-body">
                  <FieldArray name="experience">
                    {({ push, remove }) => (
                      <div id="experienceContainer">
                        {formik.values.experience.map((entry, index) => (
                          <div key={index} className="user-upt-profile-entry">
                            {formik.values.experience.length > 1 && (
                              <button
                                type="button"
                                className="user-upt-profile-remove-btn"
                                onClick={() => remove(index)}
                              >
                                <i className="bi bi-x-circle"></i>
                              </button>
                            )}
                            <div className="row">
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Company Name *
                                </label>
                                <input
                                  type="text"
                                  className={`form-control user-upt-profile-form-control ${
                                    formik.touched.experience?.[index]
                                      ?.companyName &&
                                    formik.errors.experience?.[index]
                                      ?.companyName
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  name={`experience[${index}].companyName`}
                                  value={
                                    formik.values.experience[index].companyName
                                  }
                                  placeholder="e.g. Example Corporation"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.experience?.[index]
                                  ?.companyName &&
                                  formik.errors.experience?.[index]
                                    ?.companyName && (
                                    <div className="text-danger small mt-1">
                                      {
                                        formik.errors.experience[index]
                                          .companyName
                                      }
                                    </div>
                                  )}
                              </div>
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Position *
                                </label>
                                <input
                                  type="text"
                                  className={`form-control user-upt-profile-form-control ${
                                    formik.touched.experience?.[index]
                                      ?.position &&
                                    formik.errors.experience?.[index]?.position
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  placeholder="e.g. Software Developer"
                                  name={`experience[${index}].position`}
                                  onChange={formik.handleChange}
                                  value={
                                    formik.values.experience[index].position
                                  }
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.experience?.[index]?.position &&
                                  formik.errors.experience?.[index]
                                    ?.position && (
                                    <div className="text-danger small mt-1">
                                      {formik.errors.experience[index].position}
                                    </div>
                                  )}
                              </div>
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Start Date *
                                </label>
                                <input
                                  type="date"
                                  className={`form-control user-upt-profile-form-control ${
                                    formik.touched.experience?.[index]
                                      ?.startDate &&
                                    formik.errors.experience?.[index]?.startDate
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  name={`experience[${index}].startDate`}
                                  onChange={formik.handleChange}
                                  value={moment(
                                    formik.values.experience[index].startDate
                                  ).format("YYYY-MM-DD")}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.experience?.[index]
                                  ?.startDate &&
                                  formik.errors.experience?.[index]
                                    ?.startDate && (
                                    <div className="text-danger small mt-1">
                                      {
                                        formik.errors.experience[index]
                                          .startDate
                                      }
                                    </div>
                                  )}
                              </div>
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  className="form-control user-upt-profile-form-control"
                                  placeholder="YYYY-MM-DD"
                                  name={`experience[${index}].endDate`}
                                  onChange={formik.handleChange}
                                  value={moment(
                                    formik.values.experience[index].endDate
                                  ).format("YYYY-MM-DD")}
                                  disabled={
                                    formik.values.experience[index].currentJob
                                  }
                                />
                                <div className="form-check mt-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name={`experience[${index}].currentJob`}
                                    onChange={formik.handleChange}
                                    checked={
                                      formik.values.experience[index].currentJob
                                    }
                                  />
                                  <label className="form-check-label">
                                    I currently work here
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-12 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Description
                                </label>
                                <textarea
                                  className="form-control user-upt-profile-form-control user-upt-profile-textarea"
                                  placeholder="Describe your responsibilities and achievements"
                                  name={`experience[${index}].description`}
                                  onChange={formik.handleChange}
                                  value={
                                    formik.values.experience[index].description
                                  }
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="user-upt-profile-add-btn"
                          onClick={() =>
                            push({
                              companyName: "",
                              position: "",
                              startDate: "",
                              endDate: "",
                              currentJob: false,
                              description: "",
                            })
                          }
                        >
                          <i className="bi bi-plus-lg me-2"></i> Add Experience
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              {/* Preferences Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-heart me-2"></i> Job Preferences
                </div>
                <div className="user-upt-profile-card-body">
                  <div className="row">
                    <div className="col-md-6 user-upt-profile-form-group">
                      <DynamicSelect
                        label="Job Type"
                        name="jobType"
                        formik={formik}
                        options={jobTypes}
                        valueKey="_id"
                        labelKey="name"
                        placeholder="Select Type"
                        className="user-upt-profile-form-label"
                        required={false}
                        selectClassName="form-control user-upt-profile-form-control"
                      />
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <DynamicSelect
                        label="Salary"
                        name="salaryRange"
                        required={false}
                        formik={formik}
                        options={salaryOptions}
                        valueKey="value"
                        labelKey="label"
                        placeholder="Select Salary"
                        className="user-upt-profile-form-label"
                        selectClassName="form-control user-upt-profile-form-control"
                      />
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Preferred Locations
                      </label>
                      <input
                        type="text"
                        className="form-control user-upt-profile-form-control"
                        placeholder="Enter preferred locations separated by commas"
                        name="preferredLocations"
                        value={formik.values.preferredLocations}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-file-earmark me-2"></i> Resume
                </div>
                <div className="user-upt-profile-card-body">
                  <div className="user-upt-profile-form-group">
                    <label className="user-upt-profile-form-label">
                      Upload Your Resume
                    </label>
                    <input
                      type="file"
                      className="form-control user-upt-profile-form-control"
                      accept=".pdf,.doc,.docx"
                      ref={resumeFileInputRef}
                      onChange={handleResumeUpload}
                    />
                    <div className="form-text mt-1">
                      Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                    </div>

                    {/* Show existing file info */}
                    {(user?.resume || resumeFileName) && (
                      <div className="mt-3 d-flex align-items-center justify-content-between w-100">
                        <span
                          className="fw-semibold text-dark text-truncate me-3"
                          style={{ maxWidth: "70%" }}
                        >
                          {resumeFileName ? (
                            <>
                              <span className="text-muted">
                                Selected file:{" "}
                              </span>
                              {resumeFileName}
                            </>
                          ) : (
                            <>
                              <span className="text-muted">Current file: </span>
                              {user.resume
                                .split("/")
                                .pop()
                                .replace(/^\d+-/, "")}
                            </>
                          )}
                        </span>

                        {user?.resume && (
                          <a
                            href={`${
                              process.env.NEXT_PUBLIC_BACKEND_URL
                            }/${user.resume.replace(/^src[\\/]/, "")}`}
                            className="btn btn-sm btn-outline-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="bi bi-eye me-1"></i> View Resume
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-light user-upt-profile-btn-outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <i className="bi bi-x-circle me-2"></i> Cancel
                </button>
                <button
                  type="submit"
                  className="btn user-upt-profile-btn-primary"
                  disabled={isSubmitting}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </FormikProvider>
        </div>
      </Layout>
    </>
  );
}
