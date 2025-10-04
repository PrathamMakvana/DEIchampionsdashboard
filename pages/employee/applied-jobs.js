"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyApplications, unapplyJob } from "@/api/job";
import Swal from "sweetalert2";

export default function AppliedJobs() {
  const dispatch = useDispatch();
  const { myApplications, loading } = useSelector((state) => state.job);

  const [activeFilter, setActiveFilter] = useState("All Applications");

  const filters = [
    "All Applications",
    "Applied",
    "In Review",
    "Interviewing",
    "Accepted",
    "Rejected",
  ];

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  return (
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
              <span className="count-number">
                {myApplications?.length || 0}
              </span>{" "}
              applications
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
      <div className="jobs-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading applications...</p>
        ) : myApplications?.length > 0 ? (
          myApplications.map((job) => (
            <div
              key={job._id}
              className="job-card flex flex-col h-full border rounded-2xl shadow-md p-4 bg-white"
            >
              {/* Content (fills remaining height) */}
              <div className="flex-grow">
                <div className="job-card-header mb-3">
                  <h3
                    className="job-title font-semibold text-lg truncate"
                    style={{ textTransform: "uppercase" }}
                  >
                    {job.jobTitle}
                  </h3>

                  <p className="company-name text-sm text-gray-600 truncate">
                    {job.postedBy?.companyName}
                  </p>
                  <span className="status-badge inline-flex items-center text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-md mt-2">
                    <i className="bi bi-send-check me-1"></i>
                    <span>Applied</span>
                  </span>
                </div>

                {/* Meta Info */}
                <div className="job-meta flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                  <span className="job-meta-item flex items-center gap-1 truncate max-w-[150px]">
                    <i className="bi bi-geo-alt"></i>
                    {job.city}, {job.state}
                  </span>
                  <span className="job-meta-item flex items-center gap-1 truncate max-w-[120px]">
                    <i className="bi bi-briefcase"></i> {job.jobType?.name}
                  </span>
                  <span className="job-meta-item flex items-center gap-1 truncate max-w-[100px]">
                    <i className="bi bi-cash"></i> {job.salary}
                  </span>
                </div>

                {/* Applied Date + Description */}
                <div className="applied-date text-xs text-gray-500 mb-2">
                  <i className="bi bi-calendar-check"></i> Applied on:{" "}
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <p
                  className="job-description text-sm text-gray-700"
                  style={{
                    flexGrow: "1",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis",
                  }}
                >
                  {job.jobDescription}
                </p>
              </div>

              {/* Actions (pinned to bottom) */}
              <div className="job-actions flex justify-between pt-3 border-t mt-auto">
                <Link
                  className="btn-details text-blue-600 hover:underline flex items-center"
                  href={`/employee/job-details/${job._id}`}
                >
                  <i className="bi bi-eye me-1"></i> View Details
                </Link>

                <button
                  className="btn-unapply text-red-600 hover:text-red-800 flex items-center"
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
                          unapplyJob(job._id, {
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
                  <i className="bi bi-x-circle me-1"></i> Unapply
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No applications found.</p>
        )}
      </div>
    </Layout>
  );
}
