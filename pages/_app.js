import Preloader from "@/components/elements/Preloader";
import { useEffect, useState } from "react";
import "@/public/assets/css/style.css";
import "@/public/assets/css/custom.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import store, { persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("jobportaltoken");

  //   // Protected routes - customize as needed
  //   const publicPaths = ["/login", "/register"];
  //   const pathIsProtected = !publicPaths.includes(router.pathname);

  //   if (!token && pathIsProtected) {
  //     router.push("/login");
  //   }

  //   if (token && router.pathname === "/login") {
  //     router.push("/");
  //   }
  // }, [router.pathname]);
  return (
    <>
      {" "}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {!loading ? <Component {...pageProps} /> : <Preloader />}
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
