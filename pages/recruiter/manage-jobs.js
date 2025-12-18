import { getJobs, deleteJob } from "@/api/job";
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const ManageJobs = () => {
  const filters = ["All Jobs", "Open", "Closed", "Drafts"];
  const [activeFilter, setActiveFilter] = useState("All Jobs");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const router = useRouter();
  const { jobs, loading } = useSelector((state) => state.job);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  // Apply filter from query parameter
  useEffect(() => {
    if (router.query.filter) {
      const param = router.query.filter.toLowerCase();

      if (param === "open") setActiveFilter("Open");
      else if (param === "closed") setActiveFilter("Closed");
      else if (param === "draft") setActiveFilter("Drafts");
      else setActiveFilter("All Jobs");
    }
  }, [router.query.filter]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleAction = (action, jobId) => {
    if (action === "View") {
      router.push(`/recruiter/manage-job-details?id=${jobId}`);
    } else if (action === "Edit") {
      router.push(`/recruiter/post-job?id=${jobId}`);
    } else if (action === "Delete") {
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
            deleteJob(jobId, {
              showSuccess: (msg) => Swal.fire("Deleted!", msg, "success"),
              showError: (msg) => Swal.fire("Error!", msg, "error"),
            })
          );
        }
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { class: "status-active", icon: "bi-check-circle", text: "Open" },
      closed: { class: "status-closed", icon: "bi-x-circle", text: "Closed" },
      draft: { class: "status-draft", icon: "bi-file-earmark", text: "Draft" },
    };
    const config = statusConfig[status] || {
      class: "status-pending",
      icon: "bi-clock",
      text: status,
    };
    return (
      <span className={`status-badge-2 ${config.class}`}>
        <i className={`bi ${config.icon}`} style={{ marginRight: "3px" }}></i>{" "}
        {config.text}
      </span>
    );
  };

  // Filter jobs using the enum values
  const filteredJobs = jobs
    ? jobs.filter((job) => {
        if (activeFilter === "All Jobs") return true;
        if (activeFilter === "Open") return job.status === "open";
        if (activeFilter === "Closed") return job.status === "closed";
        if (activeFilter === "Drafts") return job.status === "draft";
        return true;
      })
    : [];

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container">
          {/* Stats Cards remain unchanged */}

          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="bi bi-list-task me-2"></i> Your Job Listings
              </h2>
              <button
                className="btn-primary-custom"
                onClick={() => router.push("/recruiter/post-job")}
              >
                <i className="bi bi-plus-lg"></i> Post New Job
              </button>
            </div>
            <div className="card-body">
              {/* Filters */}
              <div className="filters-container mb-3">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={`filter-btn ${
                      activeFilter === filter ? "active" : ""
                    }`}
                    onClick={() => handleFilterClick(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {loading && (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                  Loading jobs...
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredJobs.length === 0 && (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                  No jobs found.
                </div>
              )}

              {/* Jobs Table */}
              {!loading && filteredJobs.length > 0 && (
                <>
                  <div className="table-container">
                    <table className="jobs-table">
                      <thead>
                        <tr>
                          <th>Position</th>
                          <th>Status</th>
                          <th>Date Posted</th>
                          <th>Applicants</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentJobs.map((job) => (
                          <tr key={job._id}>
                            <td data-label="Position">
                              <div className="job-title-2">{job.jobTitle}</div>
                              <div className="company-name-2">
                                {job.postedBy?.companyName || "N/A"}
                              </div>
                            </td>
                            <td data-label="Status">
                              {getStatusBadge(job.status)}
                            </td>
                            <td data-label="Date Posted">
                              <div className="date-info">
                                {new Date(job.createdAt).toDateString()}
                              </div>
                            </td>
                            <td data-label="Applicants">
                              <div className="applicants-count">
                                {job.applicants?.length || 0}
                              </div>
                              <div className="date-info">
                                {job.status === "closed"
                                  ? "Position filled"
                                  : job.status === "draft"
                                  ? "Not published"
                                  : "—"}
                              </div>
                            </td>
                            <td data-label="Actions" className="actions-cell">
                              <button
                                className="btn-action btn-view"
                                onClick={() => handleAction("View", job._id)}
                              >
                                <i className="bi bi-eye"></i> View
                              </button>
                              <button
                                className="btn-action btn-edit"
                                onClick={() => handleAction("Edit", job._id)}
                              >
                                <i className="bi bi-pencil"></i> Edit
                              </button>
                              <button
                                className="btn-action btn-delete"
                                onClick={() => handleAction("Delete", job._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav
                      aria-label="Job listings pagination"
                      style={{ marginTop: "2rem" }}
                    >
                      <ul
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          listStyle: "none",
                          gap: "0.5rem",
                          padding: 0,
                        }}
                      >
                        <li>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1)
                                setCurrentPage(currentPage - 1);
                            }}
                            style={{
                              padding: "0.5rem 0.75rem",
                              textDecoration: "none",
                              color: "#6c757d",
                              border: "1px solid #dee2e6",
                              borderRadius: "0.375rem",
                            }}
                          >
                            Previous
                          </a>
                        </li>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <li key={page}>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              style={{
                                padding: "0.5rem 0.75rem",
                                textDecoration: "none",
                                color:
                                  currentPage === page
                                    ? "white"
                                    : "var(--primary-color)",
                                backgroundColor:
                                  currentPage === page
                                    ? "var(--primary-color)"
                                    : "transparent",
                                border: `1px solid ${
                                  currentPage === page
                                    ? "var(--primary-color)"
                                    : "#dee2e6"
                                }`,
                                borderRadius: "0.375rem",
                              }}
                            >
                              {page}
                            </a>
                          </li>
                        ))}

                        <li>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages)
                                setCurrentPage(currentPage + 1);
                            }}
                            style={{
                              padding: "0.5rem 0.75rem",
                              textDecoration: "none",
                              color: "var(--primary-color)",
                              border: "1px solid #dee2e6",
                              borderRadius: "0.375rem",
                            }}
                          >
                            Next
                          </a>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageJobs;
