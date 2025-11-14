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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout>
        <div>
          <div className="d-flex justify-content-end align-items-center mb-4">
            <button
              className="btn btn-sm btn-outline-secondary"
              title="Edit"
              onClick={() => router.push("/employee/update-profile")}
            >
              <i className="bi bi-pencil"></i>
            </button>
          </div>

          {/* Profile Completion Progress */}
          {profileCompletionData && (
            <div className="candidate-profile-progress-container mb-4">
              <div className="candidate-profile-progress-header">
                <h4 className="candidate-profile-progress-title">
                  <i className="bi bi-graph-up me-2"></i>
                  Profile Completion
                </h4>
                <span className="candidate-profile-progress-percentage">
                  {profileCompletionData.profileCompletion}%
                </span>
              </div>
              <div className="candidate-profile-progress-bar">
                <div
                  className="candidate-profile-progress-fill"
                  style={{
                    width: `${profileCompletionData.profileCompletion}%`,
                  }}
                ></div>
              </div>
              <p className="candidate-profile-progress-text">
                Complete your profile to increase your chances of getting hired
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
                  <img
                    src={
                      user.profilePhotoUrl ||
                      "https://randomuser.me/api/portraits/men/32.jpg"
                    }
                    alt="Profile Photo"
                    className="jobseeker-profile-img"
                  />
                  <h2 className="jobseeker-profile-name">{user.name}</h2>
                  <p className="jobseeker-profile-title">
                    <i className="bi bi-briefcase me-2"></i>
                    {user.experience && user.experience.length > 0
                      ? user.experience[0].position
                      : "Profession not specified"}
                  </p>
                  <div className="jobseeker-rating">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-half"></i>
                    <span className="text-dark ms-2">(69 reviews)</span>
                  </div>
                </div>

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
                  </ul>
                </div>

                {/* Tab Content */}
                <div className="jobseeker-tab-content">
                  {/* About Tab */}
                  {activeTab === "about" && (
                    <div>
                      <div className="row mt-4">
                        <div className="col-md-6">
                          <h5 className="jobseeker-section-title">
                            <i className="bi bi-info-circle me-2"></i>About Me
                          </h5>
                          <p className="fw-bold">
                            {user.employeeDescription || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="row mt-4">
                        <div className="col-md-6">
                          <h5 className="jobseeker-section-title">
                            <i className="bi bi-award me-2"></i>Work Status
                          </h5>
                          <p className="fw-bold">
                            {user.workStatus || "Not specified"}
                          </p>
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

                      <div className="row mt-4">
                        <div className="col-md-6">
                          <h5 className="jobseeker-section-title">
                            <i className="bi bi-currency-dollar me-2"></i>
                            Salary Expectations
                          </h5>
                          <p className="fw-bold">
                            {user.preferences && user.preferences.salary_range
                              ? user.preferences.salary_range
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Experience Tab */}
                  {activeTab === "experience" && (
                    <div>
                      <h4 className="jobseeker-section-title">
                        Work Experience
                      </h4>

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
                      <h4 className="jobseeker-section-title">Education</h4>

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
                </div>

                {/* Action Buttons */}
                <div className="jobseeker-action-buttons">
                  <a
                    href={`${
                      process.env.NEXT_PUBLIC_BACKEND_URL
                    }/${user?.resume?.replace(/^src[\\/]/, "")}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="jobseeker-btn-primary"
                  >
                    <i className="bi bi-eye me-2"></i>View Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          /* Profile Completion Progress Styles - Clean Design */
          .candidate-profile-progress-container {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 20px;
            color: #495057;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
            color: #495057;
          }

          .candidate-profile-progress-percentage {
            font-size: 1.5rem;
            font-weight: bold;
            background: #e9ecef;
            color: #495057;
            padding: 5px 12px;
            border-radius: 20px;
          }

          .candidate-profile-progress-bar {
            height: 8px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 10px;
          }

          .candidate-profile-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            border-radius: 10px;
            transition: width 0.5s ease-in-out;
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
            color: #6c757d;
            margin: 0;
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

          /* Verified Badge */
          .verified-badge {
            font-size: 0.8rem;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
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
          }
        `}</style>
      </Layout>
    </>
  );
};

export default JobSeekerProfile;
