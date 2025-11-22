import { getuserbyid } from "@/api/auth";
import { getSettingsByUserId } from "@/api/userSetting"; // Import the new function
import { getAuthUser } from "@/api/auth";
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaTools,
  FaBriefcase,
  FaGraduationCap,
  FaSuitcase,
  FaFilePdf,
  FaDownload,
  FaIndustry,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";

const ApplicationDetails = () => {
  const dispatch = useDispatch();
  const route = useRouter();
  const { id } = route.query;
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIndustry, setShowIndustry] = useState(false);
  const [applicantSettings, setApplicantSettings] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Get logged in user from Redux store if available
  const currentUser = useSelector((state) => state.auth?.user);

  // ✅ Fetch applicant details and determine industry visibility
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch applicant data
        const applicantRes = await dispatch(getuserbyid(id));
        const applicant = applicantRes?.payload || applicantRes || null;
        setApplicationData(applicant);

        if (!applicant) {
          setLoading(false);
          return;
        }

        // 2. Fetch the APPLICANT'S user settings using their user ID
        const applicantUserId = applicant._id; // This is the applicant's user ID
        console.log("🟡 Fetching settings for applicant ID:", applicantUserId);

        const settingsData = await getSettingsByUserId(applicantUserId)(
          dispatch
        );
        setApplicantSettings(settingsData);

        const applicantPrivacyMode = settingsData?.privacyMode || "selective";

        console.log("🟡 Applicant Privacy Mode:", applicantPrivacyMode);

        // 3. Determine privacy mode and industry visibility
        if (applicantPrivacyMode === "public") {
          // Public mode: always show industry
          console.log("🟢 Public mode - showing industry");
          setShowIndustry(true);
        } else if (applicantPrivacyMode === "private") {
          // Private mode: never show industry
          console.log("🔴 Private mode - hiding industry");
          setShowIndustry(false);
        } else if (applicantPrivacyMode === "selective") {
          // Selective mode: show only if logged-in user is company verified
          let authUser = currentUser;

          // If not in Redux, fetch it
          if (!authUser) {
            const authRes = await dispatch(getAuthUser());
            authUser = authRes || null;
            setLoggedInUser(authUser);
          }

          console.log(
            "🟡 Selective mode - checking company verification:",
            authUser?.companyVerified
          );

          // Check if logged-in user is company verified
          if (authUser && authUser.companyVerified === true) {
            console.log("🟢 Company verified - showing industry");
            setShowIndustry(true);
          } else {
            console.log("🔴 Company not verified - hiding industry");
            setShowIndustry(false);
          }
        }
      } catch (error) {
        console.error("Error fetching application data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, currentUser]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-5">Loading...</div>
      </Layout>
    );
  }

  if (!applicationData) {
    return (
      <Layout>
        <div className="text-center py-5 text-danger">
          No application details found.
        </div>
      </Layout>
    );
  }

  const {
    name,
    email,
    mobile,
    address,
    city,
    state,
    country,
    pincode,
    profilePhotoUrl,
    status,
    companyVerified,
    dateOfBirth,
    gender,
    workStatus,
    memberSince,
    skills,
    preferences,
    education,
    experience,
    resume,
    industry,
  } = applicationData;

  const candidate = {
    name: name || "N/A",
    email: email || "N/A",
    phone: mobile || "N/A",
    address: `${city || ""}, ${state || ""}, ${country || ""}, ${
      pincode || ""
    }`,
    profileImage: profilePhotoUrl || "/default-profile.png",
    status: status ? "Active" : "Inactive",
    verified: companyVerified || false,
    dob: dateOfBirth ? moment(dateOfBirth).format("DD MMM YYYY") : "N/A",
    gender: gender || "N/A",
    workStatus: workStatus || "N/A",
    memberSince: memberSince
      ? moment(memberSince).format("DD MMM YYYY")
      : "N/A",
  };

  return (
    <Layout>
      <div className="appView-container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="appView-card">
              {/* Header Section */}
              <div className="appView-header">
                <div className="row align-items-center">
                  <div className="col-md-2 text-center">
                    <img
                      src={candidate.profileImage}
                      alt="Profile Photo"
                      className="appView-profile-img"
                    />
                  </div>
                  <div className="col-md-8">
                    <h1 className="mb-1">{candidate.name}</h1>
                    <p className="mb-1 text-white">
                      <FaEnvelope className="me-2" />
                      {candidate.email}
                    </p>
                    <p className="mb-1 text-white">
                      <FaPhone className="me-2" />
                      {candidate.phone}
                    </p>
                    <p className="mb-0 text-white">
                      <FaMapMarkerAlt className="me-2" />
                      {candidate.address}
                    </p>
                  </div>
                  <div className="col-md-2 text-end">
                    <span
                      className={`appView-status-badge ${
                        candidate.status === "Active"
                          ? "appView-status-active"
                          : "appView-status-inactive"
                      }`}
                    >
                      {candidate.status}
                    </span>
                    <p className="mt-2 mb-0">
                      <span
                        className={
                          candidate.verified
                            ? "appView-verified"
                            : "appView-not-verified"
                        }
                      >
                        {candidate.verified ? "Verified" : "Not Verified"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="appView-section">
                <h3 className="appView-section-title">
                  <FaUser /> Personal Information
                </h3>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong>Date of Birth:</strong> {candidate.dob}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Gender:</strong> {candidate.gender}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Work Status:</strong> {candidate.workStatus}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Member Since:</strong> {candidate.memberSince}
                  </div>
                </div>
              </div>

              {/* Industry - Show based on privacy settings */}
              {showIndustry && industry?.length > 0 && (
                <div className="appView-section">
                  <h3 className="appView-section-title">
                    <FaIndustry /> Industry
                  </h3>

                  <div className="row">
                    {industry.map((ind, index) => (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3"
                      >
                        <div className="appView-industry-item d-flex align-items-center p-2">
                          <img
                            src={ind.image || "/default-industry.png"}
                            alt={ind.title}
                            className="appView-industry-img"
                          />

                          <div className="ms-3 d-flex align-items-center">
                            <h5 className="mb-0">{ind.title}</h5>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills?.length > 0 && (
                <div className="appView-section">
                  <h3 className="appView-section-title">
                    <FaTools /> Skills
                  </h3>
                  <div>
                    {skills.map((skill, index) => (
                      <span key={index} className="appView-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Preferences */}
{preferences && (
  <div className="appView-section">
    <h3 className="appView-section-title">
      <FaBriefcase /> Job Preferences
    </h3>

    <div className="row g-3">

      {/* Salary Range */}
      <div className="col-md-6">
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            border: "1px solid #e3e6ea",
            minHeight: "120px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <strong style={{ fontSize: "1rem", marginBottom: "8px" }}>
            Salary Range
          </strong>
          <span style={{ fontSize: "1.2rem", color: "#6c757d" }}>
            {preferences.salary_range?.range || "N/A"}
          </span>
        </div>
      </div>

      {/* Preferred Locations */}
      <div className="col-md-6">
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            border: "1px solid #e3e6ea",
            minHeight: "120px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <strong style={{ fontSize: "1rem", marginBottom: "8px" }}>
            Preferred Locations
          </strong>

          {preferences.preffered_locations?.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "2px",
              }}
            >
              {preferences.preffered_locations.map((loc, index) => (
                <span
                  key={index}
                  style={{
                    background: "#eef3ff",
                    color: "#1a3fa8",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    lineHeight: "1.2",
                    display: "inline-block",
                  }}
                >
                  {loc}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>N/A</span>
          )}
        </div>
      </div>

    </div>
  </div>
)}


              {/* Education */}
              {education?.length > 0 && (
                <div className="appView-section">
                  <h3 className="appView-section-title">
                    <FaGraduationCap /> Education
                  </h3>
                  {education.map((edu, index) => (
                    <div key={index} className="appView-education-item">
                      <h5>{edu.degree}</h5>
                      <p className="mb-1">{edu.institution}</p>
                      <p className="text-muted">
                        Graduated: {edu.graduationYear}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience */}
              {experience?.length > 0 && (
                <div className="appView-section">
                  <h3 className="appView-section-title">
                    <FaSuitcase /> Work Experience
                  </h3>
                  {experience.map((exp, index) => {
                    const isCurrent = !exp.endDate;
                    return (
                      <div
                        key={index}
                        className={`appView-experience-item ${
                          isCurrent ? "appView-current-job" : ""
                        }`}
                      >
                        <h5>{exp.position}</h5>
                        <p className="mb-1">{exp.companyName}</p>
                        <p className="mb-1 text-muted">
                          {moment(exp.startDate).format("MMM YYYY")} -{" "}
                          {isCurrent
                            ? "Present"
                            : moment(exp.endDate).format("MMM YYYY")}
                        </p>
                        <p className="mb-0">{exp.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Documents */}
              {resume && (
                <div className="appView-section">
                  <h3 className="appView-section-title">
                    <FaFilePdf /> Documents
                  </h3>
                  <div className="d-flex align-items-center">
                    <FaFilePdf className="text-danger me-3 fs-3" />
                    <div>
                      <h5 className="mb-0">Resume</h5>
                      <p className="mb-0 text-muted">{resume}</p>
                    </div>
                    <a
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn appView-btn-outline ms-auto"
                    >
                      <FaDownload className="me-2" />
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Styles */}
        <style jsx>{`
          .appView-container {
            background-color: #f5f7ff;
            min-height: 100vh;
            padding: 20px 0;
          }
          .appView-card {
            border-radius: 15px;
            border: none;
            box-shadow: 0 10px 30px rgba(78, 84, 200, 0.1);
            overflow: hidden;
            background: white;
          }
          .appView-header {
            background: linear-gradient(135deg, #4e54c8, #8f94fb);
            color: white;
            padding: 25px;
          }
          .appView-profile-img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 5px solid rgba(255, 255, 255, 0.3);
            object-fit: cover;
          }
          .appView-section {
            padding: 25px;
            border-bottom: 1px solid #eee;
          }
          .appView-section:last-child {
            border-bottom: none;
          }
          .appView-section-title {
            color: #4e54c8;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 22px;
          }
          .appView-tag {
            background-color: #f8f9fa;
            border-radius: 20px;
            padding: 5px 15px;
            margin: 5px;
            display: inline-block;
          }
          .appView-status-badge {
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: 500;
          }
          .appView-status-active {
            background-color: #28a745;
            color: white;
          }
          .appView-status-inactive {
            background-color: #6c757d;
            color: white;
          }
          .appView-verified {
            color: #28a745;
            font-weight: 500;
          }
          .appView-not-verified {
            color: #ff6b6b;
            font-weight: 500;
          }
          .appView-experience-item,
          .appView-education-item {
            padding: 15px;
            border-left: 3px solid #4e54c8;
            background-color: #f8f9fa;
            border-radius: 0 8px 8px 0;
            margin-bottom: 15px;
          }
          .appView-current-job {
            border-left-color: #ff6b6b;
          }
          .appView-industry-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 10px;
            border: 2px solid #e9ecef;
            transition: all 0.3s ease;
          }
          .appView-industry-item:hover {
            border-color: #4e54c8;
            box-shadow: 0 4px 12px rgba(78, 84, 200, 0.15);
          }
          .appView-industry-img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
          }
          .appView-btn-primary {
            background-color: #4e54c8;
            border: none;
            padding: 10px 25px;
            border-radius: 30px;
            font-weight: 500;
            color: white;
          }
          .appView-btn-primary:hover {
            background-color: #3d43a5;
          }
          .appView-btn-outline {
            border: 2px solid #4e54c8;
            color: #4e54c8;
            background: transparent;
            padding: 10px 25px;
            border-radius: 30px;
            font-weight: 500;
          }
          .appView-btn-outline:hover {
            background-color: #4e54c8;
            color: white;
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default ApplicationDetails;
