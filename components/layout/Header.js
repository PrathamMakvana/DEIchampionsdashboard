import { logoutUser } from "@/api/auth";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNotifications } from "@/hooks/useNotifications";

export default function Header() {
  const [scroll, setScroll] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // ✅ Use Firebase notifications hook
  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationIcon,
    getNotificationColor,
    getTimeAgo,
  } = useNotifications();

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });

  const employee = router.pathname.includes("employee");

  const handleMarkAsReadClick = (notificationId, e) => {
    // Prevent event bubbling
    e.stopPropagation();
    markAsRead(notificationId);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logoutUser());
        router.push("/login");
      }
    });
  };

  return (
    <>
      <header className={`header sticky-bar ${scroll ? "stick" : ""}`}>
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo">
                <Link
                  className="d-flex justify-content-center"
                  href={process.env.NEXT_PUBLIC_FRONTEND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="jobBox"
                    src="/assets/imgs/page/dashboard/logo2.png"
                    style={{ width: "160px", height: "33px" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<span style="font-size: 24px; font-weight: 700; color: #3b82f6;">JobPortal</span>';
                    }}
                  />
                </Link>
              </div>
            </div>
            <div className="header-search d-flex align-items-center gap-3">
              <div
                className="back-arrow d-none d-lg-block"
                onClick={() => router.back()}
              >
                <i className="bi bi-arrow-left"></i>
              </div>
              <div className="box-search">
                <form>
                  <input
                    className="form-control input-search"
                    type="text"
                    name="keyword"
                    placeholder="Search"
                  />
                </form>
              </div>
            </div>
            <div className="header-right">
              <div className="block-signin">
                <Link
                  className="btn btn-default icon-home hover-up me-2"
                  href={process.env.NEXT_PUBLIC_FRONTEND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "white" }}
                >
                  Home
                </Link>

                {!employee && (
                  <Link
                    className="btn btn-default icon-edit hover-up"
                    href="employers/post-job"
                  >
                    Post Job
                  </Link>
                )}

                {/* ✅ Notification Dropdown with Firebase data */}
                <Menu as="div" className="dropdown d-inline-block">
                  <Menu.Button
                    as="a"
                    className="btn btn-notify"
                    style={{ position: "relative" }}
                  >
                    {unreadCount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "3px",
                          right: "8px",
                          backgroundColor: "#ef4444",
                          color: "white",
                          borderRadius: "50%",
                          minWidth: "18px",
                          height: "18px",
                          fontSize: "11px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          padding: "0 5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          animation: "pulse 2s infinite",
                        }}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Menu.Button>
                  <Menu.Items
                    as="div"
                    className="dropdown-menu dropdown-menu-light dropdown-menu-end show"
                    style={{
                      right: "0",
                      left: "auto",
                      width: "400px",
                      maxHeight: "500px",
                      overflowY: "hidden",
                      padding: "0",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      marginTop: "8px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        padding: "20px 24px 16px",
                        borderBottom: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        flexShrink: 0,
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <h6
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "18px",
                              fontWeight: "700",
                              color: "#111827",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            Notifications
                          </h6>
                          <p
                            style={{
                              margin: "0",
                              fontSize: "13px",
                              color: "#6b7280",
                            }}
                          >
                            {loading
                              ? "Loading..."
                              : `You have ${unreadCount} unread notification${
                                  unreadCount !== 1 ? "s" : ""
                                }`}
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              border: "none",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                              padding: "8px 16px",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(102, 126, 234, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(102, 126, 234, 0.3)";
                            }}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notifications List with Scrollbar */}
                    <div
                      style={{
                        overflowY: "auto",
                        overflowX: "hidden",
                        flexGrow: 1,
                        maxHeight: "400px",
                      }}
                      className="notifications-scrollbar"
                    >
                      {loading ? (
                        <div
                          style={{
                            padding: "40px 24px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            className="spinner-border text-primary"
                            role="status"
                            style={{ width: "2rem", height: "2rem" }}
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p style={{ marginTop: "12px", color: "#6b7280" }}>
                            Loading notifications...
                          </p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div
                          style={{
                            padding: "60px 24px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "48px",
                              marginBottom: "16px",
                              opacity: "0.5",
                            }}
                          >
                            🔔
                          </div>
                          <p
                            style={{
                              margin: "0",
                              color: "#6b7280",
                              fontSize: "15px",
                            }}
                          >
                            No notifications yet
                          </p>
                        </div>
                      ) : (
                        <div style={{ padding: "8px 0" }}>
                          {notifications.map((notification, index) => {
                            const icon = getNotificationIcon(notification.type);
                            const color = getNotificationColor(notification.type);
                            const timeAgo = getTimeAgo(notification.createdAt);

                            return (
                              <div
                                key={notification.id}
                                style={{
                                  padding: "14px 24px",
                                  backgroundColor: notification.isRead
                                    ? "transparent"
                                    : "#f0f9ff",
                                  transition: "all 0.2s ease",
                                  position: "relative",
                                  borderLeft: notification.isRead
                                    ? "none"
                                    : `3px solid ${color}`,
                                  borderBottom:
                                    index !== notifications.length - 1
                                      ? "1px solid #f3f4f6"
                                      : "none",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    notification.isRead ? "#f9fafb" : "#e0f2fe";
                                  e.currentTarget.style.paddingLeft = "28px";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    notification.isRead ? "transparent" : "#f0f9ff";
                                  e.currentTarget.style.paddingLeft = "24px";
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "14px",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  {/* Icon Container */}
                                  <div
                                    style={{
                                      flexShrink: "0",
                                      width: "44px",
                                      height: "44px",
                                      borderRadius: "10px",
                                      background: `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "20px",
                                      border: `2px solid ${color}20`,
                                    }}
                                  >
                                    {icon}
                                  </div>

                                  {/* Content */}
                                  <div style={{ flex: "1", minWidth: "0" }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: "6px",
                                        gap: "12px",
                                      }}
                                    >
                                      <h6
                                        style={{
                                          margin: "0",
                                          fontSize: "15px",
                                          fontWeight: "600",
                                          color: "#111827",
                                          lineHeight: "1.4",
                                        }}
                                      >
                                        {notification.title}
                                      </h6>
                                      
                                      {/* Mark as read button for individual notification */}
                                      {!notification.isRead ? (
                                        <button
                                          onClick={(e) => handleMarkAsReadClick(notification.id, e)}
                                          style={{
                                            background: "transparent",
                                            border: `1px solid ${color}40`,
                                            color: color,
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            padding: "4px 10px",
                                            borderRadius: "4px",
                                            transition: "all 0.2s",
                                            flexShrink: 0,
                                            whiteSpace: "nowrap",
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.background = color;
                                            e.currentTarget.style.color = "white";
                                            e.currentTarget.style.borderColor = color;
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.color = color;
                                            e.currentTarget.style.borderColor = `${color}40`;
                                          }}
                                        >
                                          Mark read
                                        </button>
                                      ) : (
                                        <span
                                          style={{
                                            width: "10px",
                                            height: "10px",
                                            backgroundColor: "#10b981",
                                            borderRadius: "50%",
                                            flexShrink: "0",
                                            marginTop: "4px",
                                            boxShadow: "0 0 0 3px #10b98120",
                                          }}
                                          title="Read"
                                        />
                                      )}
                                    </div>
                                    <p
                                      style={{
                                        margin: "0 0 8px 0",
                                        fontSize: "14px",
                                        color: "#4b5563",
                                        lineHeight: "1.5",
                                      }}
                                    >
                                      {notification.message}
                                    </p>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                      }}
                                    >
                                      <svg
                                        style={{
                                          width: "14px",
                                          height: "14px",
                                          fill: "#9ca3af",
                                        }}
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <span
                                        style={{
                                          fontSize: "13px",
                                          color: "#9ca3af",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {timeAgo}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Footer - Removed "View all notifications" button */}
                  </Menu.Items>
                </Menu>

                <div className="member-login">
                  <img
                    alt={user?.name || "User"}
                    src={
                      user?.profilePhotoUrl ||
                      "/assets/imgs/page/dashboard/profile.png"
                    }
                    onError={(e) => {
                      e.target.src = "/assets/imgs/page/dashboard/profile.png";
                    }}
                  />

                  <div className="info-member">
                    <strong className="color-brand-1">
                      {user?.name || user?.companyName || "Steven Jobs"}
                    </strong>

                    {/*
    <Menu as="div" className="dropdown">
      <Menu.Button
        as="a"
        className="font-xs color-text-paragraph-2 icon-down"
      >
        {user?.roleId === 2
          ? "Employer"
          : user?.roleId === 3
          ? "Employee"
          : "Admin"}
      </Menu.Button>

      <Menu.Items
        as="ul"
        className="dropdown-menu dropdown-menu-light dropdown-menu-end show"
        style={{ right: "0", left: "auto" }}
      >
        <li>
          <Link
            className="dropdown-item"
            href={
              employee
                ? "/employee/Profile-details"
                : "/employers/company-details"
            }
          >
            Profile
          </Link>
        </li>
        <li>
          <span
            className="dropdown-item"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            Logout
          </span>
        </li>
      </Menu.Items>
    </Menu>
    */}

                    <span
                      className="font-xs color-text-paragraph-2"
                      style={{ cursor: "default" }}
                    >
                      {user?.roleId === 2
                        ? "Employer"
                        : user?.roleId === 3
                        ? "Employee"
                        : "Admin"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Add pulse animation for badge and custom scrollbar styles */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        /* Custom scrollbar styles */
        .notifications-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .notifications-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .notifications-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          transition: background 0.2s;
        }

        .notifications-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Firefox scrollbar */
        .notifications-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>
    </>
  );
}