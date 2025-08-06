import { useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";

const JobSeekerProfile = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <>
      <Layout>
        <div className="js-profile-header">
          <div className="container js-profile-container">
            <div className="js-profile-card">
              <div className="row">
                {/* Left Profile Column */}
                <div className="col-lg-4 border-end">
                  <div className="js-profile-img-container">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Profile Photo"
                      className="js-profile-img"
                    />
                    <h2 className="js-profile-name">Robert Fox</h2>
                    <p className="js-profile-title">
                      <i className="bi bi-briefcase me-2"></i>U/L/X Designer
                    </p>
                    <div className="js-rating">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-half"></i>
                      <span className="text-dark ms-2">(69 reviews)</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="js-contact-info">
                      <h5 className="mb-3">
                        <i className="bi bi-person-lines-fill me-2"></i>Contact
                        Information
                      </h5>
                      <div className="js-contact-item">
                        <div className="js-contact-icon">
                          <i className="bi bi-envelope"></i>
                        </div>
                        <div>
                          <p className="mb-0">Email</p>
                          <p className="fw-bold">robert.fox@example.com</p>
                        </div>
                      </div>
                      <div className="js-contact-item">
                        <div className="js-contact-icon">
                          <i className="bi bi-telephone"></i>
                        </div>
                        <div>
                          <p className="mb-0">Phone</p>
                          <p className="fw-bold">+1 (234) 567-8910</p>
                        </div>
                      </div>
                      <div className="js-contact-item">
                        <div className="js-contact-icon">
                          <i className="bi bi-geo-alt"></i>
                        </div>
                        <div>
                          <p className="mb-0">Location</p>
                          <p className="fw-bold">San Francisco, CA</p>
                        </div>
                      </div>
                      <div className="js-contact-item">
                        <div className="js-contact-icon">
                          <i className="bi bi-linkedin"></i>
                        </div>
                        <div>
                          <p className="mb-0">LinkedIn</p>
                          <p className="fw-bold">linkedin.com/in/robertfox</p>
                        </div>
                      </div>
                    </div>

                    <div className="js-skills-container">
                      <h5 className="js-section-title">
                        <i className="bi bi-tools me-2"></i>Skills & Expertise
                      </h5>
                      <div className="d-flex flex-wrap">
                        <span className="js-skill-badge">Adobe XD</span>
                        <span className="js-skill-badge">
                          Adobe Illustrator
                        </span>
                        <span className="js-skill-badge">Sketch</span>
                        <span className="js-skill-badge">PSD</span>
                        <span className="js-skill-badge">Digital Design</span>
                        <span className="js-skill-badge">App Design</span>
                        <span className="js-skill-badge">User Interface</span>
                        <span className="js-skill-badge">Wireframing</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="js-section-title">
                        <i className="bi bi-translate me-2"></i>Languages
                      </h5>
                      <div className="d-flex flex-wrap">
                        <span
                          className="js-skill-badge"
                          style={{ background: "#28a745" }}
                        >
                          English (Native)
                        </span>
                        <span
                          className="js-skill-badge"
                          style={{ background: "#4e54c8" }}
                        >
                          Spanish (Fluent)
                        </span>
                        <span
                          className="js-skill-badge"
                          style={{ background: "#ff6b6b" }}
                        >
                          French (Intermediate)
                        </span>
                      </div>
                    </div>

                    <div className="js-social-links">
                      <a href="#" className="js-social-icon">
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a href="#" className="js-social-icon">
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a href="#" className="js-social-icon">
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a href="#" className="js-social-icon">
                        <i className="bi bi-dribbble"></i>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Profile Column */}
                <div className="col-lg-8">
                  {/* Navigation Tabs */}
                  <div>
                    <ul className="headeritems nav-tabs mt-4 px-4 js-nav-tabs">
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            activeTab === "about" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("about")}
                        >
                          <i className="bi bi-person-circle me-2"></i>About
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            activeTab === "experience" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("experience")}
                        >
                          <i className="bi bi-briefcase me-2"></i>Experience
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            activeTab === "education" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("education")}
                        >
                          <i className="bi bi-journal-bookmark me-2"></i>
                          Education
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            activeTab === "portfolio" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("portfolio")}
                        >
                          <i className="bi bi-folder-symlink me-2"></i>Portfolio
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Tab Content */}
                  <div className="js-tab-content">
                    {/* About Tab */}
                    {activeTab === "about" && (
                      <div>
                        <h4 className="js-section-title">
                          Professional Summary
                        </h4>
                        <p className="lead">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Vero repellendus magni, atque delectus molestias
                          quis.
                        </p>

                        <p>
                          Creative and detail-oriented UX/UI Designer with 5+
                          years of experience creating intuitive and engaging
                          user experiences for web and mobile applications.
                          Passionate about transforming complex problems into
                          simple, beautiful, and intuitive designs.
                        </p>

                        <p>
                          Proven ability to collaborate effectively with product
                          managers, developers, and stakeholders to deliver
                          innovative solutions that meet business objectives and
                          user needs. Skilled in user research, wireframing,
                          prototyping, and usability testing.
                        </p>

                        <div className="row mt-4">
                          <div className="col-md-6">
                            <h5 className="js-section-title">
                              <i className="bi bi-award me-2"></i>Achievements
                            </h5>
                            <ul className="list-group list-group-flush colorBlack">
                              <li className="list-group-item d-flex align-items-center">
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                Redesigned checkout flow, increasing conversion
                                by 22%
                              </li>
                              <li className="list-group-item d-flex align-items-center">
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                Created design system adopted company-wide
                              </li>
                              <li className="list-group-item d-flex align-items-center">
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                Winner of 2022 Design Excellence Award
                              </li>
                            </ul>
                          </div>
                          <div className="col-md-6">
                            <h5 className="js-section-title">
                              <i className="bi bi-heart me-2"></i>Interests
                            </h5>
                            <div className="d-flex flex-wrap">
                              <span
                                className="js-skill-badge"
                                style={{ background: "#ff6b6b" }}
                              >
                                Photography
                              </span>
                              <span
                                className="js-skill-badge"
                                style={{ background: "#28a745" }}
                              >
                                Traveling
                              </span>
                              <span
                                className="js-skill-badge"
                                style={{ background: "#ffc107" }}
                              >
                                Cooking
                              </span>
                              <span
                                className="js-skill-badge"
                                style={{ background: "#4e54c8" }}
                              >
                                Hiking
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Experience Tab */}
                    {activeTab === "experience" && (
                      <div>
                        <h4 className="js-section-title">Work Experience</h4>

                        <div className="js-experience-item">
                          <div className="d-flex justify-content-start flex-wrap">
                            <h5>Senior UX Designer</h5>
                          </div>
                          <p className="text-primary fw-bold">
                            Tech Innovations Inc. | San Francisco, CA
                          </p>
                          <p className="text-muted">January 2020 - Present</p>
                          <p>
                            Lead the design team in creating user-centered
                            designs for web and mobile applications.
                            Collaborated with product managers and engineers to
                            implement innovative solutions.
                          </p>
                          <ul className="colorGray">
                            <li>
                              Redesigned the company's flagship product,
                              resulting in a 30% increase in user engagement
                            </li>
                            <li>
                              Developed and maintained the company's design
                              system
                            </li>
                            <li>
                              Conducted user research and usability testing
                              sessions
                            </li>
                          </ul>
                        </div>

                        <div className="js-experience-item">
                          <h5>UX Designer</h5>
                          <p className="text-primary fw-bold">
                            Creative Solutions | San Francisco, CA
                          </p>
                          <p className="text-muted">
                            March 2017 - December 2019
                          </p>
                          <p>
                            Designed user interfaces for various clients across
                            different industries. Conducted user research and
                            usability testing to improve product designs.
                          </p>
                          <ul className="colorGray">
                            <li>
                              Created wireframes, prototypes, and high-fidelity
                              mockups
                            </li>
                            <li>
                              Collaborated with developers to ensure design
                              implementation quality
                            </li>
                            <li>
                              Presented design solutions to clients and
                              stakeholders
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Education Tab */}
                    {activeTab === "education" && (
                      <div>
                        <h4 className="js-section-title">Education</h4>

                        <div className="js-experience-item">
                          <h5>Master of Fine Arts in Design</h5>
                          <p className="text-primary fw-bold">
                            Stanford University | Stanford, CA
                          </p>
                          <p className="text-muted">2015 - 2017</p>
                          <p>
                            Specialized in Interaction Design and User
                            Experience. Thesis on "Emotional Design in Digital
                            Products".
                          </p>
                        </div>

                        <div className="js-experience-item">
                          <h5>Bachelor of Science in Computer Science</h5>
                          <p className="text-primary fw-bold">
                            University of California, Berkeley | Berkeley, CA
                          </p>
                          <p className="text-muted">2011 - 2015</p>
                          <p>
                            Minored in Digital Arts. Graduated with honors.
                            Capstone project on mobile app design for
                            accessibility.
                          </p>
                        </div>

                        <div className="mt-4">
                          <h5 className="js-section-title">Certifications</h5>
                          <ul className="list-group colorBlack">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Google UX Design Professional Certificate
                              <span className="badge bg-success">2020</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Adobe Certified Expert (ACE) - Illustrator
                              <span className="badge bg-success">2019</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Interaction Design Foundation - UX Management
                              <span className="badge bg-success">2018</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Portfolio Tab */}
                    {activeTab === "portfolio" && (
                      <div>
                        <h4 className="js-section-title">Design Portfolio</h4>
                        <p className="lead mb-4">
                          Selection of recent design projects and case studies.
                        </p>

                        <div className="js-portfolio-grid">
                          <div className="js-portfolio-item">
                            Mobile Banking App
                          </div>
                          <div className="js-portfolio-item">
                            E-commerce Dashboard
                          </div>
                          <div className="js-portfolio-item">
                            Travel Booking Platform
                          </div>
                          <div className="js-portfolio-item">
                            Fitness Tracking App
                          </div>
                          <div className="js-portfolio-item">
                            Restaurant Ordering System
                          </div>
                          <div className="js-portfolio-item">
                            Healthcare Portal
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="js-action-buttons px-4 pb-4">
                    <button className="js-btn-primary">
                      <i className="bi bi-download me-2"></i>Download Resume
                    </button>
                    <button className="js-btn-outline-primary">
                      <i className="bi bi-chat-dots me-2"></i>Send Message
                    </button>
                    {/* <button className="js-btn-outline-primary">
                      <i className="bi bi-bookmark me-2"></i>Save Profile
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default JobSeekerProfile;
