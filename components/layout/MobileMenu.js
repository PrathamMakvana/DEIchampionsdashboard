import { mobileLinks } from "@/utils/sidebarArray";
import Link from "next/link";
import { useRouter } from "next/router";

export default function MobileMenu({ handleToggle, isToggled }) {
  const router = useRouter();

  return (
    <>
      <div
        className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${
          isToggled ? "sidebar-visible" : ""
        }`}
      >
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="perfect-scroll">
              <div className="mobile-search mobile-header-border mb-30">
                <form action="#">
                  <input type="text" placeholder="Search…" />
                  <i className="fi-rr-search" />
                </form>
              </div>
              <div className="mobile-menu-wrap mobile-header-border">
                {/* mobile menu start*/}
                <nav>
                  <ul className="main-menu">
                    {mobileLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          href={link.path}
                          className={
                            router.pathname === link.path
                              ? "dashboard2 active"
                              : "dashboard2"
                          }
                        >
                          <img
                            src={`../assets/imgs/page/dashboard/${link.icon}`}
                            alt="jobBox"
                          />
                          <span className="name">{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              {/* <div className="mobile-account">
                <h6 className="mb-10">Your Account</h6>
                <ul className="mobile-menu font-heading">
                  <li>
                    <Link href="/#">Profile</Link>
                  </li>
                  <li>
                    <Link href="/#">Work Preferences</Link>
                  </li>
                  <li>
                    <Link href="/#">Account Settings</Link>
                  </li>
                  <li>
                    <Link href="/#">Go Pro</Link>
                  </li>
                  <li>
                    <Link href="/page-signin">Sign Out</Link>
                  </li>
                </ul>
                <div className="mb-15 mt-15">
                  {" "}
                  <Link
                    className="btn btn-default icon-edit hover-up"
                    href="/post-job"
                  >
                    Post Job
                  </Link>
                </div>
              </div> */}
              {/* <div className="site-copyright">
                Copyright {new Date().getFullYear()} © JobBox. <br />
                Designed by AliThemes.
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
