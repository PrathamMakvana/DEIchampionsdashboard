"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const LoginPage = () => {
  const navigate = useRouter();
  return (
    <div className="box-content">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="rt-card bg-white p-4 p-md-5 position-relative overflow-hidden">
            {/* Decorative elements */}
            <div className="rt-decoration rt-decoration-1"></div>
            <div className="rt-decoration rt-decoration-2"></div>

            {/* Logo */}
            <div className="header-logo mb-3">
              <div className="d-flex justify-content-center">
                <img
                  alt="jobBox"
                  src="../assets/imgs/page/dashboard/logo2.png"
                  style={{ width: "60%", height: "auto" }}
                />
              </div>
            </div>

            <h2 className="text-center mb-4">Recruiter Login</h2>
            <p className="text-center text-muted mb-4">
              Access your Dei Champions recruiter account to find top diverse
              talent
            </p>

            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Company Email
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control rt-input"
                    id="email"
                    placeholder="your@company.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control rt-input"
                    id="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember"
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="rt-link">
                  Forgot password?
                </a>
              </div>

              <Link
                // type="submit"
                // onClick={() => navigate.push("/employers")}
                href="/employers"
                className="btn rt-btn-primary w-100 py-2 mb-3"
              >
                Login
              </Link>

              <div className="rt-divider">
                <span className="rt-divider-text">OR</span>
              </div>

              <div className="text-center mt-3">
                <p>
                  New to Dei Champions?{" "}
                  <a href="/employers/register" className="rt-link">
                    Create recruiter account
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
