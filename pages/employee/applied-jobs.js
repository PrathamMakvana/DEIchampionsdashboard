"use client";
import Layout from "@/components/layout/Layout";
import React, { useState } from "react";

export default function AppliedJobs() {
  const [activeFilter, setActiveFilter] = useState("All Applications");

  const jobData = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechInnovate Inc.",
      status: "In Review",
      statusClass: "status-review",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120K - $140K",
      appliedDate: "June 15, 2023",
      description:
        "Your application is currently being reviewed by the hiring team. We'll notify you when there's an update.",
      icon: "hourglass-split",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Creative Solutions Ltd.",
      status: "Applied",
      statusClass: "status-applied",
      location: "New York, NY",
      type: "Remote",
      salary: "$95K - $110K",
      appliedDate: "June 20, 2023",
      description:
        "Your application has been successfully submitted! The hiring team will review your profile shortly.",
      icon: "send-check",
    },
    {
      id: 3,
      title: "Product Manager",
      company: "InnovateX Corporation",
      status: "Accepted",
      statusClass: "status-accepted",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$130K - $150K",
      appliedDate: "May 28, 2023",
      description:
        "Congratulations! Your application has been accepted. The HR team will contact you with the next steps.",
      icon: "check-circle",
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "AnalyticsPro",
      status: "Rejected",
      statusClass: "status-rejected",
      location: "Boston, MA",
      type: "Hybrid",
      salary: "$140K - $160K",
      appliedDate: "June 5, 2023",
      description:
        "We appreciate your interest but have decided to move forward with other candidates. We encourage you to apply for future positions.",
      icon: "x-circle",
    },
  ];

  const filters = [
    "All Applications",
    "Applied",
    "In Review",
    "Interviewing",
    "Accepted",
    "Rejected",
  ];

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
        rel="stylesheet"
      />
      <style jsx>{``}</style>

      <Layout>
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">Applied Jobs</h1>
              <p className="page-subtitle">
                Track the status of all your job applications in one place
              </p>
            </div>
            <div className="header-stats">
              <span className="app-count">
                <span className="count-number">12</span> applications
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-row">
          <div className="stats-col">
            <div className="stats-card">
              <div className="stats-number">8</div>
              <div className="stats-label">In Review</div>
            </div>
          </div>
          <div className="stats-col">
            <div className="stats-card">
              <div className="stats-number">2</div>
              <div className="stats-label">Interviewing</div>
            </div>
          </div>
          <div className="stats-col">
            <div className="stats-card">
              <div className="stats-number">1</div>
              <div className="stats-label">Accepted</div>
            </div>
          </div>
          <div className="stats-col">
            <div className="stats-card">
              <div className="stats-number">1</div>
              <div className="stats-label">Rejected</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-section">
          <h5 className="filter-title">Filter by Status</h5>
          <div className="filter-options">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Applied Jobs List */}
        <div className="jobs-grid">
          {jobData.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h3 className="job-title">{job.title}</h3>
                <p className="company-name">{job.company}</p>
                <span className={`status-badge ${job.statusClass}`}>
                  <i className={`bi bi-${job.icon} me-1`}></i>
                  <span>{job.status}</span>
                </span>

                <div className="job-meta rmborder">
                  <span className="job-meta-item">
                    <i className="bi bi-geo-alt"></i> {job.location}
                  </span>
                  <span className="job-meta-item">
                    <i className="bi bi-briefcase"></i> {job.type}
                  </span>
                  <span className="job-meta-item">
                    <i className="bi bi-cash"></i> {job.salary}
                  </span>
                </div>
              </div>

              <div className="job-card-body">
                <div className="applied-date">
                  <i className="bi bi-calendar-check"></i> Applied on:{" "}
                  {job.appliedDate}
                </div>
                <p className="job-description">{job.description}</p>

                <div className="job-actions">
                  <button className="btn-details">
                    <i className="bi bi-eye me-1"></i> View Details
                  </button>
                  <button className="btn-save">
                    <i className="bi bi-bookmark me-1"></i> Save Job
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </>
  );
}
