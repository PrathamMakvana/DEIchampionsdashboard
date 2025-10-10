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

  useEffect(() => {
    if (id) {
      dispatch(getJob(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentJob && currentJob.applicants) {
      setApplicants(currentJob.applicants);
    }
  }, [currentJob]);

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
      accepted: {
        class: "bg-success-subtle text-success border",
        icon: "bi-check-circle",
        text: "Accepted",
      },
      rejected: {
        class: "bg-danger-subtle text-danger border",
        icon: "bi-x-circle",
        text: "Rejected",
      },
      pending: {
        class: "bg-warning-subtle text-warning border",
        icon: "bi-clock",
        text: "Pending",
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
          <div className="job-details-container">
            <div>
              {/* Job Details Card */}
              <div className="content-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="bi bi-file-earmark-text me-2"></i> Job Details
                  </h2>
                  <div>
                    <button
                      className="btn-action btn-edit"
                      onClick={handleEditJob}
                    >
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
                  <div className="job-header">
                    <div>
                      <h3>{currentJob.jobTitle}</h3>
                      <p className="text-muted">
                        {currentJob.category?.title || "N/A"} • Posted on{" "}
                        {formatDate(currentJob.createdAt)}
                      </p>
                    </div>
                    {getJobStatusBadge(currentJob.status)}
                  </div>

                  <div className="job-meta d-flex flex-wrap gap-4">
                    <div className="meta-item">
                      <div className="meta-icon">
                        <i className="bi bi-briefcase"></i>
                      </div>
                      <div className="meta-content">
                        <h5>Job Type</h5>
                        <p>{currentJob.jobType?.name || "N/A"}</p>
                      </div>
                    </div>

                    <div className="meta-item">
                      <div className="meta-icon">
                        <i className="bi bi-building"></i>
                      </div>
                      <div className="meta-content">
                        <h5>Department</h5>
                        <p>{currentJob.department?.name || "N/A"}</p>
                      </div>
                    </div>

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

                    <div className="meta-item">
                      <div className="meta-icon">
                        <i className="bi bi-currency-dollar"></i>
                      </div>
                      <div className="meta-content">
                        <h5>Salary</h5>
                        <p>{currentJob.salary || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="meta-item">
                      <div className="meta-icon">
                        <i className="bi bi-people"></i>
                      </div>
                      <div className="meta-content">
                        <h5>Applicants</h5>
                        <p>
                          {applicants.length} candidate
                          {applicants.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="job-description">
                    <h4 className="section-title">
                      <i className="bi bi-card-text"></i> Job Description
                    </h4>
                    <p>
                      {currentJob.jobDescription || "No description provided."}
                    </p>
                  </div>

                  {currentJob.tags && currentJob.tags.length > 0 && (
                    <div className="job-description">
                      <h4 className="section-title">
                        <i className="bi bi-tags"></i> Tags
                      </h4>
                      <div className="tags-container">
                        {currentJob.tags.map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div>
              {/* Job Stats Card */}
              <div className="job-overview-card mb-4">
                <h4 className="section-title">
                  <i className="bi bi-graph-up"></i> Job Statistics
                </h4>

                <div
                  className="job-meta"
                  style={{ justifyContent: "space-between" }}
                >
                  <div
                    className="meta-item"
                    style={{ flexDirection: "column" }}
                  >
                    <div className="meta-icon">
                      <i className="bi bi-eye"></i>
                    </div>
                    <div className="meta-content text-center">
                      <h5>Views</h5>
                      <p>1,245</p>
                    </div>
                  </div>

                  <div
                    className="meta-item"
                    style={{ flexDirection: "column" }}
                  >
                    <div className="meta-icon">
                      <i className="bi bi-people"></i>
                    </div>
                    <div className="meta-content text-center">
                      <h5>Applicants</h5>
                      <p>{applicants.length}</p>
                    </div>
                  </div>

                  <div
                    className="meta-item"
                    style={{ flexDirection: "column" }}
                  >
                    <div className="meta-icon">
                      <i className="bi bi-share"></i>
                    </div>
                    <div className="meta-content text-center">
                      <h5>Shares</h5>
                      <p>87</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h5>Application Status</h5>
                  <div className="mt-2">
                    <div className="d-flex justify-content-between mb-2">
                      <span>New</span>
                      <span>12</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: "28%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Reviewed</span>
                      <span>18</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-info"
                        role="progressbar"
                        style={{ width: "43%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Interview</span>
                      <span>8</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: "19%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Rejected</span>
                      <span>4</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-danger"
                        role="progressbar"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              {/* <div className="job-overview-card container">
                <div className="row">
                  <div className="col-12">
                    <h4 className="section-title d-flex align-items-center">
                      <i className="bi bi-lightning me-2"></i> Quick Actions
                    </h4>
                  </div>
                  <div className="col-12 mt-4">
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary w-100 mb-3">
                        <i className="bi bi-person-plus-fill me-2"></i> Add New
                        Candidate
                      </button>
                      <button className="btn btn-primary w-100 mb-3">
                        <i className="bi bi-envelope-fill me-2"></i> Email
                        Candidates
                      </button>
                      <button className="btn btn-primary w-100 mb-3">
                        <i className="bi bi-calendar-event-fill me-2"></i>{" "}
                        Schedule Interview
                      </button>
                      <button className="btn btn-primary w-100">
                        <i className="bi bi-box-arrow-up-right me-2"></i> Export
                        Applications
                      </button>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Applicants Card - Only show if there are applicants */}
          {applicants.length > 0 && (
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: "24px" }}>
                  <i className="bi bi-people me-2"></i> Applicants (
                  {applicants.length})
                </h3>
                <div className="filters-container">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">New</button>
                  <button className="filter-btn">Reviewed</button>
                  <button className="filter-btn">Interview</button>
                  <button className="filter-btn">Rejected</button>
                </div>
              </div>
              <div className="card-body">
                {Array.isArray(applicants) &&
                  applicants.map((applicant, index) => {
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
                            {applicantStatus !== "accepted" && (
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
                            )}
                            {applicantStatus !== "rejected" && (
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
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JobDetailsPage;
