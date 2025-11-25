"use client";
import { getJobs } from "@/api/job";
import Layout from "@/components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { requestForToken } from "@/utils/firebase";
import { saveFcmToken } from "@/api/notification";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserTie,
  FaCog,
  FaBriefcase,
} from "react-icons/fa";
import { getAuthUser } from "@/api/auth";

export default function EmployerDashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log("🚀user --->", user);
  const { jobs, loading } = useSelector((state) => state.job);

  // Fetch jobs
  useEffect(() => {
    dispatch(getJobs());
    dispatch(getAuthUser());
  }, [dispatch]);

  useEffect(() => {
    const registerFcmToken = async () => {
      const token = await requestForToken();
      if (token && user?._id) {
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
    registerFcmToken();
  }, [user?._id, dispatch]);

  // Compute stats dynamically
  const stats = useMemo(() => {
    if (!jobs || jobs.length === 0) {
      return {
        totalJobs: 0,
        openJobs: 0,
        closedJobs: 0,
        draftJobs: 0,
        totalApplicants: 0,
      };
    }

    const openJobs = jobs.filter((j) => j.status === "open").length;
    const closedJobs = jobs.filter((j) => j.status === "closed").length;
    const draftJobs = jobs.filter((j) => j.status === "draft").length;
    const totalApplicants = jobs.reduce(
      (sum, j) => sum + (j.applicants?.length || 0),
      0
    );

    return {
      totalJobs: jobs.length,
      openJobs,
      closedJobs,
      draftJobs,
      totalApplicants,
    };
  }, [jobs]);

  const iconColor = "#007bff"; // Blue tone

  // Dashboard cards with links - COMMENTED OUT
  // const cards = [
  //   {
  //     title: "All Jobs",
  //     count: stats.totalJobs,
  //     icon: <FaClipboardList size={40} color={iconColor} />,
  //     link: "/employers/manage-jobs",
  //   },
  //   {
  //     title: "Open Jobs",
  //     count: stats.openJobs,
  //     icon: <FaCheckCircle size={40} color={iconColor} />,
  //     link: "/employers/manage-jobs?filter=open",
  //   },
  //   {
  //     title: "Closed Jobs",
  //     count: stats.closedJobs,
  //     icon: <FaTimesCircle size={40} color={iconColor} />,
  //     link: "/employers/manage-jobs?filter=closed",
  //   },
  //   {
  //     title: "Draft Jobs",
  //     count: stats.draftJobs,
  //     icon: <FaClock size={40} color={iconColor} />,
  //     link: "/employers/manage-jobs?filter=draft",
  //   },
  //   {
  //     title: "Total Applicants",
  //     count: stats.totalApplicants,
  //     icon: <FaUserTie size={40} color={iconColor} />,
  //     link: "/employers/manage-jobs",
  //   },
  // ];

  // Get recent 5 jobs sorted by creation date
  const recentJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    return [...jobs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [jobs]);

  // Function to strip HTML tags and truncate text
  const truncateDescription = (html, maxLength = 100) => {
    if (!html) return "No description available.";
    const text = html.replace(/<[^>]*>/g, "");
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { class: "status-active", icon: "bi-check-circle", text: "Open", color: "#10B981", bg: "#D1FAE5" },
      closed: { class: "status-closed", icon: "bi-x-circle", text: "Closed", color: "#EF4444", bg: "#FEE2E2" },
      draft: { class: "status-draft", icon: "bi-file-earmark", text: "Draft", color: "#F59E0B", bg: "#FEF3C7" },
    };
    const config = statusConfig[status] || {
      class: "status-pending",
      icon: "bi-clock",
      text: status,
      color: "#6B7280",
      bg: "#F3F4F6"
    };
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: "500",
          backgroundColor: config.bg,
          color: config.color,
          display: "inline-flex",
          alignItems: "center",
          gap: "4px"
        }}
      >
        <i className={`bi ${config.icon}`}></i>
        {config.text}
      </span>
    );
  };

  // Loading skeleton component for jobs
  const LoadingSkeleton = () => (
    <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(2, 1fr)", marginTop: "1rem" }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.06)",
            padding: "1.5rem",
            backgroundColor: "#F9FAFB"
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ height: "28px", backgroundColor: "#E5E7EB", borderRadius: "6px", width: "75%", marginBottom: "0.75rem" }}></div>
              <div style={{ height: "20px", backgroundColor: "#E5E7EB", borderRadius: "6px", width: "50%" }}></div>
            </div>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0.75rem", 
              marginBottom: "1rem",
              padding: "1rem",
              backgroundColor: "#F3F4F6",
              borderRadius: "12px"
            }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: "18px", backgroundColor: "#E5E7EB", borderRadius: "4px" }}></div>
              ))}
            </div>
            <div style={{ height: "40px", backgroundColor: "#E5E7EB", borderRadius: "6px", marginBottom: "0.75rem" }}></div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "2px solid #E5E7EB", marginTop: "auto" }}>
            <div style={{ flex: 1, height: "38px", backgroundColor: "#E5E7EB", borderRadius: "10px" }}></div>
            <div style={{ flex: 1, height: "38px", backgroundColor: "#E5E7EB", borderRadius: "10px" }}></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Layout breadcrumbTitle="Dashboard" breadcrumbActive="Dashboard">
      <div className="col-xxl-12 col-xl-12 col-lg-12">
        <div className="section-box">
          {loading && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              Loading your dashboard...
            </div>
          )}

          {!loading && (
            <>
              {/* Services Section */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="dash-services-section">
                    <div className="dash-services-header">
                      <div className="dash-services-title">
                        <FaCog className="dash-services-title-icon" />
                        <h3 className="dash-services-title-text">
                          Our Services
                        </h3>
                      </div>
                      <div className="dash-services-subtitle">
                        Professional services offered by your company
                      </div>
                    </div>

                    {user?.services && user.services.length > 0 ? (
                      <div className="dash-services-grid">
                        {user.services.map((service, index) => (
                          <div
                            key={service?._id}
                            className="dash-service-card"
                            style={{
                              animationDelay: `${index * 0.1}s`,
                            }}
                          >
                            <div className="dash-service-card-inner">
                              <div className="dash-service-icon">
                                <FaBriefcase />
                              </div>
                              <div className="dash-service-content">
                                <h4 className="dash-service-name">
                                  {service?.name}
                                </h4>
                                <div className="dash-service-meta">
                                  <span
                                    className={`dash-service-status dash-service-status-${service?.status?.toLowerCase()}`}
                                  >
                                    {service?.status}
                                  </span>
                                  <span className="dash-service-date">
                                    Added:{" "}
                                    {new Date(
                                      service?.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="dash-services-empty">
                        <div className="dash-services-empty-icon">
                          <FaCog />
                        </div>
                        <h4 className="dash-services-empty-title">
                          No Services Added
                        </h4>
                        <p className="dash-services-empty-text">
                          You haven't added any services yet. Start showcasing
                          your company's offerings to attract more candidates.
                        </p>
                        <button className="dash-services-empty-btn">
                          Add Your First Service
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Jobs Section */}
              <div className="row mb-4">
                <div className="col-12">
                  <div style={{ padding: "2rem", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                      {/* <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#EEF2FF", marginBottom: "1rem" }}>
                        <FaBriefcase size={28} color="#4F46E5" />
                      </div> */}
                      <h4 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "0.5rem", color: "#1F2937" }}>
                        Your Latest Jobs
                      </h4>
                      <p style={{ color: "#6B7280", fontSize: "0.95rem", margin: 0 }}>
                        Recently posted job opportunities
                      </p>
                    </div>

                    {/* Jobs List */}
                    {loading ? (
                      <LoadingSkeleton />
                    ) : (
                      <>
                        {recentJobs.length > 0 ? (
                          <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(2, 1fr)" }}>
                            {recentJobs.map((job) => (
                              <div
                                key={job._id}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  border: "1px solid #E5E7EB",
                                  borderRadius: "16px",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.06)",
                                  padding: "1.5rem",
                                  backgroundColor: "#FFFFFF",
                                  transition: "all 0.3s ease",
                                  minHeight: "320px",
                                  position: "relative",
                                  overflow: "hidden"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.12)";
                                  e.currentTarget.style.transform = "translateY(-4px)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.06)";
                                  e.currentTarget.style.transform = "translateY(0)";
                                }}
                              >
                                {/* Decorative corner */}
                                <div style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  width: "80px",
                                  height: "80px",
                                  background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
                                  borderRadius: "0 16px 0 100%",
                                  opacity: 0.5
                                }}></div>

                                {/* Content */}
                                <div style={{ flexGrow: 1, position: "relative", zIndex: 1 }}>
                                  <div style={{ marginBottom: "1rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
                                      <div style={{ flex: 1 }}>
                                        <h3
                                          style={{
                                            fontWeight: "700",
                                            fontSize: "1.25rem",
                                            marginBottom: "0.5rem",
                                            lineHeight: "1.3",
                                            color: "#111827",
                                            letterSpacing: "-0.01em"
                                          }}
                                        >
                                          {job.jobTitle}
                                        </h3>
                                        <p style={{ fontSize: "0.875rem", color: "#6B7280", margin: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                          <i className="bi bi-building" style={{ fontSize: "0.875rem" }}></i>
                                          {job.postedBy?.companyName || "Company Name"}
                                        </p>
                                      </div>
                                      <div>
                                        {getStatusBadge(job.status)}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Meta Info */}
                                  <div style={{ 
                                    display: "grid", 
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gap: "0.75rem", 
                                    fontSize: "0.8rem", 
                                    color: "#6B7280", 
                                    marginBottom: "1rem",
                                    padding: "1rem",
                                    backgroundColor: "#F9FAFB",
                                    borderRadius: "12px"
                                  }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                      <i className="bi bi-geo-alt" style={{ color: "#4F46E5", fontSize: "0.95rem" }}></i>
                                      <span style={{ fontWeight: "500" }}>{job.city}, {job.state}</span>
                                    </span>

                                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                      <i className="bi bi-briefcase" style={{ color: "#4F46E5", fontSize: "0.95rem" }}></i>
                                      <span style={{ fontWeight: "500" }}>{job.jobType?.name}</span>
                                    </span>

                                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                      <i className="bi bi-cash" style={{ color: "#4F46E5", fontSize: "0.95rem" }}></i>
                                      <span style={{ fontWeight: "500" }}>{job?.salary?.range}</span>
                                    </span>

                                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                      <i className="bi bi-people" style={{ color: "#4F46E5", fontSize: "0.95rem" }}></i>
                                      <span style={{ fontWeight: "500" }}>{job.applicants?.length || 0} Applicants</span>
                                    </span>

                                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                      <i className="bi bi-diagram-3" style={{ color: "#4F46E5", fontSize: "0.95rem" }}></i>
                                      <span style={{ fontWeight: "500" }}>{job.category?.title}</span>
                                    </span>

                                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                      <i className="bi bi-calendar" style={{ color: "#4F46E5", fontSize: "0.95rem" }}></i>
                                      <span style={{ fontWeight: "500" }}>{new Date(job.createdAt).toLocaleDateString()}</span>
                                    </span>
                                  </div>

                                  {/* Description */}
                                  <p
                                    style={{
                                      fontSize: "0.875rem",
                                      color: "#4B5563",
                                      marginBottom: "1rem",
                                      lineHeight: "1.6",
                                      overflow: "hidden",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      textOverflow: "ellipsis"
                                    }}
                                  >
                                    {truncateDescription(job.jobDescription, 100)}
                                  </p>
                                </div>

                                {/* Actions */}
                                <div style={{ 
                                  display: "flex", 
                                  gap: "0.75rem",
                                  paddingTop: "1rem", 
                                  borderTop: "2px solid #F3F4F6", 
                                  marginTop: "auto" 
                                }}>
                                  <Link
                                    href={`/employers/manage-job-details?id=${job._id}`}
                                    style={{
                                      flex: 1,
                                      textAlign: "center",
                                      padding: "0.625rem 1rem",
                                      backgroundColor: "#FFFFFF",
                                      color: "#4F46E5",
                                      border: "1.5px solid #4F46E5",
                                      textDecoration: "none",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: "0.5rem",
                                      fontSize: "0.875rem",
                                      fontWeight: "600",
                                      borderRadius: "10px",
                                      transition: "all 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = "#EEF2FF";
                                      e.currentTarget.style.transform = "scale(1.02)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = "#FFFFFF";
                                      e.currentTarget.style.transform = "scale(1)";
                                    }}
                                  >
                                    <i className="bi bi-eye" style={{ fontSize: "1rem" }}></i>
                                    View Details
                                  </Link>

                                  <Link
                                    href={`/employers/post-job?id=${job._id}`}
                                    style={{
                                      flex: 1,
                                      textAlign: "center",
                                      padding: "0.625rem 1rem",
                                      backgroundColor: "#4F46E5",
                                      color: "#FFFFFF",
                                      border: "1.5px solid #4F46E5",
                                      textDecoration: "none",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: "0.5rem",
                                      fontSize: "0.875rem",
                                      fontWeight: "600",
                                      borderRadius: "10px",
                                      transition: "all 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = "#4338CA";
                                      e.currentTarget.style.transform = "scale(1.02)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = "#4F46E5";
                                      e.currentTarget.style.transform = "scale(1)";
                                    }}
                                  >
                                    <i className="bi bi-pencil" style={{ fontSize: "1rem" }}></i>
                                    Edit Job
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
                            <div style={{ 
                              display: "inline-flex", 
                              alignItems: "center", 
                              justifyContent: "center", 
                              width: "100px", 
                              height: "100px", 
                              borderRadius: "50%", 
                              backgroundColor: "#F3F4F6",
                              marginBottom: "1.5rem"
                            }}>
                              <i className="bi bi-briefcase" style={{ fontSize: "3rem", color: "#9CA3AF" }}></i>
                            </div>
                            <h5 style={{ color: "#374151", fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.75rem" }}>
                              No jobs posted yet
                            </h5>
                            <p style={{ color: "#6B7280", fontSize: "0.95rem", marginBottom: "1.5rem", maxWidth: "400px", margin: "0 auto 1.5rem" }}>
                              Start posting jobs to attract talented candidates and grow your team
                            </p>
                            <Link
                              href="/employers/post-job"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.75rem 2rem",
                                backgroundColor: "#4F46E5",
                                color: "#FFFFFF",
                                textDecoration: "none",
                                borderRadius: "12px",
                                fontSize: "0.95rem",
                                fontWeight: "600",
                                boxShadow: "0 4px 6px rgba(79, 70, 229, 0.25)",
                                transition: "all 0.3s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#4338CA";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 12px rgba(79, 70, 229, 0.35)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#4F46E5";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 6px rgba(79, 70, 229, 0.25)";
                              }}
                            >
                              <i className="bi bi-plus-circle" style={{ fontSize: "1.25rem" }}></i>
                              Post Your First Job
                            </Link>
                          </div>
                        )}

                        {/* View All Link */}
                        {recentJobs.length > 0 && (
                          <div style={{ textAlign: "center", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "2px solid #F3F4F6" }}>
                            <Link
                              href="/employers/manage-jobs"
                              style={{
                                color: "#4F46E5",
                                textDecoration: "none",
                                fontSize: "1rem",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.75rem 1.5rem",
                                borderRadius: "10px",
                                transition: "all 0.3s ease",
                                backgroundColor: "#FFFFFF"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#EEF2FF";
                                e.currentTarget.style.transform = "translateX(4px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#FFFFFF";
                                e.currentTarget.style.transform = "translateX(0)";
                              }}
                            >
                              View All Jobs ({stats.totalJobs})
                              <i className="bi bi-arrow-right" style={{ fontSize: "1.25rem" }}></i>
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Cards Section - COMMENTED OUT */}
              {/* <div className="row mb-5">
                {cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-4"
                  >
                    <Link href={card.link}>
                      <div
                        className="card-style-1 hover-up cursor-pointer transition-transform hover:-translate-y-1 text-center d-flex flex-column align-items-center justify-content-center"
                        style={{
                          height: "200px",
                          borderRadius: "12px",
                          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                          padding: "20px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <div className="mb-3">{card.icon}</div>
                        <h3 className="fw-bold mb-1">{card.count}</h3>
                        <p className="color-text-paragraph-2 mb-0">
                          {card.title}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div> */}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}