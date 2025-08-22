import { logoutUser } from "@/api/auth";
import { employeeLinks, employersLinks } from "@/utils/sidebarArray";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const percentage = 67;

export default function Sidebar() {
  const [isToggled, setToggled] = useState(false);
  const dispatch = useDispatch();
  const toggleTrueFalse = () => setToggled(!isToggled);
  const router = useRouter();
  const isEmployeeRoute = router.pathname.startsWith("/employee");
  const handleLogout = () => {
    dispatch(logoutUser());

    router.push(isEmployeeRoute ? "/employee/login" : "/employers/login");
  };

  const sidebarLinks = router.pathname.includes("employee")
    ? employeeLinks
    : employersLinks;
  return (
    <>
      <div className={`nav ${isToggled ? "close-nav" : ""}`}>
        <a
          className={`btn btn-expanded ${isToggled ? "btn-collapsed" : ""}`}
          onClick={toggleTrueFalse}
        />
        <nav className="nav-main-menu">
          <ul className="main-menu">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={
                    router.pathname === link.path
                      ? "dashboard2 active"
                      : "dashboard2"
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                  onClick={(e) => {
                    if (link.label === "Logout") {
                      e.preventDefault(); // stop Next.js navigation
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You will be logged out!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, logout",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleLogout();
                        }
                      });
                    }
                  }}
                >
                  <i
                    className={link.icon}
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: router.pathname === link.path ? "white" : "black",
                      marginRight: "10px",
                      minWidth: "24px",
                      textAlign: "center",
                    }}
                  />
                  <span className="name">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* <div className="border-bottom mb-20 mt-20" /> */}
        {/* <div className="box-profile-completed text-center mb-30">
          <div
            style={{ width: "50%", margin: "0 auto" }}
            className="mt-30 mb-30"
          >
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              background
              backgroundPadding={0}
              styles={buildStyles({
                backgroundColor: "#D8E0FD",
                textColor: "#05264E",
                pathColor: "#3498DB",
                trailColor: "transparent",
                strokeLinecap: "butt",
              })}
            />
          </div>
          <h6 className="mb-10">Profile Completed</h6>
          <p className="font-xs color-text-mutted">
            Please add detailed information to your profile. This will help you
            develop your career more quickly.
          </p>
        </div>
        <div className="sidebar-border-bg mt-50">
          <span className="text-grey">WE ARE</span>
          <span className="text-hiring">HIRING</span>
          <p className="font-xxs color-text-paragraph mt-5">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
            architecto
          </p>
          <div className="mt-15">
            <Link className="btn btn-paragraph-2" href="#">
              Know More
            </Link>
          </div>
        </div> */}
      </div>
    </>
  );
}
