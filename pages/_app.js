import Head from "next/head"; // ✅ Add this import
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
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((err) => console.error("Service Worker error:", err));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jobportaltoken");
    const role = Number(localStorage.getItem("userRole"));
    const publicPaths = [
      "/job-seeker/login",
      "/job-seeker/register",
      "/verify-email",
      "/forgot-password",
      "/recruiter/login",
      "/recruiter/register",
      "/recruiter/otp-verify",
      "/job-seeker/otp-verify",
      "/verify-otp",
      "/reset-password",
    ];

    const pathIsPublic = publicPaths.includes(router.pathname);
    const isEmployeeRoute = router.pathname.startsWith("/job-seeker");
    const isEmployerRoute = router.pathname.startsWith("/recruiter");

    // ✅ Allow public routes for everyone (logged in or not)
    if (pathIsPublic) return;

    // 🧩 If route is not public, apply auth checks
    if (!isEmployeeRoute && !isEmployerRoute) {
      router.push("/job-seeker/login");
      return;
    }

    if (!token) {
      router.push("/job-seeker/login");
      return;
    }

    if (role === 0 || isNaN(role)) {
      router.push("/job-seeker/login");
      return;
    }

    if (role === ROLE.JOB_SEEKER && isEmployerRoute) {
      router.push("/job-seeker");
      return;
    }

    if (role === ROLE.JOB_POSTER && isEmployeeRoute) {
      router.push("/recruiter");
      return;
    }
  }, [router.pathname]);

  return (
    <>
      {/* ✅ Global Meta Tags */}
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Job Portal - Find your dream job or hire perfect candidates"
        />
        <meta
          name="keywords"
          content="jobs, employment, career, hiring, recruitment, job portal"
        />
        <meta name="author" content="Job Portal" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Job Portal" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Canonical URL - dynamic based on current route */}
        <link rel="canonical" href={`https://yourdomain.com${router.asPath}`} />
      </Head>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {!loading ? <Component {...pageProps} /> : <Preloader />}
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
