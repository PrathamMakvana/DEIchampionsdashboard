import Preloader from "@/components/elements/Preloader";
import { useEffect, useState } from "react";
import "@/public/assets/css/style.css";
import "@/public/assets/css/custom.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import store, { persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

const ROLE = {
  ADMIN: 1,
  JOB_POSTER: 2,
  JOB_SEEKER: 3,
};

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jobportaltoken");
    const role = Number(localStorage.getItem("userRole"));
    const publicPaths = [
      "/employee/login",
      "/employee/register",
      "/employee/verify-email",
      "/forgot-password",
      "/employers/login",
      "/employers/register",
      "/employers/otp-verify",
      "/employee/otp-verify",
      "/verify-otp",
    ];

    const pathIsPublic = publicPaths.includes(router.pathname);
    const isEmployeeRoute = router.pathname.startsWith("/employee");
    const isEmployerRoute = router.pathname.startsWith("/employers");

    // ✅ Allow public routes for everyone (logged in or not)
    if (pathIsPublic) return;

    // 🧩 If route is not public, apply auth checks
    if (!isEmployeeRoute && !isEmployerRoute) {
      router.push("/employee/login");
      return;
    }

    if (!token) {
      router.push("/employee/login");
      return;
    }

    if (role === 0 || isNaN(role)) {
      router.push("/employee/login");
      return;
    }

    if (role === ROLE.JOB_SEEKER && isEmployerRoute) {
      router.push("/employee");
      return;
    }

    if (role === ROLE.JOB_POSTER && isEmployeeRoute) {
      router.push("/employers");
      return;
    }
  }, [router.pathname]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {!loading ? <Component {...pageProps} /> : <Preloader />}
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
