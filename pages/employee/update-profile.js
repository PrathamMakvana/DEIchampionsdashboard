import { useFormik, FieldArray, FormikProvider } from "formik";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useSelector } from "react-redux";

export default function UserProfileUpdate() {
  const user = useSelector((state) => state.auth.user);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [skills, setSkills] = useState([]);
  const fileInputRef = useRef(null);

  const defaultInitialValues = {
    name: "",
    email: "",
    mobile: "",
    dateOfBirth: null,
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
        company: "",
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
    onSubmit: (values) => {
      // Simulate form submission
      console.log("Form submitted:", {
        ...values,
        skills,
        photo: photoPreview,
      });
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (user) {
      formik.setValues({
        ...defaultInitialValues,
        name: user.name || "",
        email: user.email || "",
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
        preferredLocations:
          user.preferences?.preffered_locations?.join(", ") || "",
      });

      setSkills(user.skills || []);
    }
  }, [user]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
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
                            className="form-control user-upt-profile-form-control"
                            name="name"
                            placeholder="Enter your full name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            className="form-control user-upt-profile-form-control"
                            name="email"
                            placeholder="Enter your email address"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            className="form-control user-upt-profile-form-control"
                            placeholder="Enter your mobile number"
                            name="mobile"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            className="form-control user-upt-profile-form-control"
                            placeholder="YYYY-MM-DD"
                            name="dateOfBirth"
                            value={formik.values.dateOfBirth || ""}
                            onChange={formik.handleChange}
                          />
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
                            className="form-select user-upt-profile-form-control"
                            name="workStatus"
                            value={formik.values.workStatus}
                            onChange={formik.handleChange}
                            required
                          >
                            <option value="">Select Status</option>
                            <option value="employed">Employed</option>
                            <option value="unemployed">Unemployed</option>
                            <option value="student">Student</option>
                            <option value="self-employed">Self-Employed</option>
                          </select>
                        </div>
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
                        className="form-control user-upt-profile-form-control"
                        placeholder="Enter your address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your city"
                        className="form-control user-upt-profile-form-control"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        State *
                      </label>
                      <input
                        type="text"
                        className="form-control user-upt-profile-form-control"
                        name="state"
                        placeholder="Enter your state"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        required
                      />
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
                        placeholder="Enter your pincode"
                        className="form-control user-upt-profile-form-control"
                        name="pincode"
                        value={formik.values.pincode}
                        onChange={formik.handleChange}
                        required
                      />
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
                                  className="form-control user-upt-profile-form-control"
                                  placeholder="e.g. Bachelor of Technology"
                                  name={`education[${index}].degree`}
                                  value={formik.values.education[index].degree}
                                  onChange={formik.handleChange}
                                />
                              </div>
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Institution *
                                </label>
                                <input
                                  type="text"
                                  className="form-control user-upt-profile-form-control"
                                  placeholder="e.g. University of Example"
                                  name={`education[${index}].institution`}
                                  value={
                                    formik.values.education[index].institution
                                  }
                                  onChange={formik.handleChange}
                                />
                              </div>
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Graduation Year *
                                </label>
                                <input
                                  type="number"
                                  className="form-control user-upt-profile-form-control"
                                  placeholder="e.g. 2020"
                                  min="1950"
                                  max="2030"
                                  name={`education[${index}].graduationYear`}
                                  value={
                                    formik.values.education[index]
                                      .graduationYear
                                  }
                                  onChange={formik.handleChange}
                                />
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
                                  className="form-control user-upt-profile-form-control"
                                  placeholder="e.g. ABC Corporation"
                                  name={`experience[${index}].company`}
                                  onChange={formik.handleChange}
                                  value={
                                    formik.values.experience[index].company
                                  }
                                  required
                                />
                              </div>
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Position *
                                </label>
                                <input
                                  type="text"
                                  className="form-control user-upt-profile-form-control"
                                  placeholder="e.g. Software Developer"
                                  name={`experience[${index}].position`}
                                  onChange={formik.handleChange}
                                  value={
                                    formik.values.experience[index].position
                                  }
                                  required
                                />
                              </div>
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Start Date *
                                </label>
                                <input
                                  type="date"
                                  className="form-control user-upt-profile-form-control"
                                  name={`experience[${index}].startDate`}
                                  onChange={formik.handleChange}
                                  value={
                                    formik.values.experience[index].startDate
                                  }
                                  required
                                />
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
                                  value={
                                    formik.values.experience[index].endDate
                                  }
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
                              company: "",
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
                      <label className="user-upt-profile-form-label">
                        Job Type
                      </label>
                      <select
                        className="form-select user-upt-profile-form-control"
                        name="jobType"
                        value={formik.values.jobType}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Job Type</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                        <option value="remote">Remote</option>
                      </select>
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Department
                      </label>
                      <select
                        className="form-select user-upt-profile-form-control"
                        name="department"
                        value={formik.values.department}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Department</option>
                        <option value="it">IT</option>
                        <option value="hr">HR</option>
                        <option value="finance">Finance</option>
                        <option value="marketing">Marketing</option>
                        <option value="operations">Operations</option>
                        <option value="sales">Sales</option>
                        <option value="customer-service">
                          Customer Service
                        </option>
                        <option value="design">Design</option>
                        <option value="engineering">Engineering</option>
                      </select>
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Category
                      </label>
                      <select
                        className="form-select user-upt-profile-form-control"
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Category</option>
                        <option value="entry-level">Entry Level</option>
                        <option value="mid-level">Mid Level</option>
                        <option value="senior-level">Senior Level</option>
                        <option value="management">Management</option>
                        <option value="executive">Executive</option>
                        <option value="freelance">Freelance</option>
                        <option value="consultant">Consultant</option>
                      </select>
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Salary Range
                      </label>
                      <select
                        className="form-select user-upt-profile-form-control"
                        name="salaryRange"
                        value={formik.values.salaryRange}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Salary Range</option>
                        <option value="0-3">0-3 LPA</option>
                        <option value="3-6">3-6 LPA</option>
                        <option value="6-10">6-10 LPA</option>
                        <option value="10-15">10-15 LPA</option>
                        <option value="15+">15+ LPA</option>
                      </select>
                    </div>
                    <div className="col-md-12 user-upt-profile-form-group">
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
                    />
                    <div className="form-text">
                      Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-shield-lock me-2"></i> Security
                </div>
                <div className="user-upt-profile-card-body">
                  <div className="row">
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Current Password
                      </label>
                      <div className="user-upt-profile-input-group">
                        <input
                          type="password"
                          className="form-control user-upt-profile-form-control"
                          placeholder="Enter current password"
                          name="currentPassword"
                          id="currentPassword"
                          value={formik.values.currentPassword}
                          onChange={formik.handleChange}
                        />
                        <span
                          className="user-upt-profile-password-toggle"
                          onClick={() =>
                            togglePasswordVisibility("currentPassword")
                          }
                        >
                          <i className="bi bi-eye"></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        New Password
                      </label>
                      <div className="user-upt-profile-input-group">
                        <input
                          type="password"
                          className="form-control user-upt-profile-form-control"
                          placeholder="Enter new password"
                          name="newPassword"
                          id="newPassword"
                          value={formik.values.newPassword}
                          onChange={formik.handleChange}
                        />
                        <span
                          className="user-upt-profile-password-toggle"
                          onClick={() =>
                            togglePasswordVisibility("newPassword")
                          }
                        >
                          <i className="bi bi-eye"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-text">
                    Leave password fields blank if you don't want to change your
                    password
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-light user-upt-profile-btn-outline"
                >
                  <i className="bi bi-x-circle me-2"></i> Cancel
                </button>
                <button
                  type="submit"
                  className="btn user-upt-profile-btn-primary"
                >
                  <i className="bi bi-check-circle me-2"></i> Save Changes
                </button>
              </div>
            </form>
          </FormikProvider>
        </div>
      </Layout>
    </>
  );
}
