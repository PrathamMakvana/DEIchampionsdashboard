import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import React, { useState } from "react";

const ManageJobs = () => {
  const [activeFilter, setActiveFilter] = useState("All Jobs");
  const router = useRouter();

  const filters = ["All Jobs", "Active", "Pending", "Drafts", "Closed"];

  const jobsData = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Technology Department",
      status: "active",
      datePosted: "May 15, 2025",
      applicants: 42,
      newToday: 12,
    },
    {
      id: 2,
      title: "UX/UI Designer",
      department: "Design Department",
      status: "pending",
      datePosted: "May 14, 2025",
      applicants: 18,
      newToday: 3,
    },
    {
      id: 3,
      title: "DevOps Engineer",
      department: "Infrastructure Team",
      status: "active",
      datePosted: "May 10, 2025",
      applicants: 56,
      newToday: 8,
    },
    {
      id: 4,
      title: "Product Manager",
      department: "Product Team",
      status: "closed",
      datePosted: "Apr 28, 2025",
      applicants: 89,
      newToday: 0,
    },
    {
      id: 5,
      title: "Data Scientist",
      department: "Analytics Department",
      status: "draft",
      datePosted: "Not posted",
      applicants: 0,
      newToday: 0,
    },
  ];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleAction = (action, jobTitle) => {
    router.push(`/employers/manage-job-details`);
  };

  const handlePostNewJob = () => {
    alert("Redirecting to new job posting form...");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        class: "status-active",
        icon: "bi-check-circle",
        text: "Active",
      },
      pending: { class: "status-pending", icon: "bi-clock", text: "Pending" },
      closed: { class: "status-closed", icon: "bi-x-circle", text: "Closed" },
      draft: { class: "status-draft", icon: "bi-file-earmark", text: "Draft" },
    };

    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.class}`}>
        <i className={`bi ${config.icon}`}></i> {config.text}
      </span>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <style jsx>{``}</style>

        {/* Main Content */}
        <div className="container">
          {/* Stats Cards */}
          <div className="stats-container">
            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  background: "rgba(78, 84, 200, 0.1)",
                  color: "var(--primary-color)",
                }}
              >
                <i className="bi bi-briefcase"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">24</div>
                <div className="stat-label">Active Jobs</div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  background: "rgba(40, 167, 69, 0.1)",
                  color: "var(--success-color)",
                }}
              >
                <i className="bi bi-people"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">142</div>
                <div className="stat-label">Total Applicants</div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  background: "rgba(255, 107, 107, 0.1)",
                  color: "var(--accent-color)",
                }}
              >
                <i className="bi bi-clock-history"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">8</div>
                <div className="stat-label">Pending Review</div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  background: "rgba(255, 193, 7, 0.1)",
                  color: "var(--warning-color)",
                }}
              >
                <i className="bi bi-file-earmark"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">5</div>
                <div className="stat-label">Drafts</div>
              </div>
            </div>
          </div>

          {/* Job Listings Card */}
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="bi bi-list-task me-2"></i> Your Job Listings
              </h2>
              <button className="btn-primary-custom" onClick={handlePostNewJob}>
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

              {/* Jobs Table */}
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
                    {jobsData.map((job) => (
                      <tr key={job.id}>
                        <td data-label="Position">
                          <div className="job-title">{job.title}</div>
                          <div className="company-name">{job.department}</div>
                        </td>
                        <td data-label="Status">
                          {getStatusBadge(job.status)}
                        </td>
                        <td data-label="Date Posted">
                          <div className="date-info">{job.datePosted}</div>
                        </td>
                        <td data-label="Applicants">
                          <div className="applicants-count">
                            {job.applicants}
                          </div>
                          <div className="date-info">
                            {job.status === "closed"
                              ? "Position filled"
                              : job.status === "draft"
                              ? "Not published"
                              : `${job.newToday} new today`}
                          </div>
                        </td>
                        <td data-label="Actions" className="actions-cell">
                          <button
                            className="btn-action btn-view"
                            onClick={() => handleAction("View", job.title)}
                          >
                            <i className="bi bi-eye"></i> View
                          </button>
                          <button
                            className="btn-action btn-edit"
                            onClick={() => handleAction("Edit", job.title)}
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleAction("Delete", job.title)}
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
                  <li>
                    <a
                      href="#"
                      style={{
                        padding: "0.5rem 0.75rem",
                        textDecoration: "none",
                        color: "white",
                        backgroundColor: "var(--primary-color)",
                        border: "1px solid var(--primary-color)",
                        borderRadius: "0.375rem",
                      }}
                    >
                      1
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{
                        padding: "0.5rem 0.75rem",
                        textDecoration: "none",
                        color: "var(--primary-color)",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.375rem",
                      }}
                    >
                      2
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{
                        padding: "0.5rem 0.75rem",
                        textDecoration: "none",
                        color: "var(--primary-color)",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.375rem",
                      }}
                    >
                      3
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageJobs;
