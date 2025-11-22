import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getuser, getuserProfileCompletionData } from "@/api/auth";

const JobSeekerProfile = () => {
  const [activeTab, setActiveTab] = useState("about");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profileCompletionData = useSelector(
    (state) => state.auth.profileCompletion
  );
  const router = useRouter();

  useEffect(() => {
    dispatch(getuser());
    dispatch(getuserProfileCompletionData());
  }, []);

  // Function to get progress bar color based on completion percentage
  const getProgressBarColor = (percentage) => {
    if (percentage <= 30) {
      return {
        backgroundColor: "#dc3545", // Red
        textColor: "#721c24",
        bgColor: "#f8d7da",
        progressColor: "#dc3545", // Red progress bar
      };
    } else if (percentage <= 70) {
      return {
        backgroundColor: "#fd7e14", // Orange
        textColor: "#856404",
        bgColor: "#fff3cd",
        progressColor: "#fd7e14", // Orange progress bar
      };
    } else {
      return {
        backgroundColor: "#28a745", // Green
        textColor: "#155724",
        bgColor: "#d4edda",
        progressColor: "#28a745", // Green progress bar
      };
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Helper function to safely get salary range
  const getSalaryRange = () => {
    if (!user.preferences?.salary_range) return "Not specified";

    if (typeof user.preferences.salary_range === "string") {
      return user.preferences.salary_range;
    }

    if (user.preferences.salary_range.range) {
      return user.preferences.salary_range.range;
    }

    return "Not specified";
  };

  // Helper function to safely get work status
  const getWorkStatus = () => {
    return user.workStatus || "Not specified";
  };

  // Helper function to safely get employee description
  const getEmployeeDescription = () => {
    return user.employeeDescription || "Not specified";
  };

  // Helper function to safely get current position
  const getCurrentPosition = () => {
    if (user.experience && user.experience.length > 0) {
      return user.experience[0].position;
    }
    return "Profession not specified";
  };

  // Helper function to safely get resume URL
  const getResumeUrl = () => {
    if (!user.resume) return "#";

    const resumePath = user.resume.replace(/^src[\\/]/, "");
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${resumePath}`;
  };

  // Helper function to safely get industries
  const getIndustries = () => {
    if (!user.industry || !Array.isArray(user.industry)) return [];
    return user.industry.filter((ind) => ind && ind.title);
  };

  // Helper functions for preferences
  const getJobTypes = () => {
    if (!user.preferences?.jobTypes) return [];
    return user.preferences.jobTypes.map((job) => job.name || "Not specified");
  };

  const getDepartments = () => {
    if (!user.preferences?.department) return [];
    // Remove duplicates based on _id
    const uniqueDepartments = user.preferences.department.filter(
      (dept, index, self) => index === self.findIndex((d) => d._id === dept._id)
    );
    return uniqueDepartments.map((dept) => dept.name || "Not specified");
  };

  const getIndustry = () => {
    if (!user.preferences?.industry) return "Not specified";

    if (typeof user.preferences.industry === "string") {
      return user.preferences.industry;
    }

    if (user.preferences.industry.title) {
      return user.preferences.industry.title;
    }

    return "Not specified";
  };

  const getPreferredLocations = () => {
    if (!user.preferences?.preffered_locations) return [];
    return user.preferences.preffered_locations;
  };

  const hasPreferences = () => {
    return (
      user.preferences &&
      (user.preferences.jobTypes?.length > 0 ||
        user.preferences.department?.length > 0 ||
        user.preferences.salary_range ||
        user.preferences.industry ||
        user.preferences.preffered_locations?.length > 0)
    );
  };

  // Get progress bar colors based on current completion percentage
  const progressColors = profileCompletionData
    ? getProgressBarColor(profileCompletionData.profileCompletion)
    : getProgressBarColor(0);

  return (
    <>
      <Layout>
        <div>
          {/* Profile Completion Progress */}
          {profileCompletionData && (
            <div
              className="candidate-profile-progress-container mb-4 p-3 rounded"
              style={{
                border: `1px solid ${progressColors.backgroundColor}33`,
              }}
            >
              <div className="candidate-profile-progress-header d-flex justify-content-between align-items-center">
                <h4
                  className="candidate-profile-progress-title mb-0"
                  style={{ color: progressColors.textColor }}
                >
                  <i className="bi bi-graph-up me-2"></i>
                  Profile Completion
                </h4>
                <span
                  className="candidate-profile-progress-percentage fw-bold"
                  style={{
                    color: progressColors.textColor,
                    backgroundColor: progressColors.backgroundColor + "20",
                  }}
                >
                  {profileCompletionData.profileCompletion}%
                </span>
              </div>
              <div className="candidate-profile-progress-bar mt-2 bg-light rounded-pill overflow-hidden">
                <div
                  className="candidate-profile-progress-fill h-100 rounded-pill transition-all duration-500 ease-in-out"
                  style={{
                    width: `${profileCompletionData.profileCompletion}%`,
                    backgroundColor: progressColors.progressColor,
                  }}
                ></div>
              </div>
              <p
                className="candidate-profile-progress-text mt-2 mb-0 small"
                style={{ color: progressColors.textColor }}
              >
                {profileCompletionData.profileCompletion <= 30 &&
                  "Complete more sections to improve your profile visibility"}
                {profileCompletionData.profileCompletion > 30 &&
                  profileCompletionData.profileCompletion <= 70 &&
                  "Good progress! Keep completing sections to stand out"}
                {profileCompletionData.profileCompletion > 70 &&
                  "Excellent! Your profile is almost complete"}
              </p>
            </div>
          )}
          {/* Missing Fields Alert */}
          {profileCompletionData?.missingFields &&
            profileCompletionData.missingFields.length > 0 && (
              <div className="candidate-profile-missing-fields">
                <div className="candidate-profile-missing-header">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <h5 className="candidate-profile-missing-title">
                    Complete Your Profile
                  </h5>
                </div>
                <p className="candidate-profile-missing-text">
                  Add the following information to make your profile stand out:
                </p>
                <div className="candidate-profile-missing-list">
                  {profileCompletionData.missingFields.map((field, index) => (
                    <span
                      key={index}
                      className="candidate-profile-missing-item"
                    >
                      {field.displayName}
                    </span>
                  ))}
                </div>
              </div>
            )}

          <div className="jobseeker-profile-card">
            <div className="row">
              {/* Left Profile Column */}
              <div className="col-lg-4 border-end">
                <div className="jobseeker-profile-img-container">
                  <div
                    className="profile-image-wrapper"
                    // onClick={() => router.push('/update-profile')}
                  >
                    <svg className="progress-ring" width="180" height="180">
                      <circle
                        className="progress-ring-circle-bg"
                        stroke="#e9ecef"
                        strokeWidth="6"
                        fill="transparent"
                        r="84"
                        cx="90"
                        cy="90"
                      />
                      <circle
                        className="progress-ring-circle"
                        stroke={progressColors.progressColor}
                        strokeWidth="6"
                        fill="transparent"
                        r="84"
                        cx="90"
                        cy="90"
                        style={{
                          strokeDasharray: `${
                            (84 *
                              2 *
                              Math.PI *
                              (profileCompletionData?.profileCompletion || 0)) /
                            100
                          } ${84 * 2 * Math.PI}`,
                          strokeDashoffset: 0,
                          transform: "rotate(-90deg)",
                          transformOrigin: "50% 50%",
                          transition:
                            "stroke-dasharray 0.8s ease-in-out, stroke 0.3s ease",
                        }}
                      />
                    </svg>

                    {/* Fixed Progress Percentage Badge at Bottom */}
                    <div
                      className="progress-percentage-badge"
                      style={{
                        backgroundColor: progressColors.progressColor,
                        position: "absolute",
                        bottom: "-15px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        zIndex: 10,
                        border: "3px solid white",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <span className="progress-percentage-text">
                        {profileCompletionData?.profileCompletion || 0}%
                      </span>
                    </div>

                    <div className="profile-image-inner">
                      <img
                        src={
                          user.profilePhotoUrl ||
                          "https://randomuser.me/api/portraits/men/32.jpg"
                        }
                        alt="Profile Photo"
                        className="jobseeker-profile-img"
                      />
                      <div className="profile-image-overlay">
                        <i className="bi bi-plus-circle-fill"></i>
                      </div>
                    </div>
                  </div>

                  <h2 className="jobseeker-profile-name">{user.name}</h2>
                  <p className="jobseeker-profile-title">
                    <i className="bi bi-briefcase me-2"></i>
                    {getCurrentPosition()}
                  </p>
                </div>

                {/* Industries Section */}
                {getIndustries().length > 0 && (
                  <div className="jobseeker-industries-container">
                    <h6 className="jobseeker-industries-title">
                      <i className="bi bi-building me-2"></i>Communities
                    </h6>
                    <div className="jobseeker-industries-list">
                      {getIndustries().map((industry, index) => (
                        <div key={index} className="jobseeker-industry-item">
                          {industry.image && (
                            <img
                              src={industry.image}
                              alt={industry.title}
                              className="jobseeker-industry-icon"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <span className="jobseeker-industry-name">
                            {industry.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <div className="jobseeker-contact-info">
                    <h5 className="mb-3">
                      <i className="bi bi-person-lines-fill me-2"></i>Contact
                      Information
                    </h5>
                    <div className="jobseeker-contact-item">
                      <div className="jobseeker-contact-icon">
                        <i className="bi bi-envelope"></i>
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <p className="mb-0">Email</p>
                          {user.emailVerified && (
                            <span
                              className="verified-badge"
                              title="Email Verified"
                            >
                              <i className="bi bi-patch-check-fill text-primary"></i>
                            </span>
                          )}
                        </div>
                        <p className="fw-bold">{user.email}</p>
                      </div>
                    </div>
                    <div className="jobseeker-contact-item">
                      <div className="jobseeker-contact-icon">
                        <i className="bi bi-telephone"></i>
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <p className="mb-0">Phone</p>
                          {user.mobileVerified && (
                            <span
                              className="verified-badge"
                              title="Phone Verified"
                            >
                              <i className="bi bi-patch-check-fill text-primary"></i>
                            </span>
                          )}
                        </div>
                        <p className="fw-bold">{user.mobile}</p>
                      </div>
                    </div>
                    {user?.address && (
                      <div className="jobseeker-contact-item">
                        <div className="jobseeker-contact-icon">
                          <i className="bi bi-geo-alt"></i>
                        </div>
                        <div>
                          <p className="mb-0">Location</p>
                          <p className="fw-bold">
                            {user.address && `${user.address}, `}
                            {user.city && `${user.city}, `}
                            {user.state && `${user.state}, `}
                            {user.country && user.country}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Profile Column */}
              <div className="col-lg-8">
                {/* Navigation Tabs */}
                <div>
                  <ul className="headeritems nav-tabs mt-4 px-4 jobseeker-nav-tabs">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "about" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("about")}
                      >
                        <i className="bi bi-person-circle me-2"></i>About
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "experience" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("experience")}
                      >
                        <i className="bi bi-briefcase me-2"></i>Experience
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "education" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("education")}
                      >
                        <i className="bi bi-journal-bookmark me-2"></i>
                        Education
                      </button>
                    </li>
                    {hasPreferences() && (
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            activeTab === "preferences" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("preferences")}
                        >
                          <i className="bi bi-heart me-2"></i>
                          Preferences
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Tab Content */}
                <div className="jobseeker-tab-content">
                  {/* About Tab */}
                  {activeTab === "about" && (
                    <div>
                      <div className="section-header-with-edit">
                        <h4 className="jobseeker-section-main-title">About</h4>
                        <button
                          className="edit-section-btn"
                          onClick={() =>
                            router.push("/employee/update-profile")
                          }
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      </div>

                      <div className="row mt-4">
                        <div className="col-md-6">
                          <h5 className="jobseeker-section-title">
                            <i className="bi bi-info-circle me-2"></i>About Me
                          </h5>
                          <p className="fw-bold">{getEmployeeDescription()}</p>
                        </div>
                      </div>

                      <div className="row mt-4">
                        <div className="col-md-6">
                          <h5 className="jobseeker-section-title">
                            <i className="bi bi-award me-2"></i>Work Status
                          </h5>
                          <p className="fw-bold">{getWorkStatus()}</p>
                        </div>
                      </div>

                      <div className="jobseeker-skills-container my-4">
                        <h5 className="jobseeker-section-title">
                          <i className="bi bi-tools me-2"></i>Skills & Expertise
                        </h5>
                        <div className="d-flex flex-wrap">
                          {user.skills && user.skills.length > 0 ? (
                            user.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="jobseeker-skill-badge"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-muted">No skills added yet.</p>
                          )}
                        </div>
                      </div>

                      <div className="row mt-4 mb-4">
                        <div className="col-md-6">
                          <h5 className="jobseeker-section-title">
                            <i className="bi bi-currency-dollar me-2"></i>
                            Salary Expectations
                          </h5>
                          <p className="fw-bold">{getSalaryRange()}</p>
                        </div>
                      </div>

                      <div className=" me-4" style={{ marginTop: "3rem" }}>
                        <a
                          href={getResumeUrl()}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                        >
                          <i className="bi bi-eye me-2"></i>View Resume
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Experience Tab */}
                  {activeTab === "experience" && (
                    <div>
                      <div className="section-header-with-edit">
                        <h4 className="jobseeker-section-main-title">
                          Work Experience
                        </h4>
                        <button
                          className="edit-section-btn"
                          onClick={() =>
                            router.push("/employee/update-profile")
                          }
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      </div>

                      {user.experience && user.experience.length > 0 ? (
                        user.experience.map((exp, index) => (
                          <div
                            key={index}
                            className="jobseeker-experience-item"
                          >
                            <div className="d-flex justify-content-start flex-wrap">
                              <h5>{exp.position}</h5>
                            </div>
                            <p className="text-primary fw-bold">
                              {exp.companyName}
                            </p>
                            <p className="text-muted">
                              {new Date(exp.startDate).toLocaleDateString()} -{" "}
                              {exp.endDate
                                ? new Date(exp.endDate).toLocaleDateString()
                                : "Present"}
                            </p>
                            <p>{exp.description}</p>
                          </div>
                        ))
                      ) : (
                        <p>No experience information available.</p>
                      )}
                    </div>
                  )}

                  {/* Education Tab */}
                  {activeTab === "education" && (
                    <div>
                      <div className="section-header-with-edit">
                        <h4 className="jobseeker-section-main-title">
                          Education
                        </h4>
                        <button
                          className="edit-section-btn"
                          onClick={() =>
                            router.push("/employee/update-profile")
                          }
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      </div>

                      {user.education && user.education.length > 0 ? (
                        user.education.map((edu, index) => (
                          <div
                            key={index}
                            className="jobseeker-experience-item"
                          >
                            <h5>{edu.degree}</h5>
                            <p className="text-primary fw-bold">
                              {edu.institution}
                            </p>
                            <p className="text-muted">
                              Graduated: {edu.graduationYear}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No education information available.</p>
                      )}
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === "preferences" && hasPreferences() && (
                    <div>
                      <div className="section-header-with-edit">
                        <h4 className="jobseeker-section-main-title">
                          Job Preferences
                        </h4>
                        <button
                          className="edit-section-btn"
                          onClick={() =>
                            router.push("/employee/update-profile")
                          }
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      </div>

                      {/* Job Types */}
                      {getJobTypes().length > 0 && (
                        <div className="jobseeker-preference-section">
                          <h5 className="jobseeker-section-title">
                            <i className="bi bi-briefcase me-2"></i>Preferred
                            Job Types
                          </h5>
                          <div className="d-flex flex-wrap">
                            {getJobTypes().map((type, index) => (
                              <span
                                key={index}
                                className="jobseeker-preference-badge"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Departments */}
                      {getDepartments().length > 0 && (
                        <div className="jobseeker-preference-section">
                          <h5 className="jobseeker-section-title">
                            <i className="bi bi-building me-2"></i>Preferred
                            Departments
                          </h5>
                          <div className="d-flex flex-wrap">
                            {getDepartments().map((dept, index) => (
                              <span
                                key={index}
                                className="jobseeker-preference-badge"
                              >
                                {dept}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Industry */}
                      {getIndustry() !== "Not specified" && (
                        <div className="jobseeker-preference-section">
                          <h5 className="jobseeker-section-title">
                            <i className="bi bi-industry me-2"></i>Preferred
                            Industry
                          </h5>
                          <p className="fw-bold">{getIndustry()}</p>
                        </div>
                      )}

                      {/* Preferred Locations */}
                      {getPreferredLocations().length > 0 && (
                        <div className="jobseeker-preference-section">
                          <h5 className="jobseeker-section-title">
                            <i className="bi bi-geo-alt me-2"></i>Preferred
                            Locations
                          </h5>
                          <div className="d-flex flex-wrap">
                            {getPreferredLocations().map((location, index) => (
                              <span
                                key={index}
                                className="jobseeker-preference-badge"
                              >
                                {location}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Salary Range */}
                      {getSalaryRange() !== "Not specified" && (
                        <div className="jobseeker-preference-section">
                          <h5 className="jobseeker-section-title">
                            <i className="bi bi-currency-dollar me-2"></i>Salary
                            Expectations
                          </h5>
                          <p className="fw-bold">{getSalaryRange()}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          /* Profile Image with Circular Progress */
          .profile-image-wrapper {
            position: relative;
            width: 180px;
            height: 180px;
            margin: 2rem auto 1rem;
            cursor: pointer;
          }

          .progress-ring {
            position: absolute;
            top: 0;
            left: 0;
            transform: rotate(0deg);
          }

          .progress-ring-circle-bg {
            transition: stroke 0.3s ease;
          }

          .progress-ring-circle {
            transition: stroke-dasharray 0.8s ease-in-out, stroke 0.3s ease;
          }

          .profile-image-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 150px;
            height: 150px;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid #fff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .jobseeker-profile-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .profile-image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 123, 255, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            border-radius: 50%;
          }

          .profile-image-overlay i {
            font-size: 3rem;
            color: white;
            transform: scale(0);
            transition: transform 0.3s ease;
          }

          .jobseeker-profile-img-container {
            text-align: center;
            padding: 1rem 0;
          }

          .jobseeker-profile-name {
            margin-top: 1rem;
            font-size: 1.5rem;
            font-weight: 600;
            color: #2c3e50;
          }

          .jobseeker-profile-title {
            color: #6c757d;
            font-size: 0.95rem;
          }

          /* Section Header with Edit Button */
          .section-header-with-edit {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #e9ecef;
          }

          .jobseeker-section-main-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2c3e50;
            margin: 0;
          }

          .edit-section-btn {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0.5rem 1rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .edit-section-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
            background: linear-gradient(135deg, #0056b3, #004085);
          }

          .edit-section-btn:active {
            transform: translateY(0);
          }

          .edit-section-btn i {
            font-size: 1.1rem;
          }

          /* Profile Completion Progress Styles - Clean Design with Dynamic Colors */
          .candidate-profile-progress-container {
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
          }

          .candidate-profile-progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .candidate-profile-progress-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin: 0;
          }

          .candidate-profile-progress-percentage {
            font-size: 1.5rem;
            font-weight: bold;
            padding: 5px 12px;
            border-radius: 20px;
          }

          .candidate-profile-progress-bar {
            height: 10px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 10px;
          }

          .candidate-profile-progress-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 0.8s ease-in-out, background-color 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .candidate-profile-progress-fill::after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }

          .candidate-profile-progress-text {
            font-size: 0.9rem;
            margin: 0;
          }

          .transition-all {
            transition: all 0.3s ease;
          }

          .duration-500 {
            transition-duration: 0.5s;
          }

          .ease-in-out {
            transition-timing-function: ease-in-out;
          }

          /* Missing Fields Styles */
          .candidate-profile-missing-fields {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
          }

          .candidate-profile-missing-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }

          .candidate-profile-missing-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #856404;
            margin: 0;
          }

          .candidate-profile-missing-text {
            color: #856404;
            margin-bottom: 12px;
            font-size: 0.9rem;
          }

          .candidate-profile-missing-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .candidate-profile-missing-item {
            background: #fff;
            border: 1px solid #ffeaa7;
            border-radius: 16px;
            padding: 4px 12px;
            font-size: 0.8rem;
            color: #856404;
            font-weight: 500;
          }

          /* Industries Section Styles */
          .jobseeker-industries-container {
            padding: 1.5rem;
            border-radius: 12px;
            margin: 0 1rem 1rem 1rem;
          }

          .jobseeker-industries-title {
            font-size: 0.95rem;
            font-weight: 600;
            color: #495057;
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .jobseeker-industries-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .progress-percentage-text {
            color: white;
            font-size: 0.7rem;
            font-weight: 700;
            text-align: center;
            line-height: 1;
          }

          .profile-image-wrapper:hover .progress-percentage-badge {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
          }

          @media (max-width: 768px) {
            .progress-percentage-badge {
              width: 40px;
              height: 40px;
              bottom: 8px;
            }

            .progress-percentage-text {
              font-size: 0.6rem;
            }
          }

          .jobseeker-industry-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: white;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: 1px solid #e9ecef;
          }

          .jobseeker-industry-item:hover {
            transform: translateX(5px);
            box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
            border-color: #007bff;
          }

          .jobseeker-industry-icon {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            object-fit: cover;
            border: 2px solid #e9ecef;
            flex-shrink: 0;
          }

          .jobseeker-industry-name {
            font-size: 0.85rem;
            font-weight: 500;
            color: #495057;
            line-height: 1.4;
          }

          /* Verified Badge */
          .verified-badge {
            font-size: 0.8rem;
          }

          /* Preference Styles */
          .jobseeker-preference-section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 12px;
            border-left: 4px solid #007bff;
          }

          .jobseeker-preference-badge {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
            margin: 0.25rem;
            display: inline-block;
            box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
            transition: all 0.3s ease;
          }

          .jobseeker-preference-badge:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .profile-image-wrapper {
              width: 150px;
              height: 150px;
            }

            .progress-ring {
              width: 150px;
              height: 150px;
            }

            .progress-ring circle {
              r: 69;
              cx: 75;
              cy: 75;
            }

            .profile-image-inner {
              width: 120px;
              height: 120px;
            }

            .profile-image-overlay i {
              font-size: 2.5rem;
            }

            .jobseeker-profile-name {
              font-size: 1.3rem;
            }

            .section-header-with-edit {
              flex-direction: row;
              gap: 1rem;
            }

            .jobseeker-section-main-title {
              font-size: 1.2rem;
            }

            .edit-section-btn {
              padding: 0.4rem 0.8rem;
              font-size: 0.9rem;
            }

            .candidate-profile-progress-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
            }

            .candidate-profile-progress-percentage {
              align-self: flex-end;
            }

            .candidate-profile-missing-list {
              gap: 6px;
            }

            .candidate-profile-missing-item {
              font-size: 0.75rem;
              padding: 3px 10px;
            }

            .jobseeker-preference-section {
              padding: 1rem;
              margin-bottom: 1.5rem;
            }

            .jobseeker-preference-badge {
              padding: 0.4rem 0.8rem;
              font-size: 0.8rem;
            }

            .jobseeker-industries-container {
              margin: 0 0.5rem 1rem 0.5rem;
              padding: 1rem;
            }

            .jobseeker-industries-title {
              font-size: 0.85rem;
            }

            .jobseeker-industry-icon {
              width: 28px;
              height: 28px;
            }

            .jobseeker-industry-name {
              font-size: 0.8rem;
            }

            .jobseeker-industry-item {
              padding: 0.6rem;
            }
          }
        `}</style>
      </Layout>
    </>
  );
};

export default JobSeekerProfile;
