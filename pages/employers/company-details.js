import React from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useSelector } from "react-redux";

const CompanyProfile = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Layout>
        <div className="container">
          <div className="company-card">
            <div className="company-logo-container">
              <div className="company-logo">
                {user?.companyName ? user.companyName.charAt(0) : "DC"}
              </div>
              <h1 className="company-name">
                {user?.companyName || "Dei Champions"}
              </h1>
              <p className="company-tagline">
                Building inclusive workplaces for the future
              </p>

              <div className="company-stats">
                <div className="stat-item">
                  <div className="stat-value">
                    {user?.companySize || "150+"}
                  </div>
                  <div className="stat-label">Employees</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Countries</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">2010</div>
                  <div className="stat-label">Founded</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">25+</div>
                  <div className="stat-label">Open Positions</div>
                </div>
              </div>
            </div>

            <div className="company-info">
              <h2 className="section-title">About Us</h2>
              <p className="company-description">
                Dei Champions is a global leader in diversity, equity, and
                inclusion solutions. We partner with organizations to create
                workplaces where everyone feels valued, respected, and empowered
                to contribute their unique perspectives. Our innovative platform
                connects diverse talent with inclusive employers.
              </p>
              <p className="company-description">
                Founded in 2010, we've grown from a small startup to a
                multinational company serving clients across 12 countries. Our
                mission is to transform workplace culture through technology,
                education, and meaningful connections.
              </p>

              <div className="company-details overflowAuto">
                <div className="detail-card">
                  <i className="bi bi-geo-alt-fill detail-icon"></i>
                  <h3 className="detail-title">Headquarters</h3>
                  <p>
                    {user?.city || "San Francisco"},{" "}
                    {user?.state || "California"}
                  </p>
                  <p>{user?.address || "123 Innovation Way, Suite 500"}</p>
                </div>

                <div className="detail-card">
                  <i className="bi bi-globe detail-icon"></i>
                  <h3 className="detail-title">Global Presence</h3>
                  <p>Offices in 12 countries worldwide</p>
                  <p>Remote team across 25+ countries</p>
                </div>

                <div className="detail-card">
                  <i className="bi bi-people-fill detail-icon"></i>
                  <h3 className="detail-title">Our Team</h3>
                  <p>150+ dedicated professionals</p>
                  <p>45% leadership roles held by women</p>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn btn-primary">
                  <i className="bi bi-globe me-2"></i>
                  {user?.companyWebsite
                    ? "Visit Our Website"
                    : "Visit Our Website"}
                </button>
                <button className="btn btn-outline-primary">
                  <i className="bi bi-envelope me-2"></i>Contact Us
                </button>
              </div>
            </div>

            {/* Rest of the content remains static as user object doesn't have this data */}
            <div className="job-openings">
              <h2 className="section-title">Current Job Openings</h2>

              <div className="job-card">
                <h3 className="job-title">Senior UX Designer</h3>
                <div className="job-meta">
                  <div className="job-meta-item">
                    <i className="bi bi-briefcase"></i>
                    <span>Full-time</span>
                  </div>
                  <div className="job-meta-item">
                    <i className="bi bi-geo-alt"></i>
                    <span>Remote</span>
                  </div>
                  <div className="job-meta-item">
                    <i className="bi bi-cash"></i>
                    <span>$90,000 - $120,000</span>
                  </div>
                </div>
                <p className="job-description">
                  We're seeking an experienced UX Designer to lead design
                  initiatives for our core platform. You'll collaborate with
                  product managers and engineers to create intuitive, accessible
                  user experiences that drive engagement and satisfaction.
                </p>
                <div className="mb-3">
                  <span className="skill-badge">Adobe XD</span>
                  <span className="skill-badge">UI/UX Design</span>
                  <span className="skill-badge">User Research</span>
                  <span className="skill-badge">Figma</span>
                </div>
                <button className="btn btn-sm btn-outline-primary">
                  Apply Now
                </button>
              </div>

              <div className="job-card">
                <h3 className="job-title">Python Developer</h3>
                <div className="job-meta">
                  <div className="job-meta-item">
                    <i className="bi bi-briefcase"></i>
                    <span>Full-time</span>
                  </div>
                  <div className="job-meta-item">
                    <i className="bi bi-geo-alt"></i>
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="job-meta-item">
                    <i className="bi bi-cash"></i>
                    <span>$100,000 - $140,000</span>
                  </div>
                </div>
                <p className="job-description">
                  Join our engineering team to build scalable backend services
                  for our platform. You'll develop APIs, optimize database
                  performance, and implement security best practices. Experience
                  with Django or Flask required.
                </p>
                <div className="mb-3">
                  <span className="skill-badge">Python</span>
                  <span className="skill-badge">Django</span>
                  <span className="skill-badge">REST APIs</span>
                  <span className="skill-badge">PostgreSQL</span>
                </div>
                <button className="btn btn-sm btn-outline-primary">
                  Apply Now
                </button>
              </div>

              <div className="job-card">
                <h3 className="job-title">DEI Program Manager</h3>
                <div className="job-meta">
                  <div className="job-meta-item">
                    <i className="bi bi-briefcase"></i>
                    <span>Full-time</span>
                  </div>
                  <div className="job-meta-item">
                    <i className="bi bi-geo-alt"></i>
                    <span>New York, NY</span>
                  </div>
                  <div className="job-meta-item">
                    <i className="bi bi-cash"></i>
                    <span>$85,000 - $110,000</span>
                  </div>
                </div>
                <p className="job-description">
                  Lead diversity and inclusion initiatives for our clients.
                  Develop and implement DEI strategies, conduct training
                  sessions, and measure program effectiveness. Experience in
                  organizational development preferred.
                </p>
                <div className="mb-3">
                  <span className="skill-badge">Diversity & Inclusion</span>
                  <span className="skill-badge">Program Management</span>
                  <span className="skill-badge">Training Development</span>
                  <span className="skill-badge">HR</span>
                </div>
                <button className="btn btn-sm btn-outline-primary">
                  Apply Now
                </button>
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-primary">
                  <i className="bi bi-search me-2"></i>View All 25 Positions
                </button>
              </div>
            </div>

            <div className="team-section">
              <h2 className="section-title">Leadership Team</h2>

              <div className="team-grid overflowAuto">
                <div className="team-member">
                  <div className="member-photo">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="member-info">
                    <h4 className="member-name">Alex Morgan</h4>
                    <p className="member-position">CEO & Founder</p>
                    <div className="social-links">
                      <a href="#" className="social-icon">
                        <i className="bi bi-linkedin"></i>
                      </a>
                      <a href="#" className="social-icon">
                        <i className="bi bi-twitter"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="team-member">
                  <div className="member-photo">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="member-info">
                    <h4 className="member-name">Jamal Williams</h4>
                    <p className="member-position">Chief Technology Officer</p>
                    <div className="social-links">
                      <a href="#" className="social-icon">
                        <i className="bi bi-linkedin"></i>
                      </a>
                      <a href="#" className="social-icon">
                        <i className="bi bi-github"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="team-member">
                  <div className="member-photo">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="member-info">
                    <h4 className="member-name">Priya Sharma</h4>
                    <p className="member-position">Chief Diversity Officer</p>
                    <div className="social-links">
                      <a href="#" className="social-icon">
                        <i className="bi bi-linkedin"></i>
                      </a>
                      <a href="#" className="social-icon">
                        <i className="bi bi-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="team-member">
                  <div className="member-photo">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="member-info">
                    <h4 className="member-name">Marcus Chen</h4>
                    <p className="member-position">VP of Product</p>
                    <div className="social-links">
                      <a href="#" className="social-icon">
                        <i className="bi bi-linkedin"></i>
                      </a>
                      <a href="#" className="social-icon">
                        <i className="bi bi-medium"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="culture-section">
              <h2 className="section-title">Our Culture & Values</h2>

              <div className="values-grid overflowAuto">
                <div className="value-card">
                  <i className="bi bi-people value-icon"></i>
                  <h3 className="value-title">Inclusion</h3>
                  <p>
                    We create environments where everyone feels they belong and
                    can contribute their authentic selves.
                  </p>
                </div>

                <div className="value-card">
                  <i className="bi bi-lightbulb value-icon"></i>
                  <h3 className="value-title">Innovation</h3>
                  <p>
                    We embrace new ideas and approaches to solve complex
                    challenges in workplace diversity.
                  </p>
                </div>

                <div className="value-card">
                  <i className="bi bi-heart value-icon"></i>
                  <h3 className="value-title">Empathy</h3>
                  <p>
                    We listen deeply and seek to understand diverse perspectives
                    and experiences.
                  </p>
                </div>

                <div className="value-card">
                  <i className="bi bi-shield-check value-icon"></i>
                  <h3 className="value-title">Integrity</h3>
                  <p>
                    We do what's right, even when it's difficult, and hold
                    ourselves accountable.
                  </p>
                </div>
              </div>

              <div className="benefits mt-5">
                <h2 className="section-title">Employee Benefits</h2>
                <div className="benefit-list">
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-heart-pulse"></i>
                    </div>
                    <div>Comprehensive health insurance</div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-coin"></i>
                    </div>
                    <div>Generous retirement plans</div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-calendar-check"></i>
                    </div>
                    <div>Unlimited vacation policy</div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-house"></i>
                    </div>
                    <div>Remote work flexibility</div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-mortarboard"></i>
                    </div>
                    <div>Professional development fund</div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i className="bi bi-tree"></i>
                    </div>
                    <div>Paid parental leave</div>
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

export default CompanyProfile;
