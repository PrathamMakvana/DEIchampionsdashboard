"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMySavedJobs, unsaveJob } from "@/api/job";
import Swal from "sweetalert2";

export default function SavedJobs() {
  const [activeFilter, setActiveFilter] = useState("All Applications");
  const dispatch = useDispatch();
  const { mySavedJobs, loading } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(getMySavedJobs());
  }, [dispatch]);

  const filters = [
    "All Applications",
    "Applied",
    "In Review",
    "Interviewing",
    "Accepted",
    "Rejected",
  ];

  const handleUnsave = (jobId) => {
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
          unsaveJob(jobId, {
            showSuccess: (msg) => {
              Swal.fire("Success", msg, "success");
              dispatch(getMySavedJobs()); 
            },
            showError: (msg) => Swal.fire("Error", msg, "error"),
          })
        );
      }
    });
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Saved Jobs</h1>
            <p className="page-subtitle">
              Track the status of all your saved jobs in one place
            </p>
          </div>
          <div className="header-stats">
            <span className="app-count">
              <span className="count-number">{mySavedJobs.length}</span> saved
              jobs
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      {/* <div className="filter-section">
        <h5 className="filter-title">Filter by Status</h5>
        <div className="filter-options">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div> */}

      {/* Saved Jobs List */}
      <div className="jobs-grid">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : mySavedJobs.length === 0 ? (
          <p>No saved jobs found.</p>
        ) : (
          mySavedJobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-card-header">
                <h3 className="job-title">{job.jobTitle}</h3>
                <p className="company-name">{job?.postedBy?.companyName}</p>
                <span className="status-badge status-review">
                  <i className="bi bi-bookmark-heart me-1"></i>
                  <span>Saved</span>
                </span>

                {/* Meta Info */}
                <div
                  className="job-meta rmborder d-flex gap-3"
                  style={{ overflow: "hidden" }}
                >
                  <span
                    className="job-meta-item d-flex align-items-center text-truncate"
                    style={{
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <i className="bi bi-geo-alt me-1"></i> {job.city}, {job.state}
                  </span>
                  <span
                    className="job-meta-item d-flex align-items-center text-truncate"
                    style={{
                      maxWidth: "150px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <i className="bi bi-briefcase me-1"></i> {job?.jobType?.name}
                  </span>
                  <span
                    className="job-meta-item d-flex align-items-center text-truncate"
                    style={{
                      maxWidth: "100px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <i className="bi bi-cash me-1"></i> {job.salary}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="job-card-body">
                <p className="job-description">
                  {job.jobDescription?.slice(0, 120)}...
                </p>

                <div className="job-actions d-flex gap-2">
                  <Link
                    className="btn-details"
                    href={`/employee/job-details/${job._id}`}
                  >
                    <i className="bi bi-eye me-1"></i> View Details
                  </Link>

                  {/* Unsave Button */}
                  <button
                    className="btn btn-danger d-flex align-items-center gap-1"
                    onClick={() => handleUnsave(job._id)}
                  >
                    <i className="bi bi-bookmark-x"></i> Unsave
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
