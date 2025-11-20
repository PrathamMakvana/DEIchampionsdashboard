import { getJob, deleteJob, updateApplicationStatus, getJobs } from "@/api/job";
import Layout from "@/components/layout/Layout";
import { LocaleRouteMatcher } from "next/dist/server/future/route-matchers/locale-route-matcher";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const JobDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { currentJob, loading } = useSelector((state) => state.job);
  console.log("🚀currentJob --->", currentJob);
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (id) {
      dispatch(getJob(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentJob && currentJob.applicants) {
      setApplicants(currentJob.applicants);
      setFilteredApplicants(currentJob.applicants);
    }
  }, [currentJob]);

  // Filter applicants based on status
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredApplicants(applicants);
    } else {
      const filtered = applicants.filter((applicant) => {
        const status = getApplicantStatus(applicant._id);
        return status === activeFilter;
      });
      setFilteredApplicants(filtered);
    }
  }, [activeFilter, applicants]);

  // Function to handle filter changes
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Function to get applicant status
  const getApplicantStatus = (applicantId) => {
    if (!currentJob.applicationStatus) return "pending";

    const statusObj = currentJob.applicationStatus.find(
      (status) => status.applicant === applicantId
    );

    return statusObj ? statusObj.status : "pending";
  };

  // Function to get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { class: "status-active", icon: "bi-check-circle", text: "Active" },
      closed: { class: "status-closed", icon: "bi-x-circle", text: "Closed" },
      draft: { class: "status-draft", icon: "bi-file-earmark", text: "Draft" },
      pending: {
        class: "bg-warning-subtle text-warning border",
        icon: "bi-clock",
        text: "New",
      },
      accepted: {
        class: "bg-info-subtle text-info border",
        icon: "bi-check-circle",
        text: "Reviewed",
      },
      interviewing: {
        class: "bg-primary-subtle text-primary border",
        icon: "bi-calendar-check",
        text: "Interview",
      },
      negotiation: {
        class: "bg-warning-subtle text-warning border",
        icon: "bi-currency-exchange",
        text: "Negotiation",
      },
      hired: {
        class: "bg-success-subtle text-success border",
        icon: "bi-award",
        text: "Hired",
      },
      rejected: {
        class: "bg-danger-subtle text-danger border",
        icon: "bi-x-circle",
        text: "Rejected",
      },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary-subtle text-secondary border",
      icon: "bi-question-circle",
      text: status,
    };

    return (
      <span className={`badge ${config.class}`}>
        <i className={`bi ${config.icon} me-1`}></i> {config.text}
      </span>
    );
  };

  const handleEditJob = () => {
    router.push(`/employers/post-job?id=${id}`);
  };

  const handleDeleteJob = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This job will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteJob(id, {
            showSuccess: (msg) => {
              Swal.fire("Deleted!", msg, "success").then(() => {
                router.push("/employers/manage-jobs");
              });
            },
            showError: (msg) => {
              Swal.fire("Error!", msg, "error");
            },
          })
        );
      }
    });
  };

  const handleApplicationStatus = (applicantId, status) => {
    Swal.fire({
      title: `Are you sure you want to ${status} this applicant?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          updateApplicationStatus(
            { jobId: id, applicantId, status },
            {
              showSuccess: (msg) => {
                Swal.fire("Success!", msg, "success");
                dispatch(getJob(id));
              },
              showError: (msg) => {
                Swal.fire("Error!", msg, "error");
              },
            }
          )
        );
      }
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (let key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) {
        return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  const getJobStatusBadge = (status) => {
    const statusConfig = {
      open: { class: "status-active", icon: "bi-check-circle", text: "Active" },
      closed: { class: "status-closed", icon: "bi-x-circle", text: "Closed" },
      draft: { class: "status-draft", icon: "bi-file-earmark", text: "Draft" },
    };
    const config = statusConfig[status] || {
      class: "status-pending",
      icon: "bi-clock",
      text: status,
    };
    return (
      <span className={`status-badge ${config.class}`}>
        <i className={`bi ${config.icon}`}></i> {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="page-content">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading job details...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentJob) {
    return (
      <Layout>
        <div className="page-content">
          <div className="container">
            <div className="text-center py-5">
              <i
                className="bi bi-exclamation-circle text-warning"
                style={{ fontSize: "3rem" }}
              ></i>
              <h3 className="mt-3">Job Not Found</h3>
              <p className="text-muted">
                The job you're looking for doesn't exist or may have been
                removed.
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => router.push("/employers/manage-jobs")}
              >
                Back to Job Listings
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-content">
        {/* Main Content */}
        <div className="container">
          {/* Job Details Card - Full Width */}
          <div className="content-card w-100 mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="card-title">
                <i className="bi bi-file-earmark-text me-2"></i> Job Details
              </h2>

              <div>
                <button className="btn-action btn-edit" onClick={handleEditJob}>
                  <i className="bi bi-pencil"></i> Edit Job
                </button>

                <button
                  className="btn-action btn-delete"
                  onClick={handleDeleteJob}
                >
                  <i className="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>

            <div className="card-body">
              {/* Header */}
              <div className="job-header d-flex justify-content-between align-items-start flex-wrap">
                <div>
                  <h3>{currentJob.jobTitle}</h3>
                  <p className="text-muted">
                    {currentJob.category?.title || "N/A"} • Posted on{" "}
                    {formatDate(currentJob.createdAt)}
                  </p>
                </div>

                {getJobStatusBadge(currentJob.status)}
              </div>

              {/* Meta Fields */}
              <div className="job-meta d-flex flex-wrap gap-4 mt-4">
                {/* Category */}
                {currentJob.category?.title && (
                  <div className="meta-item">
                    <div className="meta-icon">
                      <i className="bi bi-tags"></i>
                    </div>
                    <div className="meta-content">
                      <h5>Category</h5>
                      <p>
                        {currentJob.category?.image && (
                          <img
                            src={currentJob.category.image}
                            alt={currentJob.category.title}
                            style={{
                              width: "22px",
                              height: "22px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              marginRight: "8px",
                            }}
                          />
                        )}
                        {currentJob.category.title}
                      </p>
                    </div>
                  </div>
                )}

                {/* Department */}
                <div className="meta-item">
                  <div className="meta-icon">
                    <i className="bi bi-building"></i>
                  </div>
                  <div className="meta-content">
                    <h5>Department</h5>
                    <p>{currentJob.department?.name || "N/A"}</p>
                  </div>
                </div>

                {/* Experience */}
                {currentJob.workExperience && (
                  <div className="meta-item">
                    <div className="meta-icon">
                      <i className="bi bi-award"></i>
                    </div>
                    <div className="meta-content">
                      <h5>Experience Required</h5>
                      <p>{currentJob.workExperience}</p>
                    </div>
                  </div>
                )}

                {/* Salary */}
                <div className="meta-item">
                  <div className="meta-icon">
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                  <div className="meta-content">
                    <h5>Salary</h5>
                    <p>{currentJob.salary?.range || "Not specified"}</p>
                  </div>
                </div>

                {/* Job Type */}
                <div className="meta-item">
                  <div className="meta-icon">
                    <i className="bi bi-briefcase"></i>
                  </div>
                  <div className="meta-content">
                    <h5>Job Type</h5>
                    <p>{currentJob.jobType?.name || "N/A"}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="meta-item">
                  <div className="meta-icon">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <div className="meta-content">
                    <h5>Location</h5>
                    <p>
                      {currentJob.locationArea
                        ? `${currentJob.locationArea}, `
                        : ""}
                      {currentJob.city ? `${currentJob.city}, ` : ""}
                      {currentJob.locationState
                        ? `${currentJob.locationState}, `
                        : ""}
                      {currentJob.locationCountry || ""}
                    </p>
                  </div>
                </div>

                {/* Qualification */}
                {currentJob.candidateQualification && (
                  <div className="meta-item">
                    <div className="meta-icon">
                      <i className="bi bi-mortarboard"></i>
                    </div>
                    <div className="meta-content">
                      <h5>Qualification</h5>
                      <p>{currentJob.candidateQualification}</p>
                    </div>
                  </div>
                )}

                {/* Gender Preference */}
                {currentJob.genderPreference && (
                  <div className="meta-item">
                    <div className="meta-icon">
                      <i className="bi bi-people"></i>
                    </div>
                    <div className="meta-content">
                      <h5>Gender Preference</h5>
                      <p>{currentJob.genderPreference}</p>
                    </div>
                  </div>
                )}

                {/* Candidate Industry */}
                {currentJob.candidateIndustry && (
                  <div className="meta-item">
                    <div className="meta-icon">
                      <i className="bi bi-building-check"></i>
                    </div>
                    <div className="meta-content">
                      <h5>Candidate Industry</h5>
                      <p>{currentJob.candidateIndustry}</p>
                    </div>
                  </div>
                )}

                {/* Languages */}
                {currentJob.languages && currentJob.languages.length > 0 && (
                  <div className="meta-item">
                    <div className="meta-icon">
                      <i className="bi bi-translate"></i>
                    </div>
                    <div className="meta-content">
                      <h5>Languages</h5>
                      <p>{currentJob.languages.join(", ")}</p>
                    </div>
                  </div>
                )}

                {/* Updated */}
                <div className="meta-item">
                  <div className="meta-icon">
                    <i className="bi bi-clock-history"></i>
                  </div>
                  <div className="meta-content">
                    <h5>Last Updated</h5>
                    <p>{getTimeAgo(currentJob.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <hr className="my-4" />
              <h4>Job Description</h4>

              <div
                dangerouslySetInnerHTML={{
                  __html:
                    currentJob.jobDescription?.trim() ||
                    "<p>No job description provided.</p>",
                }}
              />

              {/* Tags */}
              {currentJob.tags && currentJob.tags.length > 0 && (
                <>
                  <h4 className="mt-4 mb-3">Tags</h4>
                  <div>
                    {currentJob.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          marginRight: "8px",
                          marginBottom: "8px",
                          backgroundColor: "#3C65F5",
                          color: "#fff",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "500",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Applicants Card - Only show if there are applicants */}
          {applicants.length > 0 && (
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: "24px" }}>
                  <i className="bi bi-people me-2"></i> Applicants (
                  {filteredApplicants.length})
                </h3>
                <div className="filters-container">
                  <button
                    className={`filter-btn ${
                      activeFilter === "all" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange("all")}
                  >
                    All
                  </button>
                  <button
                    className={`filter-btn ${
                      activeFilter === "pending" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange("pending")}
                  >
                    New
                  </button>
                  <button
                    className={`filter-btn ${
                      activeFilter === "accepted" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange("accepted")}
                  >
                    Reviewed
                  </button>
                  <button
                    className={`filter-btn ${
                      activeFilter === "interviewing" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange("interviewing")}
                  >
                    Interview
                  </button>
                  <button
                    className={`filter-btn ${
                      activeFilter === "negotiation" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange("negotiation")}
                  >
                    Negotiation
                  </button>
                  <button
                    className={`filter-btn ${
                      activeFilter === "hired" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange("hired")}
                  >
                    Hired
                  </button>
                  <button
                    className={`filter-btn ${
                      activeFilter === "rejected" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange("rejected")}
                  >
                    Rejected
                  </button>
                </div>
              </div>
              <div className="card-body">
                {Array.isArray(filteredApplicants) &&
                filteredApplicants.length > 0 ? (
                  filteredApplicants.map((applicant, index) => {
                    const applicantStatus = getApplicantStatus(applicant._id);

                    return (
                      <div
                        key={index}
                        className="applicant-card container mb-4 p-3 border rounded"
                      >
                        <div className="row applicant-header align-items-center">
                          <div className="col-auto">
                            <div
                              className="applicant-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: 45, height: 45 }}
                            >
                              {applicant?.name
                                ? applicant.name.charAt(0).toUpperCase()
                                : "A"}
                            </div>
                          </div>
                          <div className="col">
                            <div className="applicant-info">
                              <h5 className="mb-1 fs-6 fw-semibold">
                                {applicant.name || "Applicant"}
                              </h5>
                              <p className="text-muted fs-7 mb-0">
                                {applicant.workStatus ||
                                  "No experience specified"}
                              </p>
                            </div>
                          </div>
                          <div className="col-auto ms-auto">
                            {getStatusBadge(applicantStatus)}
                          </div>
                        </div>

                        <div className="row applicant-meta text-center text-md-start mt-3">
                          <div className="col-12 col-md-3 mb-3 mb-md-0">
                            <h6 className="fw-semibold fs-7 mb-1">Location</h6>
                            <p className="mb-0 fs-7 text-muted">
                              {applicant.city || "Not specified"}
                            </p>
                          </div>
                          <div className="col-12 col-md-3 mb-3 mb-md-0">
                            <h6 className="fw-semibold fs-7 mb-1">Applied</h6>
                            <p className="mb-0 fs-7 text-muted">
                              {formatDate(applicant.createdAt)}
                            </p>
                          </div>
                          <div className="col-12 col-md-3">
                            <h6 className="fw-semibold fs-7 mb-1">Status</h6>
                            <p
                              className={`mb-0 fs-7 ${
                                applicant.status
                                  ? "text-success"
                                  : "text-danger"
                              }`}
                            >
                              {applicant.status ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>

                        <div className="row justify-content-between align-items-center mt-3">
                          <div className="col-12 text-md-end d-flex flex-wrap justify-content-center justify-content-md-end">
                            <button
                              className="btn btn-outline-primary btn-sm me-2 mt-2 mt-md-0"
                              onClick={() =>
                                router.push(
                                  `/employers/application-details?id=${applicant._id}`
                                )
                              }
                            >
                              <i className="bi bi-eye me-1"></i> View
                            </button>
                            <button className="btn btn-outline-secondary btn-sm me-2 mt-2 mt-md-0">
                              <i className="bi bi-chat me-1"></i> Message
                            </button>

                            {/* Dynamic Status Buttons */}
                            {applicantStatus === "pending" && (
                              <>
                                <button
                                  className="btn btn-success btn-sm me-2 mt-2 mt-md-0"
                                  onClick={() =>
                                    handleApplicationStatus(
                                      applicant._id,
                                      "accepted"
                                    )
                                  }
                                >
                                  <i className="bi bi-check-circle me-1"></i>{" "}
                                  Accept
                                </button>
                              </>
                            )}

                            {applicantStatus === "accepted" && (
                              <button
                                className="btn btn-info btn-sm me-2 mt-2 mt-md-0"
                                onClick={() =>
                                  handleApplicationStatus(
                                    applicant._id,
                                    "interviewing"
                                  )
                                }
                              >
                                <i className="bi bi-calendar-check me-1"></i>{" "}
                                Schedule Interview
                              </button>
                            )}

                            {applicantStatus === "interviewing" && (
                              <button
                                className="btn btn-warning btn-sm me-2 mt-2 mt-md-0"
                                onClick={() =>
                                  handleApplicationStatus(
                                    applicant._id,
                                    "negotiation"
                                  )
                                }
                              >
                                <i className="bi bi-currency-exchange me-1"></i>{" "}
                                Move to Negotiation
                              </button>
                            )}

                            {applicantStatus === "negotiation" && (
                              <button
                                className="btn btn-success btn-sm me-2 mt-2 mt-md-0"
                                onClick={() =>
                                  handleApplicationStatus(
                                    applicant._id,
                                    "hired"
                                  )
                                }
                              >
                                <i className="bi bi-award me-1"></i> Hire
                              </button>
                            )}

                            {/* Reject button */}
                            {applicantStatus !== "rejected" &&
                              applicantStatus !== "hired" && (
                                <button
                                  className="btn btn-danger btn-sm mt-2 mt-md-0"
                                  onClick={() =>
                                    handleApplicationStatus(
                                      applicant._id,
                                      "rejected"
                                    )
                                  }
                                >
                                  <i className="bi bi-x-circle me-1"></i> Reject
                                </button>
                              )}

                            {/* Status messages */}
                            {applicantStatus === "hired" && (
                              <span className="d-flex align-items-center text-success fw-semibold mt-2 mt-md-0">
                                <i className="bi bi-check-circle me-1"></i>{" "}
                                Successfully Hired
                              </span>
                            )}

                            {applicantStatus === "rejected" && (
                              <span className="d-flex align-items-center text-danger fw-semibold mt-2 mt-md-0">
                                <i className="bi bi-x-circle me-1"></i>{" "}
                                Application Rejected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <i
                      className="bi bi-people text-muted"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <p className="text-muted mt-3">
                      No applicants found for the selected filter.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JobDetailsPage;
