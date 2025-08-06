import Layout from "@/components/layout/Layout";
import React from "react";

const JobDetailsPage = () => {
  return (
    <Layout>
      <div className="page-content">
        {/* Main Content */}
        <div className="container">
          <div className="job-details-container">
            <div>
              {/* Job Details Card */}
              <div className="content-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="bi bi-file-earmark-text me-2"></i> Job Details
                  </h2>
                  <div>
                    <button className="btn-action btn-edit">
                      <i className="bi bi-pencil"></i> Edit Job
                    </button>
                    <button className="btn-action btn-delete">
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="job-header">
                    <div>
                      <h3>Senior Frontend Developer</h3>
                      <p className="text-muted">
                        Technology Department • Posted on May 15, 2025
                      </p>
                    </div>
                    <span className="status-badge status-active">
                      <i className="bi bi-check-circle"></i> Active
                    </span>
                  </div>

                  <div className="job-meta">
                    <div className="meta-item">
                      <div className="meta-icon">
                        <i className="bi bi-briefcase"></i>
                      </div>
                      <div className="meta-content">
                        <h5>Job Type</h5>
                        <p>Full-time</p>
                      </div>
                    </div>

                    <div className="meta-item">
                      <div className="meta-icon">
                        <i className="bi bi-geo-alt"></i>
                      </div>
                      <div className="meta-content">
                        <h5>Location</h5>
                        <p>Remote (Global)</p>
                      </div>
                    </div>

                    <div className="meta-item">
                      <div className="meta-icon">
                        <i className="bi bi-currency-dollar"></i>
                      </div>
                      <div className="meta-content">
                        <h5>Salary</h5>
                        <p>$90,000 - $120,000</p>
                      </div>
                    </div>

                    <div className="meta-item">
                      <div className="meta-icon">
                        <i className="bi bi-people"></i>
                      </div>
                      <div className="meta-content">
                        <h5>Applicants</h5>
                        <p>42 candidates</p>
                      </div>
                    </div>
                  </div>

                  <div className="job-description">
                    <h4 className="section-title">
                      <i className="bi bi-card-text"></i> Job Description
                    </h4>
                    <p>
                      We're looking for a talented Senior Frontend Developer to
                      join our growing technology team. You'll be responsible
                      for building user interfaces for our web applications
                      using modern JavaScript frameworks.
                    </p>
                    <p>
                      You'll work closely with our design and backend teams to
                      implement responsive, accessible, and performant user
                      interfaces. This role requires strong expertise in React,
                      TypeScript, and modern frontend tooling.
                    </p>
                  </div>

                  <div className="job-description">
                    <h4 className="section-title">
                      <i className="bi bi-list-check"></i> Responsibilities
                    </h4>
                    <ul className="requirements-list">
                      <li>
                        Develop responsive web applications using React and
                        TypeScript
                      </li>
                      <li>
                        Collaborate with UX/UI designers to implement designs
                      </li>
                      <li>
                        Optimize applications for maximum speed and scalability
                      </li>
                      <li>
                        Write unit and integration tests for frontend code
                      </li>
                      <li>Mentor junior developers and conduct code reviews</li>
                      <li>
                        Stay up-to-date with emerging frontend technologies
                      </li>
                    </ul>
                  </div>

                  <div className="job-description">
                    <h4 className="section-title">
                      <i className="bi bi-clipboard-check"></i> Requirements
                    </h4>
                    <ul className="requirements-list">
                      <li>
                        5+ years of professional frontend development experience
                      </li>
                      <li>Expert knowledge of JavaScript, HTML5, and CSS3</li>
                      <li>
                        Proficiency with React and state management libraries
                      </li>
                      <li>
                        Experience with TypeScript and modern CSS frameworks
                      </li>
                      <li>Familiarity with RESTful APIs and GraphQL</li>
                      <li>
                        Experience with testing frameworks (Jest, Cypress)
                      </li>
                      <li>Strong problem-solving and communication skills</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div>
              {/* Job Stats Card */}
              <div className="job-overview-card mb-4">
                <h4 className="section-title">
                  <i className="bi bi-graph-up"></i> Job Statistics
                </h4>

                <div
                  className="job-meta"
                  style={{ justifyContent: "space-between" }}
                >
                  <div
                    className="meta-item"
                    style={{ flexDirection: "column" }}
                  >
                    <div className="meta-icon">
                      <i className="bi bi-eye"></i>
                    </div>
                    <div className="meta-content text-center">
                      <h5>Views</h5>
                      <p>1,245</p>
                    </div>
                  </div>

                  <div
                    className="meta-item"
                    style={{ flexDirection: "column" }}
                  >
                    <div className="meta-icon">
                      <i className="bi bi-people"></i>
                    </div>
                    <div className="meta-content text-center">
                      <h5>Applicants</h5>
                      <p>42</p>
                    </div>
                  </div>

                  <div
                    className="meta-item"
                    style={{ flexDirection: "column" }}
                  >
                    <div className="meta-icon">
                      <i className="bi bi-share"></i>
                    </div>
                    <div className="meta-content text-center">
                      <h5>Shares</h5>
                      <p>87</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h5>Application Status</h5>
                  <div className="mt-2">
                    <div className="d-flex justify-content-between mb-2">
                      <span>New</span>
                      <span>12</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: "28%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Reviewed</span>
                      <span>18</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-info"
                        role="progressbar"
                        style={{ width: "43%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Interview</span>
                      <span>8</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: "19%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Rejected</span>
                      <span>4</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-danger"
                        role="progressbar"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="job-overview-card container">
                <div className="row">
                  <div className="col-12">
                    <h4 className="section-title d-flex align-items-center">
                      <i className="bi bi-lightning me-2"></i> Quick Actions
                    </h4>
                  </div>
                  <div className="col-12 mt-4">
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary w-100 mb-3">
                        <i className="bi bi-person-plus-fill me-2"></i> Add New
                        Candidate
                      </button>
                      <button className="btn btn-primary w-100 mb-3">
                        <i className="bi bi-envelope-fill me-2"></i> Email
                        Candidates
                      </button>
                      <button className="btn btn-primary w-100 mb-3">
                        <i className="bi bi-calendar-event-fill me-2"></i>{" "}
                        Schedule Interview
                      </button>
                      <button className="btn btn-primary w-100">
                        <i className="bi bi-box-arrow-up-right me-2"></i> Export
                        Applications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Applicants Card */}
          <div className="content-card">
            <div className="card-header">
              <h3 className="card-title" style={{ fontSize: "24px" }}>
                <i className="bi bi-people me-2"></i> Applicants (42)
              </h3>
              <div className="filters-container">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">New</button>
                <button className="filter-btn">Reviewed</button>
                <button className="filter-btn">Interview</button>
                <button className="filter-btn">Rejected</button>
              </div>
            </div>
            <div className="card-body">
              {/* Applicant 1 */}
              <div className="applicant-card container">
                <div className="row applicant-header align-items-center">
                  <div className="col-auto">
                    <div className="applicant-avatar">AS</div>
                  </div>
                  <div className="col">
                    <div className="applicant-info">
                      <h4>Alex Johnson</h4>
                      <p>Senior Frontend Developer • 8 years experience</p>
                    </div>
                  </div>
                  <div className="col-auto ms-auto">
                    <span className="status-badge status-active">
                      <i className="bi bi-star"></i> Top Candidate
                    </span>
                  </div>
                </div>

                <div className="row applicant-meta text-center text-md-start mt-3">
                  <div className="col-12 col-md-2 mb-3 mb-md-0">
                    <h5>Location</h5>
                    <p>San Francisco, CA</p>
                  </div>
                  <div className="col-12 col-md-2 mb-3 mb-md-0">
                    <h5>Applied</h5>
                    <p>May 18, 2025</p>
                  </div>
                  <div className="col-12 col-md-2">
                    <h5>Status</h5>
                    <p className="text-success">Interview Scheduled</p>
                  </div>
                </div>

                <div className="row justify-content-between align-items-center mt-3">
                  <div className="col-12 col-md-8">
                    <div className="d-flex justify-content-between justify-content-md-start applicant-stats flex-wrap">
                      <div className="stat-item me-3 mb-2">
                        <div className="stat-value">98%</div>
                        <div className="stat-label">Match</div>
                      </div>
                      <div className="stat-item me-3 mb-2">
                        <div className="stat-value">4.8</div>
                        <div className="stat-label">Rating</div>
                      </div>
                      <div className="stat-item mb-2">
                        <div className="stat-value">3</div>
                        <div className="stat-label">Notes</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 text-md-end">
                    <button className="btn-action btn-view me-2 mt-2 mt-md-0">
                      <i className="bi bi-eye"></i> View Application
                    </button>
                    <button className="btn-action btn-edit mt-2 mt-md-0">
                      <i className="bi bi-chat"></i> Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Applicant 2 */}
              <div className="applicant-card container">
                <div className="row applicant-header align-items-center">
                  <div className="col-auto">
                    <div className="applicant-avatar">MJ</div>
                  </div>
                  <div className="col">
                    <div className="applicant-info">
                      <h4>Maria Garcia</h4>
                      <p>Frontend Engineer • 6 years experience</p>
                    </div>
                  </div>
                  <div className="col-auto ms-auto">
                    <span className="status-badge status-pending">
                      <i className="bi bi-clock"></i> New
                    </span>
                  </div>
                </div>

                <div className="row applicant-meta text-center text-md-start mt-3">
                  <div className="col-12 col-md-2 mb-3 mb-md-0">
                    <h5>Location</h5>
                    <p>Madrid, Spain</p>
                  </div>
                  <div className="col-12 col-md-2 mb-3 mb-md-0">
                    <h5>Applied</h5>
                    <p>May 20, 2025</p>
                  </div>
                  <div className="col-12 col-md-2">
                    <h5>Status</h5>
                    <p className="text-warning">Under Review</p>
                  </div>
                </div>

                <div className="row justify-content-between align-items-center mt-3">
                  <div className="col-12 col-md-8">
                    <div className="d-flex justify-content-between justify-content-md-start applicant-stats flex-wrap">
                      <div className="stat-item me-3 mb-2">
                        <div className="stat-value">92%</div>
                        <div className="stat-label">Match</div>
                      </div>
                      <div className="stat-item me-3 mb-2">
                        <div className="stat-value">4.6</div>
                        <div className="stat-label">Rating</div>
                      </div>
                      <div className="stat-item mb-2">
                        <div className="stat-value">1</div>
                        <div className="stat-label">Notes</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 text-md-end">
                    <button className="btn-action btn-view me-2 mt-2 mt-md-0">
                      <i className="bi bi-eye"></i> View Application
                    </button>
                    <button className="btn-action btn-edit mt-2 mt-md-0">
                      <i className="bi bi-chat"></i> Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetailsPage;
