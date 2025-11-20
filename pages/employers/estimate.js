import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserInquiries,
  getAllEstimates,
  updateInquiryStatus,
} from "@/api/inquiryApi";
import { getuser } from "@/api/auth";
import Layout from "@/components/layout/Layout";
import Swal from "sweetalert2";

const Estimate = () => {
  const dispatch = useDispatch();
  const { inquiries, estimates, loading } = useSelector((state) => state.inquiry);
  const { user } = useSelector((state) => state.auth);

  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) dispatch(getuser());
  }, [dispatch, user]);

  useEffect(() => {
    if (user?.email) {
      dispatch(getUserInquiries(user.email));
      dispatch(getAllEstimates());
    }
  }, [dispatch, user?.email]);

  const handleStatusChange = (inquiryId, action) => {
    const newStatus = action === "accept" ? "Approved" : "Rejected";
    Swal.fire({
      title: `Are you sure you want to ${action} this estimate?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    }).then((res) => {
      if (res.isConfirmed) {
       dispatch(updateInquiryStatus(inquiryId, newStatus, user.email));

      }
    });
  };

  const getEstimateForInquiry = (inquiryId) => {
    return estimates.find((est) => est.inquiry?._id === inquiryId);
  };

  const formatStatusLabel = (status) => {
    switch (status) {
      case "Pending":
        return "Inquiry Pending";
      case "Sent":
        return "Estimate Received";
      case "Approved":
        return "Estimate Approved";
      case "Rejected":
        return "Estimate Rejected";
      default:
        return "Unknown Status";
    }
  };

  const downloadEstimatePDF = (pdfUrl, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    fetch(pdfUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = pdfUrl.split("/").pop() || "estimate.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error("Download failed:", error);
        // Fallback method
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = pdfUrl.split("/").pop() || "estimate.pdf";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  const openModal = (estimate) => {
    setSelectedEstimate(estimate);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEstimate(null);
  };

  return (
    <Layout>
      <div className="min-vh-100 bg-light">
        <div className="container py-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom">
              <h4 className="mb-0 fw-bold text-primary">
                <i className="bi bi-envelope-paper me-2"></i> My Inquiries
              </h4>
            </div>

            <div className="card-body">
              {loading && <div className="text-center py-3">Loading inquiries...</div>}

              {!loading && inquiries.length === 0 && (
                <div className="text-center py-3 text-muted">No inquiries found.</div>
              )}

              {!loading && inquiries.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Inquiry Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Status</th>
                        <th>Estimate</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inquiry) => {
                        const estimate = getEstimateForInquiry(inquiry._id);
                        const formattedStatus = formatStatusLabel(inquiry.status);

                        return (
                          <tr key={inquiry._id}>
                            <td>{inquiry.name}</td>
                            <td>{inquiry.email}</td>
                            <td>{inquiry.mobile_number}</td>
                            <td>
                              <span
                                className={`badge px-3 py-2 ${
                                  inquiry.status === "Approved"
                                    ? "bg-success"
                                    : inquiry.status === "Rejected"
                                    ? "bg-danger"
                                    : inquiry.status === "Sent"
                                    ? "bg-info text-dark"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {formattedStatus}
                              </span>
                            </td>

                            <td>
                              {estimate ? (
                                <div className="d-flex flex-wrap gap-1">
                                  <button
                                    className="btn btn-outline-primary"
                                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                    onClick={() => openModal(estimate)}
                                  >
                                    <i className="bi bi-eye me-1"></i> View
                                  </button>
                                  <button
                                    className="btn btn-outline-success"
                                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                    onClick={(e) => downloadEstimatePDF(estimate.pdfUrl, e)}
                                  >
                                    <i className="bi bi-download me-1"></i> PDF
                                  </button>
                                </div>
                              ) : (
                                <span className="text-muted">Estimate Pending</span>
                              )}
                            </td>

                            <td>
                              {estimate ? (
                                inquiry.status === "Sent" ? (
                                  <div className="d-flex flex-wrap gap-1">
                                    <button
                                      className="btn btn-success"
                                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                      onClick={() => handleStatusChange(inquiry._id, "accept")}
                                    >
                                      <i className="bi bi-check-circle me-1"></i> Accept
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                      onClick={() => handleStatusChange(inquiry._id, "reject")}
                                    >
                                      <i className="bi bi-x-circle me-1"></i> Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-muted">{formattedStatus}</span>
                                )
                              ) : (
                                <span className="text-muted">Awaiting Estimate</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Estimate Modal (React State Based) ===== */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={closeModal}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: '900px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-file-text me-2"></i> Estimate Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {selectedEstimate ? (
                  <>
                    <div className="row g-3 mb-4 p-3 bg-light rounded">
                      <div className="col-md-3 col-6">
                        <small className="text-muted d-block mb-1">Estimate No.</small>
                        <strong className="text-primary">{selectedEstimate.estimateNumber}</strong>
                      </div>
                      <div className="col-md-4 col-6">
                        <small className="text-muted d-block mb-1">Company</small>
                        <strong>
                          {selectedEstimate.company?.companyName ||
                            selectedEstimate.company?.name}
                        </strong>
                      </div>
                      <div className="col-md-3 col-6">
                        <small className="text-muted d-block mb-1">Inquiry By</small>
                        <strong>{selectedEstimate.inquiry?.name}</strong>
                      </div>
                      <div className="col-md-2 col-6">
                        <small className="text-muted d-block mb-1">Date</small>
                        <strong>
                          {new Date(selectedEstimate.estimateDate).toLocaleDateString()}
                        </strong>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 className="text-secondary mb-3">
                        <i className="bi bi-list-ul me-2"></i>Service Items
                      </h6>
                      <div className="table-responsive">
                        <table className="table table-hover table-bordered align-middle">
                          <thead className="table-primary">
                            <tr>
                              <th style={{ width: '30%' }}>Service</th>
                              <th style={{ width: '15%' }}>Type</th>
                              <th className="text-end" style={{ width: '18%' }}>Price (w/o GST)</th>
                              <th className="text-center" style={{ width: '12%' }}>GST %</th>
                              <th className="text-end" style={{ width: '25%' }}>Price (with GST)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedEstimate.items.map((item, i) => (
                              <tr key={i}>
                                <td className="fw-medium">{item.service?.name}</td>
                                <td>
                                  <span className="badge bg-secondary">{item.type}</span>
                                </td>
                                <td className="text-end">
                                  ₹{item.priceWithoutGst.toLocaleString()}
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-info">{item.gstPercent}%</span>
                                </td>
                                <td className="text-end fw-bold text-success">
                                  ₹{item.priceWithGst.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <div style={{ minWidth: '350px' }}>
                        <div className="card border-0 bg-light">
                          <div className="card-body">
                            <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                              <span className="text-muted">Subtotal:</span>
                              <strong>₹{selectedEstimate.subTotal.toLocaleString()}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                              <span className="text-muted">GST Total:</span>
                              <strong className="text-info">₹{selectedEstimate.gstTotal.toLocaleString()}</strong>
                            </div>
                            <div className="d-flex justify-content-between align-items-center bg-primary bg-opacity-10 p-3 rounded">
                              <span className="fw-bold text-primary fs-5">Grand Total:</span>
                              <h5 className="fw-bold text-primary mb-0">
                                ₹{selectedEstimate.grandTotal.toLocaleString()}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-file-x fs-1 d-block mb-3"></i>
                    <p>No estimate selected</p>
                  </div>
                )}
              </div>

              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  <i className="bi bi-x-circle me-2"></i> Close
                </button>
                {selectedEstimate && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => downloadEstimatePDF(selectedEstimate.pdfUrl, e)}
                  >
                    <i className="bi bi-download me-2"></i> Download PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Estimate;