import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyUserSettings, updateUserSettings } from "@/api/userSetting";
import Swal from 'sweetalert2';

export default function Settings() {
  const dispatch = useDispatch();
  
  // FIX: Access the data property from userSettings slice
  const { data: userSettings, loading } = useSelector((state) => state.userSettings);
  
  const [settings, setSettings] = useState(null);
  const [showPublicModeConfirm, setShowPublicModeConfirm] = useState(false);
  const [pendingPrivacyMode, setPendingPrivacyMode] = useState(null);
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
        privacyMode: userSettings.privacyMode || "selective",
        notifications: userSettings.notifications !== undefined ? userSettings.notifications : true,
        smsAlerts: userSettings.smsAlerts || true,
        emailAlerts: {
          jobAlerts: userSettings.emailAlerts?.jobAlerts !== undefined ? userSettings.emailAlerts.jobAlerts : true,
          estimateAlerts: userSettings.emailAlerts?.estimateAlerts !== undefined ? userSettings.emailAlerts.estimateAlerts : true,
          invoiceAlerts: userSettings.emailAlerts?.invoiceAlerts !== undefined ? userSettings.emailAlerts.invoiceAlerts : true,
          serviceAlerts: userSettings.emailAlerts?.serviceAlerts !== undefined ? userSettings.emailAlerts.serviceAlerts : true,
          serviceExpiredAlerts: userSettings.emailAlerts?.serviceExpiredAlerts !== undefined ? userSettings.emailAlerts.serviceExpiredAlerts : true,
          jobApplicationAlerts: userSettings.emailAlerts?.jobApplicationAlerts !== undefined ? userSettings.emailAlerts.jobApplicationAlerts : true,
          profileAlerts: userSettings.emailAlerts?.profileAlerts !== undefined ? userSettings.emailAlerts.profileAlerts : true,
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

  const handlePrivacyChange = (mode) => {
    if (!settings) return;
    
    // Show confirmation only when switching to public mode
    if (mode === "public" && settings.privacyMode !== "public") {
      setPendingPrivacyMode(mode);
      setShowPublicModeConfirm(true);
      return;
    }
    
    // For private and selective modes, update state immediately (no API call)
    setSettings({ ...settings, privacyMode: mode });
    setHasUnsavedChanges(true);
  };

  const confirmPublicMode = () => {
    if (pendingPrivacyMode && settings) {
      setSettings({ ...settings, privacyMode: pendingPrivacyMode });
      setHasUnsavedChanges(true);
    }
    setShowPublicModeConfirm(false);
    setPendingPrivacyMode(null);
  };

  const cancelPublicMode = () => {
    setShowPublicModeConfirm(false);
    setPendingPrivacyMode(null);
  };

  const handleToggle = (key) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: !settings[key] });
    setHasUnsavedChanges(true);
  };

  const handleEmailAlertToggle = (alertKey) => {
    if (!settings) return;
    
    const updatedEmailAlerts = {
      ...settings.emailAlerts,
      [alertKey]: !settings.emailAlerts[alertKey]
    };
    
    setSettings({
      ...settings,
      emailAlerts: updatedEmailAlerts
    });
    setHasUnsavedChanges(true);
  };

  const saveSettings = async () => {
    if (!settings) return;

    // Show confirmation dialog before saving
    const result = await Swal.fire({
      title: 'Save Settings?',
      text: 'Are you sure you want to save these settings?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    // Prepare payload for API
    const payload = {
      privacyMode: settings.privacyMode,
      notifications: settings.notifications,
      smsAlerts: settings.smsAlerts,
      emailAlerts: settings.emailAlerts
    };

    try {
      // Use updateUserSettings which will handle both create and update
      await dispatch(updateUserSettings(payload, {
        showSuccess: (msg) => {
          Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: msg || 'Settings saved successfully!',
            timer: 2000,
            showConfirmButton: false
          });
          setHasUnsavedChanges(false);
          setInitialLoad(true); // Reset initial load flag to prevent flickering
        },
        showError: (msg) => Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: msg || 'Failed to save settings'
        })
      }));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An unexpected error occurred'
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
                  <p className="text-muted">Unable to load settings. Please try refreshing the page.</p>
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
      {/* Public Mode Confirmation Modal */}
      {showPublicModeConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                fontSize: '3rem',
                color: '#ffc107',
                marginBottom: '1rem'
              }}>
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
                Confirm Public Mode
              </h4>
              <p style={{ color: '#6c757d', lineHeight: 1.6 }}>
                You are about to make your diversity information visible to all employers. 
                This means any employer on the platform will be able to view your professional 
                profile and category information.
              </p>
              <p style={{ color: '#dc3545', fontWeight: 600, marginTop: '1rem' }}>
                Remember to click "Save Settings" to apply these changes.
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginTop: '2rem'
            }}>
              <button
                onClick={cancelPublicMode}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #6c757d',
                  background: 'transparent',
                  color: '#6c757d',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#6c757d';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6c757d';
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmPublicMode}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Confirm Public Mode
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-xxl-8 col-xl-12 col-lg-12">
          {/* Unsaved Changes Alert */}
          {hasUnsavedChanges && (
            <div style={{
              background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
              border: '2px solid #ffc107',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 15px rgba(255, 193, 7, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: '1.5rem', color: '#856404', marginRight: '12px' }}></i>
                <div>
                  <strong style={{ color: '#856404', display: 'block', marginBottom: '4px' }}>Unsaved Changes</strong>
                  <span style={{ color: '#856404', fontSize: '0.9rem' }}>You have unsaved changes. Click "Save Settings" to apply them.</span>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings Section */}
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
                  <h5 style={{ color: "#2c3e50", marginBottom: 0 }}>
                    Control who can view your professional profile and category information
                  </h5>
                  <span
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    Account
                  </span>
                </div>

                <div className="privacy-options">
                  <div className="row">
                    {/* PRIVATE MODE */}
                    <div className="col-md-4 mb-3">
                      <div
                        style={{
                          border: `2px solid ${
                            settings.privacyMode === "private" ? "#007bff" : "#e9ecef"
                          }`,
                          borderRadius: "12px",
                          padding: "24px",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          background:
                            settings.privacyMode === "private"
                              ? "linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)"
                              : "white",
                          position: "relative",
                        }}
                        onClick={() => handlePrivacyChange("private")}
                        onMouseEnter={(e) => {
                          if (settings.privacyMode !== "private") {
                            e.currentTarget.style.borderColor = "#007bff";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 15px rgba(0, 0, 0, 0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (settings.privacyMode !== "private") {
                            e.currentTarget.style.borderColor = "#e9ecef";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        {settings.privacyMode === "private" && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: '#007bff',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="fas fa-check" style={{ fontSize: '12px' }}></i>
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: "2.5rem",
                            color:
                              settings.privacyMode === "private"
                                ? "#007bff"
                                : "#6c757d",
                            marginBottom: "16px",
                          }}
                        >
                          <i className="fas fa-lock"></i>
                        </div>

                        <h6 style={{ fontWeight: 600, marginBottom: "8px", color: "#2c3e50" }}>
                          Private
                        </h6>

                        <p style={{ fontSize: "0.9rem", color: "#6c757d", minHeight: "50px" }}>
                          Your diversity details stay hidden from all employers.  
                        </p>

                        <div style={{ marginTop: "16px" }}>
                          <input
                            type="radio"
                            name="privacyMode"
                            checked={settings.privacyMode === "private"}
                            onChange={() => {}}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SELECTIVE MODE */}
                    <div className="col-md-4 mb-3">
                      <div
                        style={{
                          border: `2px solid ${
                            settings.privacyMode === "selective" ? "#007bff" : "#e9ecef"
                          }`,
                          borderRadius: "12px",
                          padding: "24px",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          background:
                            settings.privacyMode === "selective"
                              ? "linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)"
                              : "white",
                          position: "relative",
                        }}
                        onClick={() => handlePrivacyChange("selective")}
                        onMouseEnter={(e) => {
                          if (settings.privacyMode !== "selective") {
                            e.currentTarget.style.borderColor = "#007bff";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 15px rgba(0, 0, 0, 0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (settings.privacyMode !== "selective") {
                            e.currentTarget.style.borderColor = "#e9ecef";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        {settings.privacyMode === "selective" && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: '#007bff',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="fas fa-check" style={{ fontSize: '12px' }}></i>
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: "2.5rem",
                            color:
                              settings.privacyMode === "selective"
                                ? "#007bff"
                                : "#6c757d",
                            marginBottom: "16px",
                          }}
                        >
                          <i className="fas fa-users"></i>
                        </div>

                        <h6 style={{ fontWeight: 600, marginBottom: "8px", color: "#2c3e50" }}>
                          Selective
                        </h6>

                        <p style={{ fontSize: "0.9rem", color: "#6c757d", minHeight: "50px" }}>
                          Visible only to verified inclusive employers.  
                        </p>

                        <div style={{ marginTop: "16px" }}>
                          <input
                            type="radio"
                            name="privacyMode"
                            checked={settings.privacyMode === "selective"}
                            onChange={() => {}}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* PUBLIC MODE */}
                    <div className="col-md-4 mb-3">
                      <div
                        style={{
                          border: `2px solid ${
                            settings.privacyMode === "public" ? "#007bff" : "#e9ecef"
                          }`,
                          borderRadius: "12px",
                          padding: "24px",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          background:
                            settings.privacyMode === "public"
                              ? "linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)"
                              : "white",
                          position: "relative",
                        }}
                        onClick={() => handlePrivacyChange("public")}
                        onMouseEnter={(e) => {
                          if (settings.privacyMode !== "public") {
                            e.currentTarget.style.borderColor = "#007bff";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 15px rgba(0, 0, 0, 0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (settings.privacyMode !== "public") {
                            e.currentTarget.style.borderColor = "#e9ecef";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        {settings.privacyMode === "public" && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: '#007bff',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="fas fa-check" style={{ fontSize: '12px' }}></i>
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: "2.5rem",
                            color:
                              settings.privacyMode === "public"
                                ? "#007bff"
                                : "#6c757d",
                            marginBottom: "16px",
                          }}
                        >
                          <i className="fas fa-globe"></i>
                        </div>

                        <h6 style={{ fontWeight: 600, marginBottom: "8px", color: "#2c3e50" }}>
                          Public
                        </h6>

                        <p style={{ fontSize: "0.9rem", color: "#6c757d", minHeight: "50px" }}>
                          Your diversity info is visible to all employers.
                        </p>

                        <div style={{ marginTop: "16px" }}>
                          <input
                            type="radio"
                            name="privacyMode"
                            checked={settings.privacyMode === "public"}
                            onChange={() => {}}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings Section */}
            <div className="panel-white mb-30">
              <div className="box-padding">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#2c3e50', marginBottom: 0 }}>Notification Settings</h4>
                  <span style={{ backgroundColor: '#17a2b8', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>Alerts</span>
                </div>
                
                <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
                  Manage how you receive notifications and alerts
                </p>

                {/* Global Notification Toggles */}
                <div style={{ marginBottom: '2rem' }}>
                  <h6 style={{ fontWeight: 600, color: '#495057', fontSize: '1.1rem', marginBottom: '1rem' }}>Global Settings</h6>
                  <div style={{ background: '#f8f9fa', borderRadius: '12px', overflow: 'hidden' }}>
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px',
                        background: 'white',
                        borderBottom: '1px solid #e9ecef',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', color: 'white', fontSize: '1.25rem', background: '#007bff' }}>
                          <i className="fas fa-bell"></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h6 style={{ fontWeight: 600, marginBottom: '4px', color: '#2c3e50' }}>Enable Notifications</h6>
                          <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: 0, lineHeight: 1.4 }}>
                            Receive all types of notifications
                          </p>
                        </div>
                      </div>
                      <div style={{ marginLeft: '16px' }}>
                        <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                          <input 
                            type="checkbox" 
                            checked={settings.notifications}
                            onChange={() => handleToggle('notifications')}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: settings.notifications ? '#007bff' : '#ccc',
                            transition: '.4s',
                            borderRadius: '34px'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '""',
                              height: '26px',
                              width: '26px',
                              left: '4px',
                              bottom: '4px',
                              backgroundColor: 'white',
                              transition: '.4s',
                              borderRadius: '50%',
                              transform: settings.notifications ? 'translateX(26px)' : 'translateX(0)'
                            }}></span>
                          </span>
                        </label>
                      </div>
                    </div>

                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px',
                        background: 'white',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', color: 'white', fontSize: '1.25rem', background: '#28a745' }}>
                          <i className="fas fa-sms"></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h6 style={{ fontWeight: 600, marginBottom: '4px', color: '#2c3e50' }}>SMS Alerts</h6>
                          <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: 0, lineHeight: 1.4 }}>
                            Receive important alerts via SMS
                          </p>
                        </div>
                      </div>
                      <div style={{ marginLeft: '16px' }}>
                        <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                          <input 
                            type="checkbox" 
                            checked={settings.smsAlerts}
                            onChange={() => handleToggle('smsAlerts')}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: settings.smsAlerts ? '#007bff' : '#ccc',
                            transition: '.4s',
                            borderRadius: '34px'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '""',
                              height: '26px',
                              width: '26px',
                              left: '4px',
                              bottom: '4px',
                              backgroundColor: 'white',
                              transition: '.4s',
                              borderRadius: '50%',
                              transform: settings.smsAlerts ? 'translateX(26px)' : 'translateX(0)'
                            }}></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Alerts Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <h6 style={{ fontWeight: 600, color: '#495057', fontSize: '1.1rem', marginBottom: '1rem' }}>Email Alerts</h6>
                  <div style={{ background: '#f8f9fa', borderRadius: '12px', overflow: 'hidden' }}>
                    {[
                      { key: 'jobAlerts', title: 'Job Alerts', desc: 'Notifications about job posts matching your preferences', icon: 'briefcase', color: '#ffc107' },
                      { key: 'estimateAlerts', title: 'Estimate Alerts', desc: 'Alerts for estimates sent, overdue, and status changes', icon: 'file-invoice-dollar', color: '#17a2b8' },
                      { key: 'invoiceAlerts', title: 'Invoice Alerts', desc: 'Notifications for invoices sent and overdue', icon: 'receipt', color: '#dc3545' },
                      { key: 'serviceAlerts', title: 'Service Alerts', desc: 'Notifications for service enable/disable', icon: 'cogs', color: '#6c757d' },
                      { key: 'serviceExpiredAlerts', title: 'Service Expired Alerts', desc: 'Alerts when services are about to expire', icon: 'clock', color: '#343a40' },
                      { key: 'jobApplicationAlerts', title: 'Job Application Alerts', desc: 'Notifications for new job applications', icon: 'user-check', color: '#28a745' },
                      { key: 'profileAlerts', title: 'Profile Alerts', desc: 'Reminders for incomplete profile information', icon: 'exclamation-triangle', color: '#ffc107' }
                    ].map((alert, index, array) => (
                      <div 
                        key={alert.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '20px',
                          background: 'white',
                          borderBottom: index === array.length - 1 ? 'none' : '1px solid #e9ecef',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', color: 'white', fontSize: '1.25rem', background: alert.color }}>
                            <i className={`fas fa-${alert.icon}`}></i>
                          </div>
                          <div style={{ flex: 1 }}>
                            <h6 style={{ fontWeight: 600, marginBottom: '4px', color: '#2c3e50' }}>{alert.title}</h6>
                            <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: 0, lineHeight: 1.4 }}>
                              {alert.desc}
                            </p>
                          </div>
                        </div>
                        <div style={{ marginLeft: '16px' }}>
                          <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                            <input 
                              type="checkbox" 
                              checked={settings.emailAlerts[alert.key]}
                              onChange={() => handleEmailAlertToggle(alert.key)}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                              position: 'absolute',
                              cursor: 'pointer',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: settings.emailAlerts[alert.key] ? '#007bff' : '#ccc',
                              transition: '.4s',
                              borderRadius: '34px'
                            }}>
                              <span style={{
                                position: 'absolute',
                                content: '""',
                                height: '26px',
                                width: '26px',
                                left: '4px',
                                bottom: '4px',
                                backgroundColor: 'white',
                                transition: '.4s',
                                borderRadius: '50%',
                                transform: settings.emailAlerts[alert.key] ? 'translateX(26px)' : 'translateX(0)'
                              }}></span>
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button inside Notification Card */}
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <button 
                    style={{
                      background: hasUnsavedChanges 
                        ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
                        : 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                      border: 'none',
                      padding: '14px 40px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      color: 'white',
                      fontSize: '1rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={saveSettings}
                    disabled={loading}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = hasUnsavedChanges 
                          ? '0 6px 20px rgba(40, 167, 69, 0.4)' 
                          : '0 4px 15px rgba(0, 123, 255, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                    {loading ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}