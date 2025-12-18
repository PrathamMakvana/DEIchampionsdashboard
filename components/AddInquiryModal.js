import { useEffect, useState } from "react";
import Select from "react-select";
import { getAllServices, createInquiry } from "@/api/inquiryApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2"; // ADD THIS

export default function AddInquiryModal({ user, isOpen, onClose }) {
  const [servicesOptions, setServicesOptions] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getAllServices();
        if (Array.isArray(res)) {
          setServicesOptions(
            res.map((s) => ({
              value: s._id,
              label: s.name,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        toast.error("Failed to fetch services");
      }
    };

    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  if (!isOpen) return null;

const handleSubmit = async (e) => {
  e.preventDefault();
  if (selectedServices.length === 0) {
    toast.error("Please select at least one service");
    return;
  }

  setSubmitting(true);

  try {
    const payload = {
      name: user.name,
      email: user.email,
      mobile_number: user.mobile,
      services: selectedServices.map((s) => s.value),
      pageSource: "dashboard",
    };

    console.log("📤 Submitting inquiry payload:", payload);

    const resultAction = await dispatch(createInquiry(payload));
    
    console.log("📥 Result from dispatch:", resultAction);

    if (resultAction?.success) {
      setSelectedServices([]);
      onClose();
      
      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Inquiry Submitted!",
          text: "Your inquiry has been submitted successfully. We'll get back to you soon.",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }, 300); 
      
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: resultAction?.message || "Failed to submit inquiry",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#667eea",
      });
    }
  } catch (err) {
    console.error("❌ Error submitting inquiry:", err);
    
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: err?.message || "Error submitting inquiry",
      confirmButtonText: "OK",
      confirmButtonColor: "#667eea",
    });
  } finally {
    setSubmitting(false);
  }
};

  const handleClose = () => {
    setSelectedServices([]);
    onClose();
  };

  return (
    <>
      {/* Rest of your modal JSX remains the same */}
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title">
              <i className="bi bi-chat-dots modal-title-icon"></i>
              Add New Inquiry
            </h2>
            <button
              type="button"
              className="modal-close"
              onClick={handleClose}
              disabled={submitting}
            >
              <i className="bi bi-x-lg modal-close-icon"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            {/* Name */}
            <div className="modal-input-group">
              <label className="modal-label">
                <i className="bi bi-person modal-label-icon"></i>
                Name
              </label>
              <div className="modal-input-wrapper">
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="modal-input modal-input-disabled"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="modal-input-group">
              <label className="modal-label">
                <i className="bi bi-envelope modal-label-icon"></i>
                Email Address
              </label>
              <div className="modal-input-wrapper">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="modal-input modal-input-disabled"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="modal-input-group">
              <label className="modal-label">
                <i className="bi bi-phone modal-label-icon"></i>
                Mobile Number
              </label>
              <div className="modal-input-wrapper">
                <input
                  type="text"
                  value={user.mobile}
                  disabled
                  className="modal-input modal-input-disabled"
                  placeholder="9999999999"
                />
              </div>
            </div>

            {/* Services */}
            <div className="modal-input-group">
              <label className="modal-label">
                <i className="bi bi-gear modal-label-icon"></i>
                Select Services
              </label>
              <Select
                isMulti
                options={servicesOptions}
                value={selectedServices}
                onChange={setSelectedServices}
                classNamePrefix="modal-select"
                isDisabled={submitting}
                placeholder="Select one or more services"
                menuPlacement="auto"
                menuPosition="fixed"
                maxMenuHeight={200}
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "0.5rem 1rem",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                    "&:hover": {
                      borderColor: "#667eea",
                    },
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  menu: (base) => ({ 
                    ...base, 
                    zIndex: 9999,
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected 
                      ? "#667eea" 
                      : state.isFocused 
                      ? "#f3f4f6" 
                      : "white",
                    color: state.isSelected ? "white" : "#374151",
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                  }),
                }}
              />
              {selectedServices.length === 0 && (
                <div className="modal-hint">
                  <i className="bi bi-info-circle"></i>
                  Please select at least one service
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="modal-actions">
              <button
                type="submit"
                className="modal-submit"
                disabled={submitting || selectedServices.length === 0}
              >
                {submitting ? (
                  <>
                    <i className="bi bi-arrow-repeat modal-spinner"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-check"></i>
                    Submit Inquiry
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Decorations */}
          <div className="modal-decoration">
            <div className="modal-orb modal-orb-1">
              <i className="bi bi-stars"></i>
            </div>
            <div className="modal-orb modal-orb-2">
              <i className="bi bi-arrow-through-heart"></i>
            </div>
            <div className="modal-orb modal-orb-3">
              <i className="bi bi-flower1"></i>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* All your existing styles remain the same */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 40px 20px;
          animation: modal-fadeIn 0.3s ease-out;
          overflow-y: auto;
        }

        .modal-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 2px;
          position: relative;
          max-width: 500px;
          width: 100%;
          max-height: calc(100vh - 80px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: modal-slideUp 0.4s ease-out;
          margin: 20px auto;
          display: flex;
          flex-direction: column;
        }

        .modal-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          border-radius: 20px;
          pointer-events: none;
        }

        .modal-header {
          background: white;
          border-radius: 18px 18px 0 0;
          padding: 1.5rem 1.5rem 1rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .modal-title-icon {
          font-size: 1.25rem;
        }

        .modal-close {
          position: static;
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.3s ease;
          padding: 0.5rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .modal-close:hover:not(:disabled) {
          color: #374151;
          background: rgba(0, 0, 0, 0.05);
          transform: rotate(90deg);
        }

        .modal-close:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-close-icon {
          line-height: 1;
        }

        .modal-form {
          background: white;
          border-radius: 0 0 18px 18px;
          padding: 1rem 1.5rem 1.5rem;
          position: relative;
          overflow-y: auto;
          max-height: calc(100vh - 200px);
        }

        .modal-input-group {
          margin-bottom: 1.25rem;
        }

        .modal-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
        }

        .modal-label-icon {
          color: #667eea;
          font-size: 0.8rem;
        }

        .modal-input-wrapper {
          position: relative;
        }

        .modal-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          font-family: inherit;
        }

        .modal-input-disabled {
          background-color: #f9fafb;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .modal-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .modal-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .modal-submit {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .modal-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          background: linear-gradient(135deg, #764ba2, #667eea);
        }

        .modal-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .modal-spinner {
          animation: modal-spin 1s linear infinite;
        }

        .modal-decoration {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
          border-radius: 20px;
        }

        .modal-orb {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          animation: modal-float 6s ease-in-out infinite;
        }

        .modal-orb-1 {
          width: 60px;
          height: 60px;
          top: -10px;
          right: -10px;
          animation-delay: 0s;
        }

        .modal-orb-2 {
          width: 50px;
          height: 50px;
          bottom: 30%;
          left: -15px;
          animation-delay: 2s;
          font-size: 1rem;
        }

        .modal-orb-3 {
          width: 40px;
          height: 40px;
          bottom: -5px;
          right: 30%;
          animation-delay: 4s;
          font-size: 0.9rem;
        }

        @keyframes modal-fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modal-slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modal-float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }

        @keyframes modal-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .modal-overlay {
            padding: 20px 10px;
          }

          .modal-container {
            max-height: calc(100vh - 40px);
            margin: 10px auto;
          }

          .modal-header {
            padding: 1.25rem 1.25rem 0.875rem;
          }

          .modal-form {
            padding: 0.875rem 1.25rem 1.25rem;
            max-height: calc(100vh - 160px);
          }

          .modal-title {
            font-size: 1.25rem;
          }

          .modal-input-group {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </>
  );
}