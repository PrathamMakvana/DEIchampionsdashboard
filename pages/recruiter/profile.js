import Layout from "@/components/layout/Layout";
import { useState } from "react";

export default function Home() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    businessEmail: "",
    phone: "",
    designation: "",
    currentCompany: "",
    linkedin: "",
    description: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "profile") {
        setProfileImage(URL.createObjectURL(file));
      } else {
        setCompanyLogo(URL.createObjectURL(file));
      }
    }
  };

  const handleRemoveImage = (type) => {
    if (type === "profile") {
      setProfileImage(null);
    } else {
      setCompanyLogo(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Profile data:", profileData);
    // You would typically send this data to your backend
  };

  return (
    <>
      <Layout breadcrumbTitle="My Profile" breadcrumbActive="My Profile">
        <div className="row">
          <div className="col-xxl-9 col-xl-8 col-lg-8">
            <div className="section-box">
              <div className="container">
                <div className="panel-white mb-30">
                  <div className="box-padding">
                    <h6 className="color-text-paragraph-2">
                      Update your profile
                    </h6>

                    {/* Profile Image Upload */}
                    <div className="box-profile-image">
                      <div className="img-profile">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="cmpprofile-image"
                          />
                        ) : (
                          <img
                            src="../assets/imgs/page/profile/img-profile.png"
                            alt="jobBox"
                          />
                        )}
                      </div>
                      <div className="info-profile">
                        <label
                          htmlFor="profile-upload"
                          className="btn btn-default"
                        >
                          Upload Profile Image
                        </label>
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, "profile")}
                        />
                        {profileImage && (
                          <a
                            className="btn btn-link"
                            onClick={() => handleRemoveImage("profile")}
                          >
                            Delete
                          </a>
                        )}
                      </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group mb-30">
                            <label className="font-sm color-text-mutted mb-10">
                              Full Name *
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="name"
                              value={profileData.name}
                              onChange={handleInputChange}
                              placeholder="Steven Job"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group mb-30">
                            <label className="font-sm color-text-mutted mb-10">
                              Email *
                            </label>
                            <input
                              className="form-control"
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleInputChange}
                              placeholder="stevenjob@gmail.com"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group mb-30">
                            <label className="font-sm color-text-mutted mb-10">
                              Business Email *
                            </label>
                            <input
                              className="form-control"
                              type="email"
                              name="businessEmail"
                              value={profileData.businessEmail}
                              onChange={handleInputChange}
                              placeholder="steven@company.com"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group mb-30">
                            <label className="font-sm color-text-mutted mb-10">
                              Phone *
                            </label>
                            <input
                              className="form-control"
                              type="tel"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleInputChange}
                              placeholder="01 - 234 567 89"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group mb-30">
                            <label className="font-sm color-text-mutted mb-10">
                              Designation *
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="designation"
                              value={profileData.designation}
                              onChange={handleInputChange}
                              placeholder="CEO"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group mb-30">
                            <label className="font-sm color-text-mutted mb-10">
                              Current Company *
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="currentCompany"
                              value={profileData.currentCompany}
                              onChange={handleInputChange}
                              placeholder="Apple Inc."
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group mb-30">
                            <label className="font-sm color-text-mutted mb-10">
                              LinkedIn Profile
                            </label>
                            <input
                              className="form-control"
                              type="url"
                              name="linkedin"
                              value={profileData.linkedin}
                              onChange={handleInputChange}
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group mb-30">
                            <label className="font-sm color-text-mutted mb-10">
                              Description
                            </label>
                            <textarea
                              className="form-control"
                              name="description"
                              rows={5}
                              value={profileData.description}
                              onChange={handleInputChange}
                              placeholder="Tell us about yourself and your company..."
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group mt-10">
                            <button className="btn btn-default btn-brand icon-tick">
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-4 col-lg-4">
            <div className="section-box">
              <div className="container">
                <div className="panel-white">
                  <div className="panel-head">
                    <h5>Company Logo</h5>
                  </div>
                  <div className="panel-body pt-20">
                    <div className="cmpprofile-logo-upload">
                      {companyLogo ? (
                        <div className="cmpprofile-logo-preview">
                          <img src={companyLogo} alt="Company Logo" />
                          <button
                            className="btn btn-link cmpprofile-remove-logo"
                            onClick={() => handleRemoveImage("logo")}
                          >
                            Remove Logo
                          </button>
                        </div>
                      ) : (
                        <div className="cmpprofile-logo-placeholder">
                          <i className="bi bi-building"></i>
                          <p>Upload your company logo</p>
                        </div>
                      )}
                      <label
                        htmlFor="logo-upload"
                        className="btn btn-default btn-full-width"
                      >
                        Upload Company Logo
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(e, "logo")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      <style jsx>{`
        .cmpprofile-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }

        .cmpprofile-logo-upload {
          text-align: center;
        }

        .cmpprofile-logo-preview {
          margin-bottom: 20px;
        }

        .cmpprofile-logo-preview img {
          max-width: 100%;
          max-height: 150px;
          margin-bottom: 10px;
        }

        .cmpprofile-logo-placeholder {
          height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 20px;
          color: #6c757d;
        }

        .cmpprofile-logo-placeholder i {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .cmpprofile-remove-logo {
          color: #dc3545;
          text-decoration: none;
        }

        .cmpprofile-remove-logo:hover {
          color: #bd2130;
        }

        .btn-full-width {
          width: 100%;
        }
      `}</style>
    </>
  );
}
