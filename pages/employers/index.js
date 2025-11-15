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

  // Register FCM token
  useEffect(() => {
    const registerFcmToken = async () => {
      const token = await requestForToken();
      if (token && user?._id) {
        await dispatch(
          saveFcmToken(
            { fcmToken: token, userId: user._id },
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

  // Dashboard cards with links
  const cards = [
    {
      title: "All Jobs",
      count: stats.totalJobs,
      icon: <FaClipboardList size={40} color={iconColor} />,
      link: "/employers/manage-jobs",
    },
    {
      title: "Open Jobs",
      count: stats.openJobs,
      icon: <FaCheckCircle size={40} color={iconColor} />,
      link: "/employers/manage-jobs?filter=open",
    },
    {
      title: "Closed Jobs",
      count: stats.closedJobs,
      icon: <FaTimesCircle size={40} color={iconColor} />,
      link: "/employers/manage-jobs?filter=closed",
    },
    {
      title: "Draft Jobs",
      count: stats.draftJobs,
      icon: <FaClock size={40} color={iconColor} />,
      link: "/employers/manage-jobs?filter=draft",
    },
    {
      title: "Total Applicants",
      count: stats.totalApplicants,
      icon: <FaUserTie size={40} color={iconColor} />,
      link: "/employers/manage-jobs",
    },
  ];

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
                            key={service._id}
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
                                  {service.name}
                                </h4>
                                <div className="dash-service-meta">
                                  <span
                                    className={`dash-service-status dash-service-status-${service.status.toLowerCase()}`}
                                  >
                                    {service.status}
                                  </span>
                                  <span className="dash-service-date">
                                    Added:{" "}
                                    {new Date(
                                      service.createdAt
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
              {/* Stats Cards Section */}
              <div className="row mb-5">
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
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
