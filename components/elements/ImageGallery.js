import {
  deleteGalleryImage,
  deleteMultipleGalleryImages,
  getGalleryImages,
  uploadGalleryImages,
} from "@/api/imageGallery";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function CompanyImageGallery() {
  const dispatch = useDispatch();
  const { galleryImages, loading } = useSelector((state) => state.gallery);

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const fileInputRef = useRef(null);

  // Toast functions using SweetAlert
  const showSuccess = (msg) =>
    Swal.fire({
      icon: "success",
      title: "Success",
      text: msg,
      timer: 1500,
      showConfirmButton: false,
    });

  const showError = (msg) =>
    Swal.fire({
      icon: "error",
      title: "Error",
      text: msg,
    });

  // Load images on component mount
  useEffect(() => {
    dispatch(getGalleryImages());
  }, [dispatch]);

  // Toggle image selection
  const toggleSelect = (id) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Delete single image with confirmation
  const handleDeleteImage = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Do you really want to delete this image?",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await dispatch(deleteGalleryImage(id, { showSuccess, showError }));
      setSelectedImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Delete all selected images with confirmation
  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `Do you want to delete ${selectedImages.size} selected image(s)?`,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete all!",
    });

    if (result.isConfirmed) {
      const imageIds = Array.from(selectedImages);
      await dispatch(
        deleteMultipleGalleryImages(imageIds, { showSuccess, showError })
      );
      setSelectedImages(new Set());
    }
  };

  // Handle adding new images
  const handleAddImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (galleryImages.length + files.length > 12) {
      showError("Maximum of 12 images allowed. Please remove some first.");
      return;
    }

    // Upload images
    await dispatch(uploadGalleryImages(files, { showSuccess, showError }));

    // Clear file input
    fileInputRef.current.value = "";
  };

  return (
    <div className="upd-pro-card">
      <div className="upd-pro-card-header">
        <i className="bi bi-images me-2"></i> Company Image Gallery
      </div>
      <div className="upd-pro-card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-muted">
            {galleryImages?.length || 0}/12 images
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={() => fileInputRef.current.click()}
              disabled={loading || (galleryImages?.length || 0) >= 12}
            >
              <i className="bi bi-upload me-2"></i>
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteSelected}
              disabled={loading || selectedImages.size === 0}
            >
              <i className="bi bi-trash me-2"></i>
              Delete Selected ({selectedImages.size})
            </button>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleAddImages}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {loading && (
          <div className="text-center mb-3">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {(!galleryImages || galleryImages.length === 0) && !loading ? (
          <div className="text-center py-5">
            <i
              className="bi bi-images"
              style={{ fontSize: "3rem", color: "#ccc" }}
            ></i>
            <p className="text-muted mt-3">
              No images in gallery yet. Upload some images to get started!
            </p>
          </div>
        ) : (
          <div className="row" id="galleryContainer">
            {galleryImages?.map((img) => (
              <div className="col-md-4 col-sm-6 mb-4" key={img._id}>
                <div className="upd-pro-gallery-item">
                  <img
                    src={img.imageUrl}
                    alt={img.altText || "Gallery"}
                    className="upd-pro-gallery-img"
                    onClick={() => toggleSelect(img._id)}
                    style={{
                      border: selectedImages.has(img._id)
                        ? "4px solid #17a2b8"
                        : "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                  />
                  <div className="upd-pro-gallery-overlay">
                    {/* <button
                      type="button"
                      className="upd-pro-gallery-action btn-danger"
                      onClick={() => handleDeleteImage(img._id)}
                      disabled={loading}
                      title="Delete Image"
                    >
                      <i className="bi bi-trash"></i>
                    </button> */}

                    <button
                      type="button"
                      className="upd-pro-gallery-action btn-info"
                      onClick={() => setPreviewImage(img.imageUrl)}
                      title="Preview Image"
                    >
                      <i className="bi bi-arrows-fullscreen"></i>
                    </button>

                    <button
                      type="button"
                      className={`upd-pro-gallery-action ${
                        selectedImages.has(img._id)
                          ? "btn-success"
                          : "btn-secondary"
                      }`}
                      onClick={() => toggleSelect(img._id)}
                      title={
                        selectedImages.has(img._id) ? "Deselect" : "Select"
                      }
                    >
                      <i
                        className={`bi ${
                          selectedImages.has(img._id) ? "bi-check" : "bi-plus"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="upd-pro-modal" onClick={() => setPreviewImage(null)}>
          <span className="upd-pro-modal-close">&times;</span>
          <img
            className="upd-pro-modal-content"
            src={previewImage}
            alt="Preview"
          />
        </div>
      )}

      {/* Styles remain unchanged */}
      <style jsx>{`
        .upd-pro-gallery-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          height: 200px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .upd-pro-gallery-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }
        .upd-pro-gallery-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: all 0.3s ease;
        }
        .upd-pro-gallery-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
        }
        .upd-pro-gallery-item:hover .upd-pro-gallery-overlay {
          opacity: 1;
        }
        .upd-pro-gallery-action {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 5px;
          border: none;
          color: white;
          font-size: 16px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .btn-danger {
          background-color: #dc3545;
        }
        .btn-info {
          background-color: #17a2b8;
        }
        .upd-pro-modal {
          display: flex;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          overflow: auto;
          align-items: center;
          justify-content: center;
        }
        .upd-pro-modal-content {
          max-width: 80%;
          max-height: 80%;
          animation-name: zoom;
          animation-duration: 0.6s;
        }
        @keyframes zoom {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .upd-pro-modal-close {
          position: absolute;
          top: 15px;
          right: 35px;
          color: #f1f1f1;
          font-size: 40px;
          font-weight: bold;
          transition: 0.3s;
          cursor: pointer;
        }
        .upd-pro-modal-close:hover {
          color: #bbb;
        }
        .upd-pro-btn-primary {
          background: #4e54c8;
          color: white;
          padding: 6px 14px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .upd-pro-btn-primary:hover {
          background: #3b40a1;
        }
      `}</style>
    </div>
  );
}
