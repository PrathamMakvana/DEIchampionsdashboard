import React, { useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getuser, getuserProfileCompletionData } from "@/api/auth";
import { getJobs } from "@/api/job";

const CompanyProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { jobs, loading } = useSelector((state) => state.job);
  console.log("🚀jobs --->", jobs);
  const profileCompletionData = useSelector(
    (state) => state.auth.profileCompletion
  );

  useEffect(() => {
    dispatch(getuser());
    dispatch(getJobs());
    dispatch(getuserProfileCompletionData());
  }, []);

  // Helper function to get year from date
  const getYear = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).getFullYear();
  };

  return (
    <>
      <Layout>
        <style jsx>{`
          .jobposter-banner {
            height: 250px;
            background-size: cover;
            background-position: center;
            border-radius: 8px;
            position: relative;
            margin-bottom: -25px;
          }

          .jobposter-profile-container {
            position: relative;
            padding: 0 20px;
          }

          .jobposter-logo-container {
            /* position: absolute; */
            /* top: -75px;
            left: 30px; */
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .jobposter-logo {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3a8dde 0%, #6c48cc 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 60px;
            font-weight: bold;
            border: 5px solid white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .jobposter-company-header {
            margin-bottom: 10px;
          }

          .jobposter-company-name {
            font-size: 32px;
            font-weight: 700;
            margin: 0;
            color: #2d3748;
          }

          .jobposter-company-tagline {
            font-size: 18px;
            color: #4a5568;
            margin: 5px 0 15px;
          }

          .jobposter-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }

          .jobposter-stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            text-align: center;
          }

          .jobposter-stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #3a8dde;
            margin-bottom: 5px;
          }

          .jobposter-stat-label {
            color: #718096;
            font-size: 14px;
          }

          .jobposter-content-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            margin-top: 30px;
          }

          .jobposter-main-content {
            background: white;
            border-radius: 8px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          }

          .jobposter-sidebar {
            background: white;
            border-radius: 8px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          }

          .jobposter-section-title {
            font-size: 22px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
          }

          .jobposter-detail-item {
            display: flex;
            margin-bottom: 15px;
          }

          .jobposter-detail-icon {
            width: 24px;
            color: #3a8dde;
            margin-right: 10px;
            margin-top: 3px;
          }

          .jobposter-detail-content h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }

          .jobposter-detail-content p {
            margin: 5px 0 0;
            color: #4a5568;
          }

          .jobposter-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }

          .jobposter-gallery-item {
            height: 150px;
            border-radius: 8px;
            overflow: hidden;
          }

          .jobposter-gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .jobposter-gallery-item:hover img {
            transform: scale(1.05);
          }

          .jobposter-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 15px 0;
          }

          .jobposter-tag {
            background: #e9f2fe;
            color: #3a8dde;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 14px;
          }

          @media (max-width: 992px) {
            .jobposter-content-grid {
              grid-template-columns: 1fr;
            }

            .jobposter-logo-container {
              flex-direction: column;
              align-items: center;
              text-align: center;
              /* left: 50%; */
              /* transform: translateX(-50%); */
            }

            .jobposter-stats-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 576px) {
            .jobposter-stats-grid {
              grid-template-columns: 1fr;
            }

            .jobposter-logo {
              width: 120px;
              height: 120px;
              font-size: 40px;
            }

            .jobposter-banner {
              height: 180px;
              margin-bottom: 80px;
            }
          }
        `}</style>

        <style jsx>{`
          /* Company Profile Completion Progress Styles */
          .com-profile-comp-progress-container {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 20px;
            color: #495057;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }

          .com-profile-comp-progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .com-profile-comp-progress-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin: 0;
            color: #495057;
          }

          .com-profile-comp-progress-percentage {
            font-size: 1.5rem;
            font-weight: bold;
            background: #e9ecef;
            color: #495057;
            padding: 5px 12px;
            border-radius: 20px;
          }

          .com-profile-comp-progress-bar {
            height: 8px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 10px;
          }

          .com-profile-comp-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #007bff, #3a8dde);
            border-radius: 10px;
            transition: width 0.5s ease-in-out;
            position: relative;
            overflow: hidden;
          }

          .com-profile-comp-progress-fill::after {
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
            animation: com-profile-comp-shimmer 2s infinite;
          }

          @keyframes com-profile-comp-shimmer {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }

          .com-profile-comp-progress-text {
            font-size: 0.9rem;
            color: #6c757d;
            margin: 0;
          }

          /* Missing Fields Styles */
          .com-profile-comp-missing-fields {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
          }

          .com-profile-comp-missing-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }

          .com-profile-comp-missing-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #856404;
            margin: 0;
          }

          .com-profile-comp-missing-text {
            color: #856404;
            margin-bottom: 12px;
            font-size: 0.9rem;
          }

          .com-profile-comp-missing-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .com-profile-comp-missing-item {
            background: #fff;
            border: 1px solid #ffeaa7;
            border-radius: 16px;
            padding: 4px 12px;
            font-size: 0.8rem;
            color: #856404;
            font-weight: 500;
          }

          /* Verification Section Styles */
          .com-profile-comp-verification-section {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 20px;
          }

          .com-profile-comp-verification-header {
            margin-bottom: 15px;
          }

          .com-profile-comp-verification-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #495057;
            margin: 0;
          }

          .com-profile-comp-verification-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }

          .com-profile-comp-verification-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e9ecef;
          }

          .com-profile-comp-verification-icon {
            width: 40px;
            height: 40px;
            background: #e9f2fe;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #3a8dde;
            font-size: 1.1rem;
          }

          .com-profile-comp-verification-content {
            flex: 1;
          }

          .com-profile-comp-verification-label {
            display: block;
            font-size: 0.9rem;
            color: #6c757d;
            margin-bottom: 4px;
          }

          .com-profile-comp-verification-status {
            font-size: 0.9rem;
            font-weight: 500;
          }

          .com-profile-comp-verified {
            color: #28a745;
          }

          .com-profile-comp-not-verified {
            color: #dc3545;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .com-profile-comp-progress-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
            }

            .com-profile-comp-progress-percentage {
              align-self: flex-end;
            }

            .com-profile-comp-missing-list {
              gap: 6px;
            }

            .com-profile-comp-missing-item {
              font-size: 0.75rem;
              padding: 3px 10px;
            }

            .com-profile-comp-verification-grid {
              grid-template-columns: 1fr;
            }

            .com-profile-comp-verification-item {
              padding: 10px;
            }
          }

          @media (max-width: 576px) {
            .com-profile-comp-progress-container,
            .com-profile-comp-missing-fields,
            .com-profile-comp-verification-section {
              padding: 15px;
            }

            .com-profile-comp-progress-title {
              font-size: 1.1rem;
            }

            .com-profile-comp-progress-percentage {
              font-size: 1.3rem;
            }
          }
        `}</style>

        <div className="d-flex justify-content-end align-items-center mb-4">
          <button
            className="btn btn-sm btn-outline-secondary"
            title="Edit"
            onClick={() => router.push("/employers/update-profile")}
          >
            <i className="bi bi-pencil"></i>
          </button>
        </div>

        <div className="container">
          {profileCompletionData && (
            <div className="com-profile-comp-progress-container mb-4">
              <div className="com-profile-comp-progress-header">
                <h4 className="com-profile-comp-progress-title">
                  <i className="bi bi-graph-up me-2"></i>
                  Profile Completion
                </h4>
                <span className="com-profile-comp-progress-percentage">
                  {profileCompletionData.profileCompletion}%
                </span>
              </div>
              <div className="com-profile-comp-progress-bar">
                <div
                  className="com-profile-comp-progress-fill"
                  style={{
                    width: `${profileCompletionData.profileCompletion}%`,
                  }}
                ></div>
              </div>
              <p className="com-profile-comp-progress-text">
                Complete your company profile to attract better candidates and
                build trust
              </p>
            </div>
          )}

          {/* Missing Fields Alert */}
          {profileCompletionData?.missingFields &&
            profileCompletionData.missingFields.length > 0 && (
              <div className="com-profile-comp-missing-fields">
                <div className="com-profile-comp-missing-header">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <h5 className="com-profile-comp-missing-title">
                    Complete Your Company Profile
                  </h5>
                </div>
                <p className="com-profile-comp-missing-text">
                  Add the following information to enhance your company profile:
                </p>
                <div className="com-profile-comp-missing-list">
                  {profileCompletionData.missingFields.map((field, index) => (
                    <span key={index} className="com-profile-comp-missing-item">
                      {field.displayName}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>

        <div className="container">
          {/* Banner */}
          <div
            className="jobposter-banner"
            style={{
              backgroundImage: user?.bannerPhotoUrl
                ? `url(${user.bannerPhotoUrl})`
                : "linear-gradient(135deg, #3a8dde 0%, #6c48cc 100%)",
            }}
          ></div>

          <div className="jobposter-profile-container">
            {/* Company Logo and Basic Info */}
            <div className="jobposter-logo-container">
              {user?.profilePhotoUrl ? (
                <img
                  src={user.profilePhotoUrl}
                  alt={user.companyName || "Company Logo"}
                  className="jobposter-logo"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="jobposter-logo">
                  {user?.companyName ? user.companyName.charAt(0) : "DC"}
                </div>
              )}

              <div className="jobposter-company-header">
                <h1 className="jobposter-company-name">
                  {user?.companyName || "Dei Champions"}
                </h1>
                {user?.tagline && (
                  <p className="jobposter-company-tagline">{user.tagline}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="jobposter-stats-grid">
              {user?.companySize && (
                <div className="jobposter-stat-card">
                  <div className="jobposter-stat-value">{user.companySize}</div>
                  <div className="jobposter-stat-label">Company Size</div>
                </div>
              )}

              {Array.isArray(jobs) && (
                <div className="jobposter-stat-card">
                  <div className="jobposter-stat-value">{jobs.length}</div>
                  <div className="jobposter-stat-label">Active Jobs</div>
                </div>
              )}

              {user?.memberSince && (
                <div className="jobposter-stat-card">
                  <div className="jobposter-stat-value">
                    {getYear(user.memberSince)}
                  </div>
                  <div className="jobposter-stat-label">Member Since</div>
                </div>
              )}

              {user?.companyType && (
                <div className="jobposter-stat-card">
                  <div
                    className="jobposter-stat-value"
                    style={{ fontSize: "20px" }}
                  >
                    {user.companyType}
                  </div>
                  <div className="jobposter-stat-label">Company Type</div>
                </div>
              )}
            </div>

            {/* Main Content Grid */}
            <div className="jobposter-content-grid">
              {/* Left Column - Main Content */}
              <div className="jobposter-main-content">
                <h2 className="jobposter-section-title">About Us</h2>
                <p className="company-description">
                  {user?.companyDescription ||
                    "No company description available."}
                </p>

                {user?.people && (
                  <>
                    <h4 className="mt-4" style={{ fontSize: "18px" }}>
                      Our People
                    </h4>
                    <p>{user.people}</p>
                  </>
                )}

                {user?.recruitments && (
                  <>
                    <h4 className="mt-4" style={{ fontSize: "18px" }}>
                      Recruitment Approach
                    </h4>
                    <p>{user.recruitments}</p>
                  </>
                )}

                {/* Department Information */}
                {user?.department && user.department.length > 0 && (
                  <>
                    <h2 className="jobposter-section-title mt-5">
                      Departments
                    </h2>
                    <div className="jobposter-tags">
                      {user.department.map((dept, index) => (
                        <span key={index} className="jobposter-tag">
                          {dept.name}
                          {dept.focus && ` - ${dept.focus}`}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {/* Company Gallery */}
                {user?.companyGallery && user.companyGallery.length > 0 && (
                  <>
                    <h2 className="jobposter-section-title mt-5">
                      Company Gallery
                    </h2>
                    <div className="jobposter-gallery">
                      {user.companyGallery.map((image, index) => (
                        <div key={index} className="jobposter-gallery-item">
                          <img
                            src={image.imageUrl}
                            alt={image.altText || "Company image"}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Job Openings */}
                <div className="job-openings mt-5">
                  <h2 className="jobposter-section-title">
                    Current Job Openings
                  </h2>

                  {Array.isArray(jobs) && jobs.length > 0 ? (
                    jobs.map((job) => (
                      <div className="job-card" key={job._id}>
                        <h4 className="job-title">{job.jobTitle}</h4>

                        <div className="job-meta">
                          {job.jobType?.name && (
                            <div className="job-meta-item">
                              <i className="bi bi-briefcase"></i>
                              <span>{job.jobType.name}</span>
                            </div>
                          )}
                          {(job.city || job.state) && (
                            <div className="job-meta-item">
                              <i className="bi bi-geo-alt"></i>
                              <span>
                                {job.city}
                                {job.city && job.state && ", "}
                                {job.state}
                              </span>
                            </div>
                          )}
                        </div>

                        <p
                          className="job-description line-clamp-3"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: "1.5em",
                            maxHeight: "4.5em",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: job.jobDescription,
                          }}
                        />

                        <div className="mb-3">
                          {job.tags && job.tags.length > 0 ? (
                            job.tags.map((tag, idx) => (
                              <span className="skill-badge" key={idx}>
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="skill-badge">No Tags</span>
                          )}
                        </div>
                        <div className="d-flex justify-content-end">
                          <a
                            href={`/employers/manage-job-details?id=${job._id}`}
                            className="text-primary text-decoration-none d-flex align-items-center gap-1"
                            style={{
                              padding: "5px 15px",
                              border: "1px solid ",
                              borderRadius: "30px",
                              width: "fit-content",
                            }}
                          >
                            <i className="bi bi-eye"></i> View Job Details
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No job openings available.</p>
                  )}

                  {Array.isArray(jobs) && jobs.length > 0 && (
                    <div className="text-center mt-4">
                      <button className="btn btn-primary">
                        <i className="bi bi-search me-2"></i>View All{" "}
                        {jobs.length} Positions
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="jobposter-sidebar">
                <h2 className="jobposter-section-title">Company Details</h2>

                {(user?.city || user?.state || user?.address) && (
                  <div className="jobposter-detail-item">
                    <div className="jobposter-detail-icon">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div className="jobposter-detail-content">
                      <h4>Location</h4>
                      <p>
                        {user?.address && (
                          <>
                            {user.address}
                            <br />
                          </>
                        )}
                        {user?.city && user.city}
                        {user?.city && user?.state && ", "}
                        {user?.state && user.state}
                        {user?.pincode && (
                          <>
                            <br />
                            Pincode: {user.pincode}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {user?.companyWebsite && (
                  <div className="jobposter-detail-item">
                    <div className="jobposter-detail-icon">
                      <i className="bi bi-globe"></i>
                    </div>
                    <div className="jobposter-detail-content">
                      <h4>Website</h4>
                      <p>
                        <a
                          href={user.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {user.companyWebsite}
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {user?.email && (
                  <div className="jobposter-detail-item">
                    <div className="jobposter-detail-icon">
                      <i className="bi bi-envelope"></i>
                    </div>
                    <div className="jobposter-detail-content">
                      <h4>Email</h4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 5,
                        }}
                      >
                        <p>{user.email}</p>
                        {user.emailVerified && (
                          <span
                            className="verified-badge"
                            title="Email Verified"
                          >
                            <i className="bi bi-patch-check-fill text-primary"></i>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {user?.mobile && (
                  <div className="jobposter-detail-item">
                    <div className="jobposter-detail-icon">
                      <i className="bi bi-telephone"></i>
                    </div>
                    <div className="jobposter-detail-content">
                      <h4>Phone</h4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 5,
                        }}
                      >
                        <p>{user.mobile}</p>
                        {user.mobileVerified && (
                          <span
                            className="verified-badge"
                            title="Email Verified"
                          >
                            <i className="bi bi-patch-check-fill text-primary"></i>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {user?.companyAccountType && (
                  <div className="jobposter-detail-item">
                    <div className="jobposter-detail-icon">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="jobposter-detail-content">
                      <h4>Account Type</h4>
                      <p style={{ textTransform: "capitalize" }}>
                        {user.companyAccountType}
                      </p>
                    </div>
                  </div>
                )}

                {user?.gstNumber && (
                  <div className="jobposter-detail-item">
                    <div className="jobposter-detail-icon">
                      <i className="bi bi-file-text"></i>
                    </div>
                    <div className="jobposter-detail-content">
                      <h4>GST Number</h4>
                      <p>{user.gstNumber}</p>
                    </div>
                  </div>
                )}

                {user?.hiringFor && (
                  <div className="jobposter-detail-item">
                    <div className="jobposter-detail-icon">
                      <i className="bi bi-people"></i>
                    </div>
                    <div className="jobposter-detail-content">
                      <h4>Hiring For</h4>
                      <p style={{ textTransform: "capitalize" }}>
                        {user.hiringFor}
                      </p>
                    </div>
                  </div>
                )}

                {/* Certified Tags */}
                {user?.certifiedTags && user.certifiedTags.length > 0 && (
                  <>
                    <h3 className="mt-4 mb-3 medal-badges-title">
                      Certifications
                    </h3>
                    <div className="medal-badges-grid">
                      {user.certifiedTags.map((tag, index) => {
                        const getMedalColor = (name) => {
                          if (name?.toLowerCase().includes("silver"))
                            return "medal-silver";
                          if (name?.toLowerCase().includes("gold"))
                            return "medal-gold";
                          if (name?.toLowerCase().includes("bronze"))
                            return "medal-bronze";
                          if (name?.toLowerCase().includes("platinum"))
                            return "medal-platinum";
                          if (
                            name?.toLowerCase().includes("green") ||
                            name?.toLowerCase().includes("eco")
                          )
                            return "medal-green";
                          return "medal-blue";
                        };

                        const medalColor = getMedalColor(tag.name);

                        return (
                          <div
                            key={index}
                            className={`medal-certification-badge ${medalColor}`}
                          >
                            <div className="medal-badge-image">
                              {tag.image ? (
                                <img src={tag.image} alt={tag.name} />
                              ) : (
                                <i className="fas fa-award medal-default-icon"></i>
                              )}
                            </div>
                            <span className="medal-badge-name">{tag.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="d-grid gap-2 mt-4">
                  {user?.companyWebsite && (
                    <a
                      href={user.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <i className="bi bi-globe me-2"></i>
                      Visit Our Website
                    </a>
                  )}
                  {user?.email && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        (window.location.href = `mailto:${user.email}`)
                      }
                    >
                      <i className="bi bi-envelope me-2"></i>Contact Us
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CompanyProfile;
