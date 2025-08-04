"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfileTabs({ focusInput }) {
  const [selectedImage, setSelectedImage] = useState();
  const [avatar, setAvatar] = useState();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <div className="card p-4">
      {/* Dropdown Menu */}
      <div className="d-flex justify-content-end position-relative">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setShowMenu(!showMenu)}
        >
          <i className="bi bi-three-dots-vertical"></i>
        </button>

        {showMenu && (
          <div
            className="dropdown-menu show position-absolute"
            style={{ right: 0, top: "100%" }}
          >
            <Link href="/apps/profiles/user/personal" legacyBehavior>
              <a
                className="dropdown-item"
                onClick={() => {
                  setShowMenu(false);
                  setTimeout(() => focusInput(), 300);
                }}
              >
                Edit
              </a>
            </Link>
            <button className="dropdown-item disabled">Delete</button>
          </div>
        )}
      </div>

      {/* Avatar with upload */}
      <div className="text-center my-3 position-relative">
        <label
          htmlFor="change-avatar"
          className="position-relative d-inline-block avatar-wrapper"
        >
          <img
            src={avatar}
            alt="Avatar"
            className="rounded-circle border"
            style={{
              width: "124px",
              height: "124px",
              objectFit: "cover",
              cursor: "pointer",
            }}
          />
          <div className="overlay d-flex flex-column justify-content-center align-items-center text-white">
            <i className="bi bi-camera" style={{ fontSize: "1.5rem" }}></i>
            <small>Upload</small>
          </div>
        </label>
        <input
          type="file"
          id="change-avatar"
          className="d-none"
          onChange={(e) => setSelectedImage(e.target.files?.[0])}
        />
      </div>

      {/* Name and Role */}
      <div className="text-center">
        <h5>Stebin Ben</h5>
        <p className="text-muted mb-2">Full Stack Developer</p>
      </div>

      {/* Social icons */}
      <div className="d-flex justify-content-center gap-3 mb-3">
        <i className="bi bi-google text-danger fs-4"></i>
        <i className="bi bi-facebook text-primary fs-4"></i>
        <i className="bi bi-apple text-dark fs-4"></i>
      </div>

      {/* Stats */}
      <div className="d-flex justify-content-around text-center my-3 border-top pt-3">
        <div>
          <h5>86</h5>
          <p className="text-muted">Posts</p>
        </div>
        <div>
          <h5>40</h5>
          <p className="text-muted">Projects</p>
        </div>
        <div>
          <h5>4.5K</h5>
          <p className="text-muted">Members</p>
        </div>
      </div>

      {/* Tabs Placeholder */}
      <div className="border-top pt-3">
        <p className="text-center text-muted">
          Tabs content (ProfileTab) goes here...
        </p>
      </div>

      {/* Plain CSS for hover overlay */}
      <style jsx>{`
        .avatar-wrapper .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.6);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .avatar-wrapper:hover .overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
