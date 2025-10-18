import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import {
  getJob,
  unapplyJob,
  saveJob,
  unsaveJob,
  getMyApplications,
  getMySavedJobs,
  applyJob,
} from "@/api/job";
import Swal from "sweetalert2";

const JobDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const {
    currentJob: job,
    loading,
    myApplications,
    mySavedJobs,
  } = useSelector((state) => state.job);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;

    dispatch(getJob(id));

    dispatch(getMyApplications());
    dispatch(getMySavedJobs());
  }, [id, dispatch]);

  if (loading || !job) {
    return (
      <div
        className="container py-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const isApplied = myApplications?.some((applied) => applied._id === job?._id);
  const isSaved = mySavedJobs?.some((saved) => saved._id === job?._id);

  const {
    jobTitle,
    jobDescription,
    salary,
    category,
    jobType,
    postedBy,
    status,
    area,
    city,
    state,
    country,
  } = job;

  return (
    <>
      <style jsx global>{`
        :root {
          --primary-color: #3b82f6;
          --secondary-color: #60a5fa;
          --accent-color: #22c55e;
          --light-color: #f8fafc;
          --dark-color: #1e293b;
          --gray-color: #64748b;
          --border-color: #e2e8f0;
        }

        body {
          background-color: #f1f5f9;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
          color: var(--dark-color);
          line-height: 1.6;
        }

        /* Header/Navbar */
        .navbar-brand {
          font-weight: 700;
          color: var(--primary-color) !important;
          font-size: 1.5rem;
        }

        .navbar {
          background: white;
          border-bottom: 1px solid var(--border-color);
          padding: 1rem 0;
        }

        .nav-link {
          color: var(--gray-color) !important;
          font-weight: 500;
          padding: 0.5rem 1rem !important;
          transition: all 0.2s ease;
          border-radius: 6px;
        }

        .nav-link:hover {
          color: var(--primary-color) !important;
          background-color: #eff6ff;
        }

        .nav-link.active {
          color: var(--primary-color) !important;
          background-color: #eff6ff;
          font-weight: 600;
        }

        /* Job Details Card */
        .job-card {
          background: white;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .job-header {
          background: #f8faff;
          color: var(--dark-color);
          padding: 2.5rem;
          border-bottom: 2px solid #00000014;
        }

        .job-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          line-height: 1.2;
          color: var(--dark-color);
          text-transform: uppercase;
        }

        .company-name {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--gray-color);
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-top: 1.5rem;
          color: var(--gray-color);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .meta-item i {
          opacity: 0.8;
        }

        .job-body {
          padding: 3rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--dark-color);
          position: relative;
        }

        .job-description {
          line-height: 1.7;
          margin-bottom: 2rem;
          color: var(--gray-color);
          font-size: 1.05rem;
          white-space: pre-wrap;
          text-align: justify;
        }

        .requirements-list {
          list-style-type: none;
          padding: 0;
        }

        .requirements-list li {
          padding: 0.7rem 0;
          padding-left: 2rem;
          position: relative;
          color: var(--gray-color);
          line-height: 1.6;
        }

        .requirements-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 1.2rem;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-color);
        }

        /* Action Buttons */
        .btn-apply {
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--secondary-color)
          );
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 1.05rem;
          cursor: pointer;
        }

        .btn-apply:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
          color: white;
        }

        .btn-bookmark {
          background: white;
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
          padding: 1rem 2rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 1.05rem;
          cursor: pointer;
        }

        .btn-bookmark:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }

        .btn-bookmark.bookmarked {
          background: var(--primary-color);
          color: white;
        }

        /* Salary Badge */
        .salary-badge {
          background: linear-gradient(135deg, var(--accent-color), #16a34a);
          color: white;
          font-weight: 700;
          padding: 0.7rem 1.5rem;
          border-radius: 25px;
          font-size: 1.2rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Info Box */
        .info-box {
          background: white;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          padding: 2rem;
          margin-bottom: 1.5rem;
        }

        .info-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--dark-color);
        }

        .similar-job-item {
          padding: 1rem;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .similar-job-item:hover {
          background-color: var(--light-color);
        }

        .process-step {
          padding: 1rem 0;
          border-left: 2px solid var(--border-color);
          margin-left: 1rem;
          padding-left: 2rem;
          position: relative;
        }

        .process-step::before {
          content: "";
          position: absolute;
          left: -6px;
          top: 1.5rem;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--primary-color);
        }

        .process-step:last-child {
          border-left: none;
        }

        /* Company Logo */
        .company-logo-wrapper {
          background: white;
          padding: 10px;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .company-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        .company-logo-icon {
          font-size: 2rem;
          color: var(--primary-color);
        }

        /* Gallery Images */
        .gallery-image {
          width: 48%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .gallery-image:hover {
          transform: scale(1.05);
        }

        /* Footer */
        .footer {
          background: var(--dark-color);
          color: white;
          padding: 4rem 0 2rem;
          margin-top: 5rem;
        }

        .footer-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 0.8rem;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .footer-links a:hover {
          color: white;
        }
        .text-justify {
          text-align: justify;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .job-header {
            padding: 2rem;
          }

          .job-title {
            font-size: 2rem;
          }

          .job-body {
            padding: 2rem;
          }

          .job-meta {
            gap: 1rem;
          }

          .btn-container {
            flex-direction: column;
            gap: 1rem;
          }

          .info-box {
            padding: 1.5rem;
          }

          .gallery-image {
            width: 100%;
          }

          .job-description {
            font-size: 15px;
            color: #374151; /* neutral gray for readability */
            line-height: 1.8;
          }

          .job-description h3 {
            font-size: 18px;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .job-description p {
            margin-bottom: 0.75rem;
          }

          .job-description ul {
            padding-left: 1.5rem;
            margin-bottom: 1rem;
          }

          .job-description li {
            margin-bottom: 0.35rem;
            list-style-type: "✅ ";
          }

          .job-description strong {
            font-weight: 600;
          }

          .section-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #1f2937;
          }
        }
      `}</style>

      <Layout>
        <div className="container py-5">
          <div className="row">
            {/* Main Job Details */}
            <div className="col-lg-8">
              <div className="job-card mb-4">
                <div className="job-header">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h1 className="job-title">{jobTitle}</h1>
                      <p className="company-name">
                        {postedBy?.companyName || "Company"}
                      </p>
                      <div className="salary-badge">
                        <i className="bi bi-currency-dollar"></i>{" "}
                        {salary || "Competitive"}
                      </div>
                      <div className="job-meta">
                        <div className="meta-item">
                          <i className="bi bi-geo-alt"></i>
                          <span>{`${city || ""}, ${state || ""}, ${
                            country || ""
                          }`}</span>
                        </div>
                        <div className="meta-item">
                          <i className="bi bi-briefcase"></i>
                          <span>{jobType?.name || "Full Time"}</span>
                        </div>
                        <div className="meta-item">
                          <i className="bi bi-card-checklist"></i>
                          <span>{category?.title || "General"}</span>
                        </div>
                        <div className="meta-item">
                          <i className="bi bi-info-circle"></i>
                          <span>{status || "Active"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="company-logo-wrapper">
                      {postedBy?.profilePhotoUrl ? (
                        <>
                          <img
                            src={postedBy.profilePhotoUrl}
                            alt={postedBy.companyName || "Company Logo"}
                            className="company-logo"
                            onError={(e) => {
                              e.target.style.display = "none";
                              const icon =
                                e.target.parentElement.querySelector(
                                  ".company-logo-icon"
                                );
                              if (icon) icon.style.display = "block";
                            }}
                          />
                          <i
                            className="bi bi-building company-logo-icon"
                            style={{ display: "none" }}
                          ></i>
                        </>
                      ) : (
                        <i className="bi bi-building company-logo-icon"></i>
                      )}
                    </div>
                  </div>
                </div>

                <div className="job-body">
                  {/* Job Description */}
                  <div className="mb-5">
                    <h3 className="section-title">Job Description</h3>
                    <div
                      className="job-description"
                      dangerouslySetInnerHTML={{
                        __html:
                          jobDescription || "<p>No description available.</p>",
                      }}
                    ></div>
                  </div>

                  <div className="d-flex flex-wrap gap-3 btn-container mt-5">
                    {isApplied ? (
                      <button
                        className="btn btn-danger d-flex align-items-center gap-2"
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure?",
                            text: "You will unapply from this job.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "Yes, Unapply",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              dispatch(
                                unapplyJob(id, {
                                  showSuccess: (msg) => {
                                    Swal.fire("Success", msg, "success");
                                    router.push("/employee/applied-jobs");
                                  },
                                  showError: (msg) =>
                                    Swal.fire("Error", msg, "error"),
                                })
                              );
                            }
                          });
                        }}
                      >
                        <i className="bi bi-x-circle"></i> Unapply Job
                      </button>
                    ) : (
                      <button
                        className="btn-apply d-flex align-items-center gap-2"
                        onClick={() => {
                          Swal.fire({
                            title: "Apply for this job?",
                            text: "Do you want to submit your application?",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#6c757d",
                            confirmButtonText: "Yes, Apply",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              dispatch(
                                applyJob(id, {
                                  showSuccess: (msg) =>
                                    Swal.fire("Success", msg, "success"),
                                  showError: (msg) =>
                                    Swal.fire("Error", msg, "error"),
                                })
                              );
                            }
                          });
                        }}
                      >
                        <i className="bi bi-send"></i> Apply Job
                      </button>
                    )}

                    <button
                      className={`btn-bookmark ${isSaved ? "bookmarked" : ""}`}
                      onClick={() => {
                        if (isSaved) {
                          Swal.fire({
                            title: "Remove from Saved?",
                            text: "This job will be removed from your saved list.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "Yes, Unsave",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              dispatch(
                                unsaveJob(id, {
                                  showSuccess: (msg) =>
                                    Swal.fire("Success", msg, "success"),
                                  showError: (msg) =>
                                    Swal.fire("Error", msg, "error"),
                                })
                              );
                            }
                          });
                        } else {
                          Swal.fire({
                            title: "Save this job?",
                            text: "This job will be added to your saved list.",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#6c757d",
                            confirmButtonText: "Yes, Save",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              dispatch(
                                saveJob(id, {
                                  showSuccess: (msg) =>
                                    Swal.fire("Success", msg, "success"),
                                  showError: (msg) =>
                                    Swal.fire("Error", msg, "error"),
                                })
                              );
                            }
                          });
                        }
                      }}
                    >
                      <i
                        className={`bi ${
                          isSaved ? "bi-bookmark-fill" : "bi-bookmark"
                        }`}
                      ></i>
                      {isSaved ? "Saved" : "Save Job"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="col-lg-4">
              <div className="info-box mb-4">
                <h4 className="info-title">About the Company</h4>
                <p className="text-justify">
                  {postedBy?.companyDescription || "No description available"}
                </p>
                <div className="d-flex mt-4">
                  <div className="me-4">
                    <div className="fw-bold text-dark">Company size</div>
                    <div className="text-muted">
                      {postedBy?.companySize || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Website</div>
                    <div className="text-muted">
                      {postedBy?.companyWebsite ? (
                        <a
                          href={postedBy.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "var(--primary-color)",
                            textDecoration: "none",
                          }}
                        >
                          Visit
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="fw-bold text-dark">Verified</div>
                  <div className="text-muted">
                    {postedBy?.companyVerified ? (
                      <span style={{ color: "var(--accent-color)" }}>
                        <i className="bi bi-check-circle-fill me-1"></i>
                        Yes
                      </span>
                    ) : (
                      "No"
                    )}
                  </div>
                </div>
              </div>

              {/* Company Gallery */}
              {postedBy?.companyGallery?.length > 0 && (
                <div className="info-box mb-4">
                  <h4 className="info-title">Company Gallery</h4>
                  <div className="d-flex flex-wrap gap-2">
                    {postedBy.companyGallery.map((img, index) => (
                      <img
                        key={img._id || index}
                        src={img.imageUrl}
                        alt={img.altText || `Gallery image ${index + 1}`}
                        className="gallery-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default JobDetailsPage;
