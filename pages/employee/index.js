"use client";
import { getAuthUser, getuser } from "@/api/auth";
import Layout from "@/components/layout/Layout";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyApplications, getMySavedJobs } from "@/api/job";
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
} from "react-icons/fa";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log("🚀user --->", user);
  const { myApplications, mySavedJobs } = useSelector((state) => state.job);

  // Fetch applications & saved jobs
  useEffect(() => {
    dispatch(getMyApplications());
    dispatch(getMySavedJobs());
    dispatch(getAuthUser());
    dispatch(getuser());
  }, [dispatch]);

  // FCM Token Registration
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

  // Compute counts
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

  // Cards with Font Awesome icons
  const iconColor = "#007bff"; // Blue tone
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
                <button className="dash-email-verify-btn btn btn-warning btn-lg px-4 py-2 fw-semibold">
                  <FaPaperPlane className="me-2" />
                  Verify Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Cards Grid */}
      <div className="col-xxl-12 col-xl-12 col-lg-12">
        <div className="section-box">
          <div className="row">
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
                    <p className="color-text-paragraph-2 mb-0">{card.title}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
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
