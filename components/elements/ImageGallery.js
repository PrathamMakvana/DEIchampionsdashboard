import { useState, useRef } from "react";

export default function CompanyImageGallery() {
  const [images, setImages] = useState([
    {
      id: 1,
      src: "../assets/imgs/page/profile/img-profile.png",
      selected: true,
    },
    {
      id: 2,
      src: "../assets/imgs/page/profile/img-profile.png",
      selected: false,
    },
    {
      id: 3,
      src: "../assets/imgs/page/profile/img-profile.png",
      selected: false,
    },
  ]);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Handle adding new images
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > 12) {
      alert("Maximum of 12 images allowed. Please remove some first.");
      return;
    }

    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      src: URL.createObjectURL(file),
      file,
      selected: false,
    }));

    setImages((prev) => [...prev, ...newImages]);
    fileInputRef.current.value = ""; // clear file input
  };

  // Toggle image selection
  const toggleSelect = (id) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  };

  // Delete single image
  const deleteImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Delete all selected images
  const deleteSelected = () => {
    setImages((prev) => prev.filter((img) => !img.selected));
  };

  // Submit to API (placeholder)
  const handleSubmit = async () => {
    const uploadFiles = images.filter((img) => img.file).map((img) => img.file);

    if (!uploadFiles.length) {
      alert("No new images to upload.");
      return;
    }

    const formData = new FormData();
    uploadFiles.forEach((file) => formData.append("galleryImages", file));

    try {
      const res = await fetch("/api/upload-gallery", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      alert("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading images");
    }
  };

  return (
    <div className="upd-pro-card">
      <div className="upd-pro-card-header">
        <i className="bi bi-images me-2"></i> Company Image Gallery
      </div>
      <div className="upd-pro-card-body">
        <div className="d-flex justify-content-end items-center mb-4">
          <div>
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={() => fileInputRef.current.click()}
            >
              <i className="bi bi-upload me-2"></i> Upload
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={deleteSelected}
              disabled={!images.some((img) => img.selected)}
            >
              <i className="bi bi-trash me-2"></i> Delete Selected
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

        <div className="row" id="galleryContainer">
          {images.map((img) => (
            <div className="col-md-4 col-sm-6 mb-4" key={img.id}>
              <div className="upd-pro-gallery-item">
                <img
                  src={img.src}
                  alt="Gallery"
                  className="upd-pro-gallery-img"
                  onClick={() => toggleSelect(img.id)}
                  style={{
                    border: img.selected ? "4px solid #17a2b8" : "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    objectFit: "fill",
                  }}
                />
                <div className="upd-pro-gallery-overlay">
                  <button
                    type="button"
                    className="upd-pro-gallery-action btn-danger"
                    onClick={() => deleteImage(img.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>

                  <button
                    type="button"
                    className="upd-pro-gallery-action btn-info"
                    onClick={() => setPreviewImage(img.src)}
                  >
                    <i className="bi bi-arrows-fullscreen"></i>
                  </button>

                  <button
                    type="button"
                    className={`upd-pro-gallery-action ${
                      img.selected ? "btn-success" : "btn-secondary"
                    }`}
                    onClick={() => toggleSelect(img.id)}
                  >
                    <i
                      className={`bi ${img.selected ? "bi-check" : "bi-plus"}`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-3">
          <button className="btn btn-primary" onClick={handleSubmit}>
            <i className="bi bi-plus-circle me-2"></i> Add Images
          </button>
        </div>
      </div>

      {previewImage && (
        <div className="upd-pro-modal" onClick={() => setPreviewImage(null)}>
          <span className="upd-pro-modal-close">&times;</span>
          <img className="upd-pro-modal-content" src={previewImage} />
        </div>
      )}

      <style jsx>{`
        /* .upd-pro-card {
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 20px;
          background: #fff;
          margin-top: 20px;
        }
        .upd-pro-card-header {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        } */
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
