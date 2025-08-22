import { useEffect, useState } from "react";
import Breadcrumb from "./Breadcrumb";
import BurgerIcon from "./BurgerIcon";
import Footer from "./Footer";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import PageHead from "./PageHead";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

export default function Layout({
  headTitle,
  breadcrumbTitle,
  breadcrumbActive,
  children,
}) {
  const [isToggled, setToggled] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const handleToggle = () => {
    setToggled(!isToggled);
    !isToggled
      ? document.body.classList.add("mobile-menu-active")
      : document.body.classList.remove("mobile-menu-active");
  };

  useEffect(() => {
    const WOW = require("wowjs");
    window.wow = new WOW.WOW({
      live: false,
    });
    window.wow.init();
  });
  return (
    <>
      <PageHead headTitle={headTitle} />
      <div className="body-overlay-1" onClick={handleToggle} />
      <Header />
      <BurgerIcon handleToggle={handleToggle} isToggled={isToggled} />
      <MobileMenu handleToggle={handleToggle} isToggled={isToggled} />
      <main className="main full-height">
        <Sidebar />
        <div className="box-content">
          {/* {breadcrumbTitle && (
            <Breadcrumb
              breadcrumbTitle={breadcrumbTitle}
              breadcrumbActive={breadcrumbActive}
            />
          )} */}
          {/* <div className="row"> */}
          {children}
          {/* </div> */}
          {/* <Footer /> */}
        </div>
      </main>
    </>
  );
}
