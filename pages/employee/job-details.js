import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Layout from "@/components/layout/Layout";

const JobDetailsPage = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <>
      <style jsx global>{`
        :root {
          --primary-color: #3b82f6;
          --secondary-color: #60a5fa;
          --accent-color: #22c55e;
          --light-color: #f8fafc;
          --dark-color: #1e293b;
          --gray-color: #64748b;
          --border-color: #e2e8f0;
        }

        body {
          background-color: #f1f5f9;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
          color: var(--dark-color);
          line-height: 1.6;
        }

        /* Header/Navbar */
        .navbar-brand {
          font-weight: 700;
          color: var(--primary-color) !important;
          font-size: 1.5rem;
        }

        .navbar {
          background: white;
          border-bottom: 1px solid var(--border-color);
          padding: 1rem 0;
        }

        .nav-link {
          color: var(--gray-color) !important;
          font-weight: 500;
          padding: 0.5rem 1rem !important;
          transition: all 0.2s ease;
          border-radius: 6px;
        }

        .nav-link:hover {
          color: var(--primary-color) !important;
          background-color: #eff6ff;
        }

        .nav-link.active {
          color: var(--primary-color) !important;
          background-color: #eff6ff;
          font-weight: 600;
        }

        /* Job Details Card */
        .job-card {
          background: white;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .job-header {
          background: #f8faff;
          color: white;
          padding: 2.5rem;
          border-bottom: 2px solid #00000014;
        }

        .job-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .company-name {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-top: 1.5rem;
          color: var(--gray-color);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .meta-item i {
          opacity: 0.8;
        }

        .job-body {
          padding: 3rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--dark-color);
          position: relative;
        }

        .job-description {
          line-height: 1.7;
          margin-bottom: 2rem;
          color: var(--gray-color);
          font-size: 1.05rem;
        }

        .requirements-list {
          list-style-type: none;
          padding: 0;
        }

        .requirements-list li {
          padding: 0.7rem 0;
          padding-left: 2rem;
          position: relative;
          color: var(--gray-color);
          line-height: 1.6;
        }

        .requirements-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 1.2rem;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-color);
        }

        /* Action Buttons */
        .btn-apply {
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--secondary-color)
          );
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 1.05rem;
        }

        .btn-apply:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
          color: white;
        }

        .btn-bookmark {
          background: white;
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
          padding: 1rem 2rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 1.05rem;
        }

        .btn-bookmark:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }

        .btn-bookmark.bookmarked {
          background: var(--primary-color);
          color: white;
        }

        /* Salary Badge */
        .salary-badge {
          background: linear-gradient(135deg, var(--accent-color), #16a34a);
          color: white;
          font-weight: 700;
          padding: 0.7rem 1.5rem;
          border-radius: 25px;
          font-size: 1.2rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Info Box */
        .info-box {
          background: white;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          padding: 2rem;
          margin-bottom: 1.5rem;
        }

        .info-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--dark-color);
        }

        .similar-job-item {
          padding: 1rem;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .similar-job-item:hover {
          background-color: var(--light-color);
        }

        .process-step {
          padding: 1rem 0;
          border-left: 2px solid var(--border-color);
          margin-left: 1rem;
          padding-left: 2rem;
          position: relative;
        }

        .process-step::before {
          content: "";
          position: absolute;
          left: -6px;
          top: 1.5rem;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--primary-color);
        }

        .process-step:last-child {
          border-left: none;
        }

        /* Footer */
        .footer {
          background: var(--dark-color);
          color: white;
          padding: 4rem 0 2rem;
          margin-top: 5rem;
        }

        .footer-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 0.8rem;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .footer-links a:hover {
          color: white;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .job-header {
            padding: 2rem;
          }

          .job-title {
            font-size: 2rem;
          }

          .job-body {
            padding: 2rem;
          }

          .job-meta {
            gap: 1rem;
          }

          .btn-container {
            flex-direction: column;
            gap: 1rem;
          }

          .info-box {
            padding: 1.5rem;
          }
        }
      `}</style>

      {/* Main Content */}
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="job-card mb-4">
                <div className="job-header">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h1 className="job-title">Full Stack Engineer</h1>
                      <p className="company-name">Adobe Illustrator</p>
                      <div className="salary-badge">
                        <i className="bi bi-currency-dollar"></i> $800/hour
                      </div>
                    </div>
                    <div
                      className="rounded-circle"
                      style={{
                        background: "white",
                        padding: "10px",
                        width: "80px",
                        height: "80px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className="bi bi-building"
                        style={{
                          fontSize: "2rem",
                          color: "var(--primary-color)",
                        }}
                      ></i>
                    </div>
                  </div>

                  <div className="job-meta">
                    <div className="meta-item">
                      <i className="bi bi-geo-alt"></i>
                      <span>New York, US</span>
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-briefcase"></i>
                      <span>Part Time</span>
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-clock"></i>
                      <span>Posted 5 minutes ago</span>
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-person"></i>
                      <span>2-5 years experience</span>
                    </div>
                  </div>
                </div>

                <div className="job-body">
                  <div className="mb-5">
                    <h3 className="section-title">Job Description</h3>
                    <p className="job-description">
                      We are seeking a talented Full Stack Engineer to join our
                      dynamic team at Adobe Illustrator. You will be responsible
                      for developing and maintaining both front-end and back-end
                      components of our cutting-edge creative software
                      solutions.
                    </p>
                    <p className="job-description">
                      This role offers an exciting opportunity to work with
                      modern technologies and contribute to products used by
                      millions of creative professionals worldwide. You'll
                      collaborate with cross-functional teams to deliver
                      exceptional user experiences.
                    </p>
                  </div>

                  <div className="mb-5">
                    <h3 className="section-title">Responsibilities</h3>
                    <ul className="requirements-list">
                      <li>
                        Design and develop scalable web applications using
                        modern technologies
                      </li>
                      <li>
                        Collaborate with UX/UI designers to implement responsive
                        designs
                      </li>
                      <li>Build reusable code and libraries for future use</li>
                      <li>
                        Optimize applications for maximum speed and scalability
                      </li>
                      <li>Implement security and data protection measures</li>
                      <li>
                        Participate in code reviews and provide constructive
                        feedback
                      </li>
                    </ul>
                  </div>

                  <div className="mb-5">
                    <h3 className="section-title">Requirements</h3>
                    <ul className="requirements-list">
                      <li>
                        Bachelor's degree in Computer Science or related field
                      </li>
                      <li>3+ years of experience in full stack development</li>
                      <li>Proficiency with JavaScript, HTML5, and CSS3</li>
                      <li>
                        Experience with React, Angular, or Vue.js frameworks
                      </li>
                      <li>
                        Knowledge of server-side languages such as Node.js,
                        Python, or Ruby
                      </li>
                      <li>
                        Familiarity with database technology such as MySQL,
                        MongoDB
                      </li>
                      <li>
                        Excellent problem-solving skills and attention to detail
                      </li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h3 className="section-title">Benefits</h3>
                    <ul className="requirements-list">
                      <li>Competitive salary and performance bonuses</li>
                      <li>Flexible working hours and remote work options</li>
                      <li>Comprehensive health insurance package</li>
                      <li>Professional development and conference budget</li>
                      <li>Generous vacation and paid time off</li>
                      <li>Modern office with state-of-the-art equipment</li>
                    </ul>
                  </div>

                  <div className="d-flex flex-wrap gap-3 btn-container mt-5">
                    <button className="btn-apply">
                      <i className="bi bi-send"></i> Apply Now
                    </button>
                    <button
                      className={`btn-bookmark ${
                        isBookmarked ? "bookmarked" : ""
                      }`}
                      onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                      <i
                        className={`bi ${
                          isBookmarked ? "bi-bookmark-fill" : "bi-bookmark"
                        }`}
                      ></i>
                      {isBookmarked ? "Saved" : "Save Job"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="info-box mb-4">
                <h4 className="info-title">About the Company</h4>
                <p>
                  Adobe Illustrator is a leading software company specializing
                  in creative tools for designers and artists worldwide. Our
                  mission is to empower creativity through innovative digital
                  solutions.
                </p>
                <div className="d-flex mt-4">
                  <div className="me-4">
                    <div className="fw-bold text-dark">Company size</div>
                    <div className="text-muted">1000+ employees</div>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Founded</div>
                    <div className="text-muted">1995</div>
                  </div>
                </div>
              </div>

              <div className="info-box mb-4">
                <h4 className="info-title">Similar Jobs</h4>
                <div className="similar-job-item d-flex align-items-center mb-3">
                  <div
                    className="rounded me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "var(--primary-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className="bi bi-linkedin text-white"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">UI/UX Designer</div>
                    <div className="text-muted small">
                      LinkedIn · New York, US
                    </div>
                  </div>
                  <div className="text-success fw-bold">$500/hour</div>
                </div>
                <div className="similar-job-item d-flex align-items-center mb-3">
                  <div
                    className="rounded me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "var(--accent-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className="bi bi-code-slash text-white"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">Frontend Developer</div>
                    <div className="text-muted small">
                      Quora JSC · New York, US
                    </div>
                  </div>
                  <div className="text-success fw-bold">$750/hour</div>
                </div>
                <div className="similar-job-item d-flex align-items-center">
                  <div
                    className="rounded me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "var(--dark-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className="bi bi-apple text-white"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">Backend Engineer</div>
                    <div className="text-muted small">
                      Apple/Now · New York, US
                    </div>
                  </div>
                  <div className="text-success fw-bold">$850/hour</div>
                </div>
              </div>

              <div className="info-box">
                <h4 className="info-title">Application Process</h4>
                <div className="process-step">
                  <div className="fw-bold">Submit Application</div>
                  <div className="text-muted small">
                    Fill out the application form with your details
                  </div>
                </div>
                <div className="process-step">
                  <div className="fw-bold">Screening Call</div>
                  <div className="text-muted small">
                    Initial phone interview with HR
                  </div>
                </div>
                <div className="process-step">
                  <div className="fw-bold">Technical Interview</div>
                  <div className="text-muted small">
                    Coding challenge and technical review
                  </div>
                </div>
                <div className="process-step">
                  <div className="fw-bold">Job Offer</div>
                  <div className="text-muted small">
                    Receive and sign your contract
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

export default JobDetailsPage;
