"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMySavedJobs, unsaveJob } from "@/api/job";
import Swal from "sweetalert2";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

export default function SavedJobs() {
  const dispatch = useDispatch();
  const { mySavedJobs, loading } = useSelector((state) => state.job);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    dispatch(getMySavedJobs());
  }, [dispatch]);

  // Pagination logic
  const totalPages = Math.ceil((mySavedJobs?.length || 0) / rowsPerPage);
  const paginatedJobs = mySavedJobs?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  console.log("🚀paginatedJobs --->", paginatedJobs);
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
        <div className="header-content flex justify-between items-center">
          <div>
            <h1 className="page-title text-2xl font-bold">Saved Jobs</h1>
            <p className="page-subtitle text-gray-600">
              Track all your saved jobs conveniently in one place
            </p>
          </div>
          <div className="header-stats text-gray-700">
            <span className="app-count font-medium">
              <span className="count-number">{mySavedJobs?.length || 0}</span>{" "}
              saved jobs
            </span>
          </div>
        </div>
      </div>

      {/* Saved Jobs List */}
      <div className="jobs-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {loading ? (
          <p>Loading saved jobs...</p>
        ) : paginatedJobs?.length > 0 ? (
          paginatedJobs.map((job) => (
            <div
              key={job._id}
              className="job-card flex flex-col h-full border rounded-2xl shadow-md p-4 bg-white"
            >
              <div className="flex-grow">
                <div className="job-card-header mb-3">
                  <h3
                    className="job-title font-semibold text-lg truncate"
                    style={{ textTransform: "uppercase" }}
                  >
                    {job.jobTitle}
                  </h3>
                  <p className="company-name text-sm text-gray-600 truncate">
                    {job?.postedBy?.companyName}
                  </p>
                  <span
                    className="status-badge inline-flex items-center text-sm font-medium px-2 py-1 rounded-md mt-2"
                    style={{
                      backgroundColor: "#FEF3C7",
                      color: "#92400E",
                      border: "1px solid #FDE68A",
                    }}
                  >
                    <i className="bi bi-bookmark-heart me-1"></i> Saved
                  </span>
                </div>

                {/* Meta Info */}
                <div className="job-meta flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                  <span className="job-meta-item flex items-center gap-1 truncate max-w-[150px]">
                    <i className="bi bi-geo-alt"></i> {job.city}, {job.state}
                  </span>
                  <span className="job-meta-item flex items-center gap-1 truncate max-w-[120px]">
                    <i className="bi bi-briefcase"></i> {job?.jobType?.name}
                  </span>
                  <span className="job-meta-item flex items-center gap-1 truncate max-w-[100px]">
                    <i className="bi bi-cash"></i>{" "}
                    {job?.salary?.range || "Not specified"}
                  </span>
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
                    __html: job.jobDescription || "",
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
                  onClick={() => handleUnsave(job._id)}
                >
                  <i className="bi bi-bookmark-x me-1"></i> Unsave
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No saved jobs found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center px-3 py-3 border-t gap-2 mt-6">
        <div className="text-muted small text-center text-sm-start">
          Showing{" "}
          <span className="fw-semibold">
            {paginatedJobs.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="fw-semibold">
            {Math.min(currentPage * rowsPerPage, mySavedJobs.length)}
          </span>{" "}
          of <span className="fw-semibold">{mySavedJobs.length}</span> Saved
          Jobs
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
