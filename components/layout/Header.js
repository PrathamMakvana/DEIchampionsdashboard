import { logoutUser } from "@/api/auth";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function Header() {
  const [scroll, setScroll] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });

  const employee = router.pathname.includes("employee");

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logoutUser());
        router.push("/login");
      }
    });
  };

  return (
    <>
      <header className={`header sticky-bar ${scroll ? "stick" : ""}`}>
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo">
                <Link className="d-flex justify-content-center" href="/">
                  <img
                    alt="jobBox"
                    src="/assets/imgs/page/dashboard/logo2.png"
                    style={{ width: "160px", height: "33px" }}
                    onError={(e) => {
                      // Fallback if image doesn't load
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<span style="font-size: 24px; font-weight: 700; color: #3b82f6;">JobPortal</span>';
                    }}
                  />
                </Link>
              </div>
            </div>
            <div className="header-search d-flex align-items-center gap-3">
              {/* Back Arrow (visible only on large screens) */}
              <div
                className="back-arrow d-none d-lg-block"
                onClick={() => router.back()}
              >
                <i className="bi bi-arrow-left"></i>
              </div>
              <div className="box-search">
                <form>
                  <input
                    className="form-control input-search"
                    type="text"
                    name="keyword"
                    placeholder="Search"
                  />
                </form>
              </div>
            </div>
            <div className="header-right">
              <div className="block-signin">
                {!employee && (
                  <Link
                    className="btn btn-default icon-edit hover-up"
                    href="/post-job"
                  >
                    Post Job
                  </Link>
                )}
                <Menu as="div" className="dropdown d-inline-block">
                  <Menu.Button as="a" className="btn btn-notify" />
                  <Menu.Items
                    as="ul"
                    className="dropdown-menu dropdown-menu-light dropdown-menu-end show"
                    style={{ right: "0", left: "auto" }}
                  >
                    <li>
                      <Link className="dropdown-item active" href="#">
                        10 notifications
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="#">
                        12 messages
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="#">
                        20 replies
                      </Link>
                    </li>
                  </Menu.Items>
                </Menu>

                <div className="member-login">
                  <img
                    alt={user?.name || "User"}
                    src={
                      user?.profilePhotoUrl ||
                      "/assets/imgs/page/dashboard/profile.png"
                    }
                    onError={(e) => {
                      e.target.src = "/assets/imgs/page/dashboard/profile.png";
                    }}
                  />
                  <div className="info-member">
                    <strong className="color-brand-1">
                      {user?.name || user?.companyName || "Steven Jobs"}
                    </strong>
                    <Menu as="div" className="dropdown">
                      <Menu.Button
                        as="a"
                        className="font-xs color-text-paragraph-2 icon-down"
                      >
                        {user?.roleId === 2
                          ? "Employer"
                          : user?.roleId === 3
                          ? "Employee"
                          : "Admin"}
                      </Menu.Button>
                      <Menu.Items
                        as="ul"
                        className="dropdown-menu dropdown-menu-light dropdown-menu-end show"
                        style={{ right: "0", left: "auto" }}
                      >
                        <li>
                          <Link
                            className="dropdown-item"
                            href={
                              employee
                                ? "/employee/Profile-details"
                                : "/employers/company-details"
                            }
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <span
                            className="dropdown-item"
                            style={{ cursor: "pointer" }}
                            onClick={handleLogout}
                          >
                            Logout
                          </span>
                        </li>
                      </Menu.Items>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
