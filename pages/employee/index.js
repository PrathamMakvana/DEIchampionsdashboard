"use client";
import { getAuthUser, getResendVerifyEmail, getuser } from "@/api/auth";
import Layout from "@/components/layout/Layout";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyApplications,
  getMySavedJobs,
  getRecommendedJobs,
  applyJob,
} from "@/api/job";
import { requestForToken } from "@/utils/firebase";
import { saveFcmToken } from "@/api/notification";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaComments,
  FaHandshake,
  FaUserTie,
  FaTimesCircle,
  FaBookmark,
  FaEnvelope,
  FaExclamationTriangle,
  FaPaperPlane,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { myApplications, mySavedJobs, recommendedJobs, loading } = useSelector(
    (state) => state.job
  );

  // States for recommended jobs pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // Fetch applications, saved jobs, and recommended jobs
  useEffect(() => {
    dispatch(getMyApplications());
    dispatch(getMySavedJobs());
    dispatch(getAuthUser());
    dispatch(getuser());
    dispatch(getRecommendedJobs());
  }, [dispatch]);

  // Pagination calculations for recommended jobs
  const approvedRecommendedJobs =
    recommendedJobs?.filter((job) => job.isApproved === "approved") || [];

  // Pagination calculations using only approved jobs
  const totalPages = Math.ceil(approvedRecommendedJobs.length / rowsPerPage);

  const paginatedJobs = approvedRecommendedJobs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset to first page when recommended jobs data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [recommendedJobs]);

  // FCM Token Registration
  const hasRegisteredFcm = useRef(false);

  useEffect(() => {
    if (hasRegisteredFcm.current) return;
    if (!user?._id) return;

    const registerFcmToken = async () => {
      const token = await requestForToken();
      if (token) {
        await dispatch(
          saveFcmToken(
            {
              fcmToken: token,
              userId: user._id,
              deviceType: "web",
            },
            {
              showSuccess: (msg) => toast.success(msg),
              showError: (msg) => toast.error(msg),
            }
          )
        );
      }
    };

    hasRegisteredFcm.current = true;
    registerFcmToken();
  }, [user?._id]);

  // Compute counts for dashboard cards
  const total = myApplications?.length || 0;
  const savedTotal = mySavedJobs?.length || 0;

  const statusCounts = {
    Pending:
      myApplications?.filter((j) => j.myStatus?.toLowerCase() === "pending")
        .length || 0,
    Accepted:
      myApplications?.filter((j) => j.myStatus?.toLowerCase() === "accepted")
        .length || 0,
    Interviewing:
      myApplications?.filter(
        (j) => j.myStatus?.toLowerCase() === "interviewing"
      ).length || 0,
    Negotiation:
      myApplications?.filter((j) => j.myStatus?.toLowerCase() === "negotiation")
        .length || 0,
    Hired:
      myApplications?.filter((j) => j.myStatus?.toLowerCase() === "hired")
        .length || 0,
    Rejected:
      myApplications?.filter((j) => j.myStatus?.toLowerCase() === "rejected")
        .length || 0,
  };

  // Dashboard cards with Font Awesome icons
  const iconColor = "#007bff";
  const cards = [
    {
      title: "All Applied Applications",
      count: total,
      icon: <FaClipboardList size={40} color={iconColor} />,
      link: `/employee/applied-jobs?filter=${encodeURIComponent(
        "All Applications"
      )}`,
    },
    {
      title: "All Saved Jobs",
      count: savedTotal,
      icon: <FaBookmark size={40} color={iconColor} />,
      link: `/employee/save-jobs`,
    },
    {
      title: "Pending",
      count: statusCounts.Pending,
      icon: <FaClock size={40} color={iconColor} />,
      link: `/employee/applied-jobs?filter=${encodeURIComponent("Pending")}`,
    },
    {
      title: "Accepted",
      count: statusCounts.Accepted,
      icon: <FaCheckCircle size={40} color={iconColor} />,
      link: `/employee/applied-jobs?filter=${encodeURIComponent("Accepted")}`,
    },
    {
      title: "Interviewing",
      count: statusCounts.Interviewing,
      icon: <FaComments size={40} color={iconColor} />,
      link: `/employee/applied-jobs?filter=${encodeURIComponent(
        "Interviewing"
      )}`,
    },
    {
      title: "Negotiation",
      count: statusCounts.Negotiation,
      icon: <FaHandshake size={40} color={iconColor} />,
      link: `/employee/applied-jobs?filter=${encodeURIComponent(
        "Negotiation"
      )}`,
    },
    {
      title: "Hired",
      count: statusCounts.Hired,
      icon: <FaUserTie size={40} color={iconColor} />,
      link: `/employee/applied-jobs?filter=${encodeURIComponent("Hired")}`,
    },
    {
      title: "Rejected",
      count: statusCounts.Rejected,
      icon: <FaTimesCircle size={40} color={iconColor} />,
      link: `/employee/applied-jobs?filter=${encodeURIComponent("Rejected")}`,
    },
  ];

  // Check if email is not verified
  const isEmailNotVerified = useMemo(() => {
    return user && !user.emailVerified;
  }, [user]);

  const handleResendVerification = async () => {
    try {
      const res = await getResendVerifyEmail();
      if (res && res.success) {
        dispatch(getuser());
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "Verification email resent! Please check your inbox.",
          confirmButtonColor: "#007bff",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to resend verification email. Please try again.",
          confirmButtonColor: "#dc3545",
        });
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again later.",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  // Recommended Jobs Functions
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

  // Function to strip HTML tags and truncate text
  const truncateDescription = (html, maxLength = 50) => {
    if (!html) return "No description available.";

    // Remove HTML tags
    const text = html.replace(/<[^>]*>/g, "");

    // Truncate to maxLength characters
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + "...";
  };

  // Loading skeleton component for recommended jobs
  const LoadingSkeleton = () => (
    <div className="jobs-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
      {Array.from({ length: 6 }).map((_, index) => (
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
      ))}
    </div>
  );

  return (
    <Layout breadcrumbTitle="Dashboard" breadcrumbActive="Dashboard">
      {/* Email Verification Banner - Only show if email is not verified */}
      {isEmailNotVerified && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="dash-email-verify-alert alert alert-warning border-0 shadow-lg rounded-3">
              <div className="d-flex align-items-center justify-content-between flex-column flex-md-row">
                <div className="d-flex align-items-center text-center text-md-start mb-3 mb-md-0">
                  <div className="dash-email-verify-icon me-3">
                    <FaExclamationTriangle size={32} className="text-warning" />
                  </div>
                  <div className="dash-email-verify-content">
                    <h4 className="dash-email-verify-title mb-1 fw-bold text-dark">
                      Verify Your Email Address
                    </h4>
                    <p className="dash-email-verify-text mb-0 text-dark">
                      Your email address <strong>{user.email}</strong> is not
                      verified. Please verify your email to access all features
                      and receive important notifications.
                    </p>
                  </div>
                </div>
                <button
                  className="dash-email-verify-btn btn btn-warning btn-lg px-4 py-2 fw-semibold"
                  onClick={handleResendVerification}
                >
                  <FaPaperPlane className="me-2" />
                  Verify Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Jobs Section */}
      <div className="col-xxl-12 col-xl-12 col-lg-12 mt-6">
        <div className="section-box">
          {/* Reduced Height Header */}
          <div
            className="page-header mb-3"
            style={{ minHeight: "auto", padding: "0.5rem 0" }}
          >
            <div className="header-content flex justify-between items-center">
              <div className="">
                <h4 className="page-title  font-bold mb-1 ps-3">
                  Recommended Jobs
                </h4>
                <p className="page-subtitle text-gray-600 text-sm ps-3">
                  Jobs matched to your profile and preferences
                </p>
              </div>
              <div className="header-stats text-gray-700 text-sm">
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
                <div className="jobs-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedJobs.map((job) => {
                    const badgeStyle = getMatchBadge(
                      job.recommendationScore || 0
                    );
                    const matchScore = job.recommendationScore || 0;

                    return (
                      <div
                        key={job._id}
                        className="job-card flex flex-col h-full border rounded-xl shadow-sm p-3 bg-white hover:shadow-md transition-shadow duration-300"
                        style={{ minHeight: "280px" }}
                      >
                        {/* Content */}
                        <div className="flex-grow">
                          <div className="job-card-header mb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 leading-tight">
                                <h3
                                  className="job-title font-semibold text-base uppercase mb-0.5"
                                  style={{ lineHeight: "1.2" }}
                                >
                                  {job.jobTitle}
                                </h3>

                                <p className="company-name text-xs text-gray-600">
                                  {job.postedBy?.companyName || "Company Name"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="job-meta flex flex-wrap gap-3 text-xs text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <i className="bi bi-geo-alt"></i>
                              {job.city}, {job.state}
                            </span>

                            <span className="flex items-center gap-1">
                              <i className="bi bi-briefcase"></i>{" "}
                              {job.jobType?.name}
                            </span>

                            <span className="flex items-center gap-1">
                              <i className="bi bi-cash"></i>{" "}
                              {job?.salary?.range}
                            </span>

                            <span className="flex items-center gap-1">
                              <i className="bi bi-diagram-3"></i>{" "}
                              {job.category?.title}
                            </span>

                            <span className="flex items-center gap-1">
                              <i className="bi bi-grid"></i>{" "}
                              {job.department?.name}
                            </span>

                            <span className="flex items-center gap-1">
                              <i className="bi bi-people"></i>{" "}
                              {job.applicants?.length} Applicants
                            </span>
                          </div>

                          {/* Skills */}
                          {/* {job.tags && job.tags.length > 0 && (
                            <div className="skills-section mb-2">
                              <div className="flex flex-wrap gap-1">
                                {job.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="skill-tag px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {job.tags.length > 3 && (
                                  <span className="skill-tag px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                    +{job.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )} */}

                          {/* Description */}
                          <p
                            className="job-description text-xs text-gray-700 mb-2"
                            style={{
                              flexGrow: "1",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              textOverflow: "ellipsis",
                              lineHeight: "1.4",
                            }}
                          >
                            {truncateDescription(job.jobDescription, 50)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="job-actions flex justify-between pt-2 border-t mt-auto">
                          <Link
                            className="btn-details text-blue-600 hover:underline flex items-center text-xs"
                            href={`/employee/job-details/${job._id}`}
                          >
                            <i className="bi bi-eye me-1"></i> View Details
                          </Link>

                          <button
                            className="btn-details text-blue-600 hover:underline flex items-center text-xs"
                            onClick={() =>
                              handleApplyJob(job._id, job.jobTitle)
                            }
                          >
                            <i className="bi bi-send-check me-1"></i> Apply Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="col-span-3 text-center py-8">
                  <div className="text-gray-400 mb-3">
                    <i className="bi bi-briefcase text-4xl"></i>
                  </div>
                  <p className="text-gray-500 text-base mb-2">
                    No recommended jobs found
                  </p>
                  <p className="text-gray-400 text-sm">
                    Update your profile and skills to get better job
                    recommendations
                  </p>
                </div>
              )}

              {/* Pagination - Only show if there are jobs */}
              {paginatedJobs.length > 0 && (
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center px-2 py-2 border-t gap-2 mt-4">
                  <div className="text-muted small text-center text-sm-start">
                    Showing{" "}
                    <span className="fw-semibold">
                      {paginatedJobs.length > 0
                        ? (currentPage - 1) * rowsPerPage + 1
                        : 0}
                    </span>{" "}
                    to{" "}
                    <span className="fw-semibold">
                      {Math.min(
                        currentPage * rowsPerPage,
                        recommendedJobs.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="fw-semibold">
                      {recommendedJobs.length}
                    </span>{" "}
                    Recommendations
                  </div>

                  <div className="d-flex align-items-center gap-1">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      style={{
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      <FaAngleDoubleLeft size={10} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      style={{
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      <FaAngleLeft size={10} />
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
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      <FaAngleRight size={10} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      style={{
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      <FaAngleDoubleRight size={10} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Custom CSS for Email Verification Components */}
      <style jsx>{`
        .dash-email-verify-alert {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
          border-left: 4px solid #ffc107;
          padding: 1.5rem;
        }

        .dash-email-verify-btn {
          white-space: nowrap;
          flex-shrink: 0;
        }

        .dash-email-verify-content {
          flex: 1;
        }

        @media (max-width: 768px) {
          .dash-email-verify-alert {
            padding: 1.25rem;
          }

          .dash-email-verify-alert .d-flex {
            flex-direction: column;
            text-align: center;
          }

          .dash-email-verify-icon {
            margin-bottom: 1rem;
          }

          .dash-email-verify-btn {
            margin-top: 1rem;
            width: 100%;
          }

          .dash-email-verify-content {
            margin-bottom: 1rem;
          }
        }

        @media (min-width: 769px) {
          .dash-email-verify-alert .d-flex {
            align-items: flex-start;
          }

          .dash-email-verify-content {
            max-width: 600px;
          }
        }
      `}</style>
    </Layout>
  );
}
