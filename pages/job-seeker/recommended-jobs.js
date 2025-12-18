"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendedJobs, applyJob } from "@/api/job";

export default function RecommendedJobs() {
  const dispatch = useDispatch();
  const { recommendedJobs, loading } = useSelector((state) => state.job);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    dispatch(getRecommendedJobs());
  }, [dispatch]);

  // Pagination calculations using dynamic data
  const totalPages = Math.ceil((recommendedJobs?.length || 0) / rowsPerPage);
  const paginatedJobs =
    recommendedJobs?.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    ) || [];

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [recommendedJobs]);

  const getMatchBadge = (score) => {
    if (score >= 90) {
      return {
        backgroundColor: "#D1FAE5",
        color: "#065F46",
        borderColor: "#A7F3D0",
      };
    } else if (score >= 80) {
      return {
        backgroundColor: "#DBEAFE",
        color: "#1E40AF",
        borderColor: "#BFDBFE",
      };
    } else if (score >= 70) {
      return {
        backgroundColor: "#FEF3C7",
        color: "#92400E",
        borderColor: "#FDE68A",
      };
    } else {
      return {
        backgroundColor: "#F3F4F6",
        color: "#374151",
        borderColor: "#E5E7EB",
      };
    }
  };

  const handleApplyJob = (jobId, jobTitle) => {
    Swal.fire({
      title: `Apply for ${jobTitle}?`,
      text: "Your profile will be submitted for this position.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Apply",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          applyJob(jobId, {
            showSuccess: (msg) => Swal.fire("Applied!", msg, "success"),
            showError: (msg) => Swal.fire("Error", msg, "error"),
          })
        );
        dispatch(getRecommendedJobs());
      }
    });
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="jobs-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
      {/* {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="job-card flex flex-col h-full border rounded-2xl shadow-md p-4 bg-gray-100 animate-pulse"
        >
          <div className="flex-grow">
            <div className="job-card-header mb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="job-meta flex flex-wrap gap-3 mb-3">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-28"></div>
            </div>
            <div className="skills-section mb-3">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-300 rounded w-16"></div>
                ))}
              </div>
            </div>
            <div className="h-16 bg-gray-300 rounded mb-2"></div>
          </div>
          <div className="job-actions flex justify-between pt-3 border-t mt-auto">
            <div className="h-6 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      ))} */}
      loading...
    </div>
  );

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content flex justify-between items-center">
          <div>
            <h1 className="page-title text-2xl font-bold">Recommended Jobs</h1>
            <p className="page-subtitle text-gray-600">
              Jobs matched to your profile and preferences
            </p>
          </div>
          <div className="header-stats text-gray-700">
            <span className="app-count font-medium">
              <span className="count-number">
                {recommendedJobs?.length || 0}
              </span>{" "}
              recommendations
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Jobs List */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job) => {
              const badgeStyle = getMatchBadge(job.recommendationScore || 0);
              const matchScore = job.recommendationScore || 0;

              return (
                <div className="jobs-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                  <div
                    key={job._id}
                    className="job-card flex flex-col h-full border rounded-2xl shadow-md p-4 bg-white hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Content */}
                    <div className="flex-grow">
                      <div className="job-card-header mb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3
                              className="job-title font-semibold text-lg truncate"
                              style={{ textTransform: "uppercase" }}
                            >
                              {job.jobTitle}
                            </h3>
                            <p className="company-name text-sm text-gray-600 truncate">
                              {job.postedBy?.companyName || "Company Name"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="job-meta flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                        <span className="job-meta-item flex items-center gap-1 truncate max-w-[150px]">
                          <i className="bi bi-geo-alt"></i>
                          {job.city}, {job.state}
                        </span>
                        <span className="job-meta-item flex items-center gap-1 truncate max-w-[120px]">
                          <i className="bi bi-briefcase"></i>{" "}
                          {job.jobType?.name}
                        </span>
                        <span className="job-meta-item flex items-center gap-1 truncate max-w-[100px]">
                          <i className="bi bi-cash"></i>{" "}
                          {job?.salary?.range || "Not specified"}
                        </span>
                      </div>

                      {/* Skills - using tags from API data */}
                      {job.tags && job.tags.length > 0 && (
                        <div className="skills-section mb-3">
                          <div className="flex flex-wrap gap-2">
                            {job.tags.slice(0, 4).map((tag, index) => (
                              <span
                                key={index}
                                className="skill-tag px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                            {job.tags.length > 4 && (
                              <span className="skill-tag px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                +{job.tags.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

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
                          __html:
                            job.jobDescription || "No description available.",
                        }}
                      ></p>
                    </div>

                    {/* Actions */}
                    <div className="job-actions flex justify-between pt-3 border-t mt-auto">
                      <Link
                        className="btn-details text-blue-600 hover:underline flex items-center text-sm"
                        href={`/job-seeker/job-details/${job._id}`}
                      >
                        <i className="bi bi-eye me-1"></i> View Details
                      </Link>

                      <button
                        className="btn-details text-blue-600 hover:underline flex items-center text-sm"
                        onClick={() => handleApplyJob(job._id, job.jobTitle)}
                      >
                        <i className="bi bi-send-check me-1"></i> Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="bi bi-briefcase text-5xl"></i>
              </div>
              <p className="text-gray-500 text-lg mb-2">
                No recommended jobs found
              </p>
              <p className="text-gray-400 text-sm">
                Update your profile and skills to get better job recommendations
              </p>
            </div>
          )}

          {/* Pagination - Only show if there are jobs */}
          {paginatedJobs.length > 0 && (
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center px-3 py-3 border-t gap-2 mt-6">
              <div className="text-muted small text-center text-sm-start">
                Showing{" "}
                <span className="fw-semibold">
                  {paginatedJobs.length > 0
                    ? (currentPage - 1) * rowsPerPage + 1
                    : 0}
                </span>{" "}
                to{" "}
                <span className="fw-semibold">
                  {Math.min(currentPage * rowsPerPage, recommendedJobs.length)}
                </span>{" "}
                of <span className="fw-semibold">{recommendedJobs.length}</span>{" "}
                Recommendations
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
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
          )}
        </>
      )}
    </Layout>
  );
}
