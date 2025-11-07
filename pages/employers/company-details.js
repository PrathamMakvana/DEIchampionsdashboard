import React, { useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getuser } from "@/api/auth";
import { getJobs } from "@/api/job";

const CompanyProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { jobs, loading } = useSelector((state) => state.job);
  console.log("🚀jobs --->", jobs);

  useEffect(() => {
    dispatch(getuser());
    dispatch(getJobs());
  }, []);

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
                <p className="jobposter-company-tagline">
                  {user?.tagline ||
                    "Building inclusive workplaces for the future"}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="jobposter-stats-grid">
              <div className="jobposter-stat-card">
                <div className="jobposter-stat-value">
                  {user?.companySize || "150+"}
                </div>
                <div className="jobposter-stat-label">Employees</div>
              </div>

              <div className="jobposter-stat-card">
                <div className="jobposter-stat-value">12</div>
                <div className="jobposter-stat-label">Countries</div>
              </div>

              <div className="jobposter-stat-card">
                <div className="jobposter-stat-value">2010</div>
                <div className="jobposter-stat-label">Founded</div>
              </div>

              <div className="jobposter-stat-card">
                <div className="jobposter-stat-value">25+</div>
                <div className="jobposter-stat-label">Open Positions</div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="jobposter-content-grid">
              {/* Left Column - Main Content */}
              <div className="jobposter-main-content">
                <h2 className="jobposter-section-title">About Us</h2>
                <p className="company-description">
                  {user?.companyDescription ||
                    `Dei Champions is a leading tech company dedicated to`}
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
                          <div className="job-meta-item">
                            <i className="bi bi-briefcase"></i>
                            <span>{job.jobType?.name || "N/A"}</span>
                          </div>
                          <div className="job-meta-item">
                            <i className="bi bi-geo-alt"></i>
                            <span>
                              {job.city}, {job.state}
                            </span>
                          </div>
                          {/* <div className="job-meta-item">
                            <i className="bi bi-cash"></i>
                            <span>
                              {" "}
                              {job?.salary ||
                                job?.salary?.range ||
                                "Not specified"}
                            </span>
                          </div> */}
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
                            class="text-primary text-decoration-none d-flex align-items-center gap-1"
                            style={{
                              padding: "5px 15px",
                              border: "1px solid ",
                              borderRadius: "30px",
                              width: "fit-content",
                            }}
                          >
                            <i class="bi bi-eye"></i> View Job Details
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No job openings available.</p>
                  )}

                  <div className="text-center mt-4">
                    <button className="btn btn-primary">
                      <i className="bi bi-search me-2"></i>View All{" "}
                      {jobs?.length || 0} Positions
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="jobposter-sidebar">
                <h2 className="jobposter-section-title">Company Details</h2>

                <div className="jobposter-detail-item">
                  <div className="jobposter-detail-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div className="jobposter-detail-content">
                    <h4>Headquarters</h4>
                    <p>
                      {user?.city || "San Francisco"},{" "}
                      {user?.state || "California"}
                      <br />
                      {user?.address || "123 Innovation Way, Suite 500"}
                    </p>
                  </div>
                </div>

                <div className="jobposter-detail-item">
                  <div className="jobposter-detail-icon">
                    <i className="bi bi-globe"></i>
                  </div>
                  <div className="jobposter-detail-content">
                    <h4>Website</h4>
                    <p>
                      {user?.companyWebsite ? (
                        <a
                          href={user.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {user.companyWebsite}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>

                <div className="jobposter-detail-item">
                  <div className="jobposter-detail-icon">
                    <i className="bi bi-building"></i>
                  </div>
                  <div className="jobposter-detail-content">
                    <h4>Company Size</h4>
                    <p>{user?.companySize || "150+ employees"}</p>
                  </div>
                </div>

                <div className="jobposter-detail-item">
                  <div className="jobposter-detail-icon">
                    <i className="bi bi-calendar-event"></i>
                  </div>
                  <div className="jobposter-detail-content">
                    <h4>Member Since</h4>
                    <p>
                      {user?.memberSince
                        ? new Date(user.memberSince).getFullYear()
                        : "2010"}
                    </p>
                  </div>
                </div>

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
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-envelope me-2"></i>Contact Us
                  </button>
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
