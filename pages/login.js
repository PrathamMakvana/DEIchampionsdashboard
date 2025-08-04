import Layout from "@/components/layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Swal from "sweetalert2";
import { loginUser } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const loading = useSelector((state) => state.auth.loading);
  const initialValues = {
    email: "",
    password: "",
    remember: false,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Min 8 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    console.log("Login Data", values);
    // Add your login logic here (API call etc.)
    const data = await dispatch(
      loginUser(values, {
        showSuccess: (msg) =>
          Swal.fire({
            icon: "success",
            title: "Success",
            text: msg,
            timer: 1500,
            showConfirmButton: false,
          }),
        showError: (msg) =>
          Swal.fire({
            icon: "error",
            title: "Error",
            text: msg,
          }),
      })
    );
    console.log("🚀data --->", data);

    if (data?.user?.roleId) {
      navigate.push(data.user.roleId === 3 ? "/employee" : "/employers");
    }
  };

  return (
    <>
      {/* <Layout breadcrumbTitle="Login" breadcrumbActive="Login"> */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-4">
        <div className="col-md-4 col-lg-5 col-xl-5">
          <div className="card shadow-sm p-3">
            <div className="text-center mb-3">
              <p className="font-sm text-brand-2 mb-1 small">Welcome back!</p>
              <h4 className="text-brand-1 mb-2">Member Login</h4>
              <p className="font-sm text-muted small">
                Access all features. No credit card required.
              </p>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="text-start">
                  <div className="form-group mb-2">
                    <label className="form-label small" htmlFor="email">
                      Email address *
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="form-control form-control-sm"
                      placeholder="example@mail.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label className="form-label small" htmlFor="password">
                      Password *
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className="form-control form-control-sm"
                      placeholder="********"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>

                  <div className="login_footer form-group d-flex justify-content-between mb-2">
                    <a className="text-muted small" href="#">
                      Forgot Password?
                    </a>
                  </div>

                  <div className="form-group mb-2">
                    <button
                      className="btn btn-brand-1 hover-up w-100 btn-sm button"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Login"}
                    </button>
                  </div>

                  <div className="text-muted text-center">
                    <small>
                      Don't have an account?
                      <Link href="/register"> Sign up</Link>
                    </small>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      {/* </Layout> */}
    </>
  );
}
