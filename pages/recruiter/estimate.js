import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { getuser } from "@/api/auth";
import {
  getUserEstimates,
  updateEstimateStatus,
  downloadEstimatePDF,
} from "@/api/estimateApi";
import Swal from "sweetalert2";

const Estimate = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userEstimates, loading } = useSelector((state) => state.estimate);

  const [showModal, setShowModal] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);

  // Load logged-in user
  useEffect(() => {
    if (!user) {
      dispatch(getuser());
    }
  }, [dispatch, user]);

  // Load user estimates
  useEffect(() => {
    if (user?.email) {
      dispatch(getUserEstimates(user.email));
    }
  }, [dispatch, user?.email]);

  const handleStatusUpdate = (estimateId, action) => {
    const newStatus = action === "accept" ? "Approved" : "Rejected";
    const actionText = action === "accept" ? "accept" : "reject";

    Swal.fire({
      title: `Are you sure you want to ${actionText} this estimate?`,
      text: "This action cannot be undone.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: action === "accept" ? "#28a745" : "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Yes, ${actionText}`,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateEstimateStatus(estimateId, newStatus, user.email));
      }
    });
  };

  const openModal = (estimate) => {
    setSelectedEstimate(estimate);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedEstimate(null);
    setShowModal(false);
  };

  // Only show received estimates
  const receivedEstimates = userEstimates || [];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-success";
      case "Rejected":
        return "bg-danger";
      case "Sent":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="min-vh-100 bg-light">
        <div className="container py-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom">
              <h4 className="mb-0 fw-bold text-primary">
                <i className="bi bi-file-earmark-text me-2"></i> Received
                Estimates
              </h4>
              <p className="text-muted mb-0 mt-1">
                View and manage estimates sent to you
              </p>
            </div>

            <div className="card-body">
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary"></div>
                  <p className="mt-2 text-muted">Loading your estimates...</p>
                </div>
              )}

              {!loading && receivedEstimates.length === 0 && (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox display-4 d-block mb-3"></i>
                  <h5>No estimates received yet</h5>
                </div>
              )}

              {!loading && receivedEstimates.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Estimate No.</th>
                        <th>Valid Until</th>
                        <th>Grand Total</th>
                        <th>Status</th>
                        <th>PDF</th>
                        <th>View</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {receivedEstimates.map((estimate) => (
                        <tr key={estimate._id}>
                          <td>
                            <strong className="text-primary">
                              {estimate.estimateNumber}
                            </strong>
                          </td>

                          <td>{formatDate(estimate.validUntil)}</td>

                          <td>
                            <strong>
                              ₹{estimate.grandTotal?.toLocaleString()}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`badge px-2 py-1 ${getStatusBadgeClass(
                                estimate.estimateStatus
                              )}`}
                            >
                              {estimate.estimateStatus}
                            </span>
                          </td>

                          <td>
                            <button
                              className="btn btn-outline-secondary btn-sm px-2 py-1"
                              onClick={(e) =>
                                downloadEstimatePDF(estimate.pdfUrl, e)
                              }
                            >
                              <i className="bi bi-download me-1"></i> Download
                            </button>
                          </td>

                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm px-2 py-1"
                              onClick={() => openModal(estimate)}
                            >
                              <i className="bi bi-eye me-1"></i> View
                            </button>
                          </td>

                          <td>
                            <div className="d-flex  gap-2">
                              <button
                                className="btn btn-success btn-sm px-2 py-1"
                                disabled={estimate.estimateStatus !== "Sent"} // ⛔ Disable if not Sent
                                onClick={() =>
                                  estimate.estimateStatus === "Sent" &&
                                  handleStatusUpdate(estimate._id, "accept")
                                }
                              >
                                <i className="bi bi-check-circle me-1"></i>{" "}
                                Accept
                              </button>

                              <button
                                className="btn btn-danger btn-sm px-2 py-1"
                                disabled={estimate.estimateStatus !== "Sent"} // ⛔ Disable if not Sent
                                onClick={() =>
                                  estimate.estimateStatus === "Sent" &&
                                  handleStatusUpdate(estimate._id, "reject")
                                }
                              >
                                <i className="bi bi-x-circle me-1"></i> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- MODAL ---------- */}
      {showModal && selectedEstimate && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.55)" }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  Estimate #{selectedEstimate.estimateNumber}
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={closeModal}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold">Company Details</h6>
                    <p className="mb-1">
                      <strong>Name:</strong>{" "}
                      {selectedEstimate.company?.companyName}
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong> {selectedEstimate.company?.email}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold">Estimate Info</h6>
                    <p className="mb-1">
                      <strong>Date:</strong>{" "}
                      {formatDate(selectedEstimate.estimateDate)}
                    </p>
                    <p className="mb-0">
                      <strong>Valid Until:</strong>{" "}
                      {formatDate(selectedEstimate.validUntil)}
                    </p>
                  </div>
                </div>

                <h6 className="fw-bold mb-3">Service Items</h6>

                <div className="table-responsive">
                  <table className="table table-bordered table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Service</th>
                        <th>Type</th>
                        <th>Price (excl. GST)</th>
                        <th>GST %</th>
                        <th>Price (incl. GST)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEstimate.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.service?.name}</td>
                          <td>
                            <span
                              className={`badge ${
                                item.type === "recurring"
                                  ? "bg-info"
                                  : "bg-secondary"
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td>₹{item.priceWithoutGst}</td>
                          <td>{item.gstPercent}%</td>
                          <td>₹{item.priceWithGst}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="row mt-4">
                  <div className="col-md-6 offset-md-6">
                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <strong>Subtotal:</strong>
                        <span>₹{selectedEstimate.subTotal}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <strong>GST Total:</strong>
                        <span>₹{selectedEstimate.gstTotal}</span>
                      </div>
                      <div className="d-flex justify-content-between fs-5 text-primary">
                        <strong>Grand Total:</strong>
                        <strong>₹{selectedEstimate.grandTotal}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Estimate;
