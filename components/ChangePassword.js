import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { updatePassword } from "@/api/auth";

// Validation schema
const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const ChangePasswordForm = () => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const result = await updatePassword(
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
        {
          showSuccess: (message) => {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: message,
              timer: 3000,
              showConfirmButton: false,
            });
            resetForm();
          },
          showError: (errorMessage) => {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: errorMessage,
            });
          },
        }
      );

      // If API returns success but no SweetAlert triggered
      if (result && result.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your password has been updated successfully.",
          timer: 3000,
          showConfirmButton: false,
        });
        resetForm();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="panel-white mb-30">
      <div className="box-padding">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <h4 style={{ color: "#2c3e50", marginBottom: 0 }}>Change Password</h4>
          <span
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "0.25rem 0.75rem",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
            }}
          >
            Security
          </span>
        </div>

        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={ChangePasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="oldPassword"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      color: "#495057",
                    }}
                  >
                    Current Password
                  </label>
                  <Field
                    type="password"
                    name="oldPassword"
                    placeholder="Enter your current password"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `2px solid ${
                        errors.oldPassword && touched.oldPassword
                          ? "#dc3545"
                          : "#e9ecef"
                      }`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <ErrorMessage
                    name="oldPassword"
                    component="div"
                    style={{
                      color: "#dc3545",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="newPassword"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      color: "#495057",
                    }}
                  >
                    New Password
                  </label>
                  <Field
                    type="password"
                    name="newPassword"
                    placeholder="Enter your new password"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `2px solid ${
                        errors.newPassword && touched.newPassword
                          ? "#dc3545"
                          : "#e9ecef"
                      }`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    style={{
                      color: "#dc3545",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    htmlFor="confirmPassword"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      color: "#495057",
                    }}
                  >
                    Confirm New Password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `2px solid ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "#dc3545"
                          : "#e9ecef"
                      }`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    style={{
                      color: "#dc3545",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background:
                      "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                    border: "none",
                    padding: "14px 40px",
                    fontWeight: 600,
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    color: "white",
                    fontSize: "1rem",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(220, 53, 69, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <i className="fas fa-key" style={{ marginRight: "8px" }}></i>
                  {isSubmitting ? "Updating..." : "Change Password"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
