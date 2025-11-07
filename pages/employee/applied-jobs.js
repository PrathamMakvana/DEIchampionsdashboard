"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyApplications, unapplyJob } from "@/api/job";
import Swal from "sweetalert2";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { useSearchParams } from "next/navigation";

export default function AppliedJobs() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { myApplications, loading } = useSelector((state) => state.job);

  const initialFilter = searchParams.get("filter") || "All Applications";
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filters = [
    "All Applications",
    "Pending",
    "Accepted",
    "Interviewing",
    "Negotiation",
    "Hired",
    "Rejected",
  ];

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  // Filter applications based on logged-in user's applicationStatus
  const filteredApplications =
    activeFilter === "All Applications"
      ? myApplications
      : myApplications.filter((job) => {
          return job.myStatus?.toLowerCase() === activeFilter.toLowerCase();
        });

  // Pagination calculations
  const totalPages = Math.ceil(
    (filteredApplications?.length || 0) / rowsPerPage
  );
  const paginatedApplications = filteredApplications?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [activeFilter]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          borderColor: "#FDE68A",
        };
      case "accepted":
        return {
          backgroundColor: "#D1FAE5",
          color: "#065F46",
          borderColor: "#A7F3D0",
        };
      case "interviewing":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
          borderColor: "#BFDBFE",
        };
      case "negotiation":
        return {
          backgroundColor: "#E0E7FF",
          color: "#3730A3",
          borderColor: "#C7D2FE",
        };
      case "hired":
        return {
          backgroundColor: "#DCFCE7",
          color: "#166534",
          borderColor: "#BBF7D0",
        };
      case "rejected":
        return {
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
          borderColor: "#FECACA",
        };
      case "all applications":
        return {
          backgroundColor: "#E5E7EB",
          color: "#374151",
          borderColor: "#D1D5DB",
        };
      default:
        return {
          backgroundColor: "#F3F4F6",
          color: "#374151",
          borderColor: "#E5E7EB",
        };
    }
  };

  const getMyStatus = (job) => {
    const statusEntry = job.applicationStatus?.find(
      (app) => app.applicant?._id === job.loggedInUserId
    );
    return statusEntry?.status || "pending";
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content flex justify-between items-center">
          <div>
            <h1 className="page-title text-2xl font-bold">Applied Jobs</h1>
            <p className="page-subtitle text-gray-600">
              Track the status of all your job applications in one place
            </p>
          </div>
          <div className="header-stats text-gray-700">
            <span className="app-count font-medium">
              <span className="count-number">
                {myApplications?.length || 0}
              </span>{" "}
              applications
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section mt-4">
        <h5 className="filter-title font-semibold mb-2">Filter by Status</h5>
        <div className="filter-options flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              className="filter-btn px-4 py-2 rounded-md border font-medium transition-colors"
              style={
                activeFilter === filter
                  ? {
                      backgroundColor: "#2563EB",
                      color: "#FFFFFF",
                      borderColor: "#2563EB",
                    }
                  : {
                      backgroundColor: "#F9FAFB",
                      color: "#374151",
                      borderColor: "#D1D5DB",
                    }
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Applied Jobs List */}
      <div className="jobs-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {loading ? (
          <p>Loading applications...</p>
        ) : paginatedApplications?.length > 0 ? (
          paginatedApplications.map((job) => {
            const badgeStyle = getStatusBadge(job.myStatus);

            return (
              <div
                key={job._id}
                className="job-card flex flex-col h-full border rounded-2xl shadow-md p-4 bg-white"
              >
                {/* Content */}
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
                    <span
                      className="status-badge inline-flex items-center text-sm font-medium px-2 py-1 rounded-md mt-2"
                      style={{
                        backgroundColor: badgeStyle.backgroundColor,
                        color: badgeStyle.color,
                        border: `1px solid ${badgeStyle.borderColor}`,
                      }}
                    >
                      <i className="bi bi-send-check me-1"></i>
                      <span>
                        {job.myStatus?.charAt(0).toUpperCase() +
                          job.myStatus?.slice(1)}
                      </span>
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
                      <i className="bi bi-cash"></i>{" "}
                      {job?.salary?.range || "Not specified"}
                    </span>
                  </div>

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
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      textOverflow: "ellipsis",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: job.jobDescription || "No description available.",
                    }}
                  ></p>
                </div>

                {/* Actions */}
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
            );
          })
        ) : (
          <p>No applications found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center px-3 py-3 border-t gap-2 mt-6">
        <div className="text-muted small text-center text-sm-start">
          Showing{" "}
          <span className="fw-semibold">
            {paginatedApplications.length > 0
              ? (currentPage - 1) * rowsPerPage + 1
              : 0}
          </span>{" "}
          to{" "}
          <span className="fw-semibold">
            {Math.min(currentPage * rowsPerPage, filteredApplications.length)}
          </span>{" "}
          of <span className="fw-semibold">{filteredApplications.length}</span>{" "}
          Applications
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <FaAngleDoubleLeft size={12} />
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <FaAngleLeft size={12} />
          </button>
          <span className="mx-2 fw-semibold small">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <FaAngleRight size={12} />
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <FaAngleDoubleRight size={12} />
          </button>
        </div>
      </div>
    </Layout>
  );
}
