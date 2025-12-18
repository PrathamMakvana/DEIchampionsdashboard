import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyUserSettings, updateUserSettings } from "@/api/userSetting";
import Swal from "sweetalert2";
import ChangePasswordForm from "@/components/ChangePassword";

export default function Settings() {
  const dispatch = useDispatch();

  const { data: userSettings, loading } = useSelector(
    (state) => state.userSettings
  );

  const [settings, setSettings] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log("Redux userSettings data:", userSettings);
    console.log("Local settings state:", settings);
    console.log("Loading state:", loading);
  }, [userSettings, settings, loading]);

  // Load settings on component mount
  useEffect(() => {
    dispatch(getMyUserSettings());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    console.log("useEffect triggered - userSettings:", userSettings);

    if (userSettings) {
      console.log("Setting local state from userSettings");

      const newSettings = {
        notifications:
          userSettings.notifications !== undefined
            ? userSettings.notifications
            : true,
        smsAlerts: userSettings.smsAlerts !== undefined
            ? userSettings.smsAlerts
            : true,
        emailAlerts: {
          jobAlerts:
            userSettings.emailAlerts?.jobAlerts !== undefined
              ? userSettings.emailAlerts.jobAlerts
              : true,
          estimateAlerts:
            userSettings.emailAlerts?.estimateAlerts !== undefined
              ? userSettings.emailAlerts.estimateAlerts
              : true,
          invoiceAlerts:
            userSettings.emailAlerts?.invoiceAlerts !== undefined
              ? userSettings.emailAlerts.invoiceAlerts
              : true,
          serviceAlerts:
            userSettings.emailAlerts?.serviceAlerts !== undefined
              ? userSettings.emailAlerts.serviceAlerts
              : true,
          serviceExpiredAlerts:
            userSettings.emailAlerts?.serviceExpiredAlerts !== undefined
              ? userSettings.emailAlerts.serviceExpiredAlerts
              : true,
          jobApplicationAlerts:
            userSettings.emailAlerts?.jobApplicationAlerts !== undefined
              ? userSettings.emailAlerts.jobApplicationAlerts
              : true,
          profileAlerts:
            userSettings.emailAlerts?.profileAlerts !== undefined
              ? userSettings.emailAlerts.profileAlerts
              : true,
        },
      };

      console.log("New settings to set:", newSettings);
      setSettings(newSettings);

      if (initialLoad) {
        setHasUnsavedChanges(false);
        setInitialLoad(false);
      }
    } else {
      console.log("userSettings is null or undefined");
    }
  }, [userSettings, initialLoad]);

  const handleToggle = (key) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: !settings[key] });
    setHasUnsavedChanges(true);
  };

  const handleEmailAlertToggle = (alertKey) => {
    if (!settings) return;

    const updatedEmailAlerts = {
      ...settings.emailAlerts,
      [alertKey]: !settings.emailAlerts[alertKey],
    };

    setSettings({
      ...settings,
      emailAlerts: updatedEmailAlerts,
    });
    setHasUnsavedChanges(true);
  };

  const saveSettings = async () => {
    if (!settings) return;

    // Show confirmation dialog before saving
    const result = await Swal.fire({
      title: "Save Settings?",
      text: "Are you sure you want to save these settings?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    // Prepare payload for API
    const payload = {
      notifications: settings.notifications,
      smsAlerts: settings.smsAlerts,
      emailAlerts: settings.emailAlerts,
    };

    try {
      await dispatch(
        updateUserSettings(payload, {
          showSuccess: (msg) => {
            Swal.fire({
              icon: "success",
              title: "Saved!",
              text: msg || "Settings saved successfully!",
              timer: 2000,
              showConfirmButton: false,
            });
            setHasUnsavedChanges(false);
            setInitialLoad(true);
          },
          showError: (msg) =>
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: msg || "Failed to save settings",
            }),
        })
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An unexpected error occurred",
      });
    }
  };

  // Show loading state while settings are being fetched
  if (loading && !settings) {
    return (
      <Layout breadcrumbTitle="Settings" breadcrumbActive="Settings">
        <div className="row justify-content-center">
          <div className="col-xxl-8 col-xl-12 col-lg-12">
            <div className="section-box">
              <div className="panel-white mb-30">
                <div className="box-padding text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading your settings...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Don't render the form until settings are loaded
  if (!settings) {
    return (
      <Layout breadcrumbTitle="Settings" breadcrumbActive="Settings">
        <div className="row justify-content-center">
          <div className="col-xxl-8 col-xl-12 col-lg-12">
            <div className="section-box">
              <div className="panel-white mb-30">
                <div className="box-padding text-center py-5">
                  <p className="text-muted">
                    Unable to load settings. Please try refreshing the page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbTitle="Settings" breadcrumbActive="Settings">
      <div className="row justify-content-center">
        <div className="col-xxl-12 col-xl-12 col-lg-12">
          {/* Unsaved Changes Alert */}
          {hasUnsavedChanges && (
            <div
              style={{
                background: "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)",
                border: "2px solid #ffc107",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 15px rgba(255, 193, 7, 0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fas fa-exclamation-circle"
                  style={{
                    fontSize: "1.5rem",
                    color: "#856404",
                    marginRight: "12px",
                  }}
                ></i>
                <div>
                  <strong
                    style={{
                      color: "#856404",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Unsaved Changes
                  </strong>
                  <span style={{ color: "#856404", fontSize: "0.9rem" }}>
                    You have unsaved changes. Click "Save Settings" to apply
                    them.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings Section */}
          <div className="section-box">
            <div className="panel-white mb-30">
              <div className="box-padding">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h4 style={{ color: "#2c3e50", marginBottom: 0 }}>
                    Notification Settings
                  </h4>
                  <span
                    style={{
                      backgroundColor: "#17a2b8",
                      color: "white",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    Alerts
                  </span>
                </div>

                <p style={{ color: "#6c757d", marginBottom: "1.5rem" }}>
                  Manage how you receive notifications and alerts
                </p>

                {/* Global Notification Toggles */}
                <div style={{ marginBottom: "2rem" }}>
                  <h6
                    style={{
                      fontWeight: 600,
                      color: "#495057",
                      fontSize: "1.1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    Global Settings
                  </h6>
                  <div
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px",
                        background: "white",
                        borderBottom: "1px solid #e9ecef",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f8f9fa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "16px",
                            color: "white",
                            fontSize: "1.25rem",
                            background: "#007bff",
                          }}
                        >
                          <i className="fas fa-bell"></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h6
                            style={{
                              fontWeight: 600,
                              marginBottom: "4px",
                              color: "#2c3e50",
                            }}
                          >
                            Enable Notifications
                          </h6>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "#6c757d",
                              marginBottom: 0,
                              lineHeight: 1.4,
                            }}
                          >
                            Receive all types of notifications
                          </p>
                        </div>
                      </div>
                      <div style={{ marginLeft: "16px" }}>
                        <label
                          style={{
                            position: "relative",
                            display: "inline-block",
                            width: "60px",
                            height: "34px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={settings.notifications}
                            onChange={() => handleToggle("notifications")}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              cursor: "pointer",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: settings.notifications
                                ? "#007bff"
                                : "#ccc",
                              transition: ".4s",
                              borderRadius: "34px",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                content: '""',
                                height: "26px",
                                width: "26px",
                                left: "4px",
                                bottom: "4px",
                                backgroundColor: "white",
                                transition: ".4s",
                                borderRadius: "50%",
                                transform: settings.notifications
                                  ? "translateX(26px)"
                                  : "translateX(0)",
                              }}
                            ></span>
                          </span>
                        </label>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px",
                        background: "white",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f8f9fa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "16px",
                            color: "white",
                            fontSize: "1.25rem",
                            background: "#28a745",
                          }}
                        >
                          <i className="fas fa-sms"></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h6
                            style={{
                              fontWeight: 600,
                              marginBottom: "4px",
                              color: "#2c3e50",
                            }}
                          >
                            SMS Alerts
                          </h6>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "#6c757d",
                              marginBottom: 0,
                              lineHeight: 1.4,
                            }}
                          >
                            Receive important alerts via SMS
                          </p>
                        </div>
                      </div>
                      <div style={{ marginLeft: "16px" }}>
                        <label
                          style={{
                            position: "relative",
                            display: "inline-block",
                            width: "60px",
                            height: "34px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={settings.smsAlerts}
                            onChange={() => handleToggle("smsAlerts")}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              cursor: "pointer",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: settings.smsAlerts
                                ? "#007bff"
                                : "#ccc",
                              transition: ".4s",
                              borderRadius: "34px",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                content: '""',
                                height: "26px",
                                width: "26px",
                                left: "4px",
                                bottom: "4px",
                                backgroundColor: "white",
                                transition: ".4s",
                                borderRadius: "50%",
                                transform: settings.smsAlerts
                                  ? "translateX(26px)"
                                  : "translateX(0)",
                              }}
                            ></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Alerts Section */}
                <div style={{ marginBottom: "2rem" }}>
                  <h6
                    style={{
                      fontWeight: 600,
                      color: "#495057",
                      fontSize: "1.1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    Email Alerts
                  </h6>
                  <div
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    {[
                      {
                        key: "jobAlerts",
                        title: "Job Alerts",
                        desc: "Notifications about job posts matching your preferences",
                        icon: "briefcase",
                        color: "#ffc107",
                      },
                      {
                        key: "estimateAlerts",
                        title: "Estimate Alerts",
                        desc: "Alerts for estimates sent, overdue, and status changes",
                        icon: "file-invoice-dollar",
                        color: "#17a2b8",
                      },
                      {
                        key: "invoiceAlerts",
                        title: "Invoice Alerts",
                        desc: "Notifications for invoices sent and overdue",
                        icon: "receipt",
                        color: "#dc3545",
                      },
                      {
                        key: "serviceAlerts",
                        title: "Service Alerts",
                        desc: "Notifications for service enable/disable",
                        icon: "cogs",
                        color: "#6c757d",
                      },
                      {
                        key: "serviceExpiredAlerts",
                        title: "Service Expired Alerts",
                        desc: "Alerts when services are about to expire",
                        icon: "clock",
                        color: "#343a40",
                      },
                      {
                        key: "jobApplicationAlerts",
                        title: "Job Application Alerts",
                        desc: "Notifications for new job applications",
                        icon: "user-check",
                        color: "#28a745",
                      },
                      {
                        key: "profileAlerts",
                        title: "Profile Alerts",
                        desc: "Reminders for incomplete profile information",
                        icon: "exclamation-triangle",
                        color: "#ffc107",
                      },
                    ].map((alert, index, array) => (
                      <div
                        key={alert.key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "20px",
                          background: "white",
                          borderBottom:
                            index === array.length - 1
                              ? "none"
                              : "1px solid #e9ecef",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f8f9fa")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "16px",
                              color: "white",
                              fontSize: "1.25rem",
                              background: alert.color,
                            }}
                          >
                            <i className={`fas fa-${alert.icon}`}></i>
                          </div>
                          <div style={{ flex: 1 }}>
                            <h6
                              style={{
                                fontWeight: 600,
                                marginBottom: "4px",
                                color: "#2c3e50",
                              }}
                            >
                              {alert.title}
                            </h6>
                            <p
                              style={{
                                fontSize: "0.875rem",
                                color: "#6c757d",
                                marginBottom: 0,
                                lineHeight: 1.4,
                              }}
                            >
                              {alert.desc}
                            </p>
                          </div>
                        </div>
                        <div style={{ marginLeft: "16px" }}>
                          <label
                            style={{
                              position: "relative",
                              display: "inline-block",
                              width: "60px",
                              height: "34px",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={settings.emailAlerts[alert.key]}
                              onChange={() => handleEmailAlertToggle(alert.key)}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                cursor: "pointer",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: settings.emailAlerts[alert.key]
                                  ? "#007bff"
                                  : "#ccc",
                                transition: ".4s",
                                borderRadius: "34px",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  content: '""',
                                  height: "26px",
                                  width: "26px",
                                  left: "4px",
                                  bottom: "4px",
                                  backgroundColor: "white",
                                  transition: ".4s",
                                  borderRadius: "50%",
                                  transform: settings.emailAlerts[alert.key]
                                    ? "translateX(26px)"
                                    : "translateX(0)",
                                }}
                              ></span>
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button inside Notification Card */}
                <div style={{ textAlign: "center", marginTop: "24px" }}>
                  <button
                    style={{
                      background: hasUnsavedChanges
                        ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                        : "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                      border: "none",
                      padding: "14px 40px",
                      fontWeight: 600,
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                      color: "white",
                      fontSize: "1rem",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.7 : 1,
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onClick={saveSettings}
                    disabled={loading}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = hasUnsavedChanges
                          ? "0 6px 20px rgba(40, 167, 69, 0.4)"
                          : "0 4px 15px rgba(0, 123, 255, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    <i
                      className="fas fa-save"
                      style={{ marginRight: "8px" }}
                    ></i>
                    {loading
                      ? "Saving..."
                      : hasUnsavedChanges
                      ? "Save Changes"
                      : "Save Settings"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Component */}
      <div>
        <ChangePasswordForm />
      </div>
    </Layout>
  );
}