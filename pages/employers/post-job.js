"use client";
import {
  createJobs,
  updateJob,
  getJob,
  getJobCategories,
  getJobTypes,
} from "@/api/job";
import DynamicSelect from "@/components/elements/DynamicSelect";
import Layout from "@/components/layout/Layout";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import cityStateData from "@/utils/cityState.json";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const salaryOptions = [
  { value: "10-20 lac", label: "10-20 lac" },
  { value: "20-30 lac", label: "20-30 lac" },
  { value: "30-40 lac", label: "30-40 lac" },
  { value: "40-50 lac", label: "40-50 lac" },
];

// Yup validation schema
const validationSchema = Yup.object({
  jobTitle: Yup.string().required("Job title is required"),
  jobDescription: Yup.string().required("Job description is required"),
  area: Yup.string().required("Area is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  salary: Yup.string().required("Salary range is required"),
  category: Yup.string().required("Category is required"),
  tags: Yup.string(),
  jobType: Yup.string().required("Job type is required"),
});

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = Boolean(id);

  const [cities, setCities] = useState([]);
  const [initialValues, setInitialValues] = useState({
    jobTitle: "",
    jobDescription: "",
    area: "",
    city: "",
    state: "",
    country: "",
    salary: "",
    category: "",
    tags: "",
    jobType: "",
  });

  const { jobCategories, jobTypes, currentJob, loading } = useSelector(
    (state) => state.job
  );
  console.log("🚀currentJob --->", currentJob);

  useEffect(() => {
    dispatch(getJobCategories());
    dispatch(getJobTypes());

    if (id) {
      dispatch(getJob(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (isEditMode && currentJob) {
      // Prefill form with existing job data
      const values = {
        jobTitle: currentJob.jobTitle || "",
        jobDescription: currentJob.jobDescription || "",
        area: currentJob.area || "",
        city: currentJob.city || "",
        state: currentJob.state || "",
        country: currentJob.country || "",
        salary: currentJob.salary || "",
        category: currentJob.category?._id || "",
        tags: Array.isArray(currentJob.tags) ? currentJob.tags.join(", ") : "",
        jobType: currentJob.jobType?._id || "",
      };

      setInitialValues(values);
      formik.setValues(values);

      // Set cities based on state
      if (currentJob.state) {
        const selected = cityStateData.data.find(
          (item) => item.state === currentJob.state
        );
        setCities(selected ? selected.cities : []);
      }
    }
  }, [currentJob, isEditMode]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Convert tags from string to array
      const submitData = {
        ...values,
        tags: values.tags
          ? values.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      if (isEditMode) {
        // Update existing job
        const data = await dispatch(
          updateJob(id, submitData, {
            showSuccess: (msg) =>
              Swal.fire({
                icon: "success",
                title: "Success",
                text: msg,
                timer: 1500,
                showConfirmButton: false,
              }).then(() => {
                router.push("/employers/manage-jobs");
              }),
            showError: (msg) =>
              Swal.fire({
                icon: "error",
                title: "Error",
                text: msg,
              }),
          })
        );
      } else {
        // Create new job
        const data = await dispatch(
          createJobs(submitData, {
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

        if (data) {
          resetForm();
          setCities([]); // Clear cities after successful submission
        }
      }
    },
  });

  return (
    <>
      <Layout
        breadcrumbTitle={isEditMode ? "Edit Job" : "Post New Job"}
        breadcrumbActive={isEditMode ? "Edit Job" : "Post New Job"}
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="section-box">
              <div className="container">
                <div className="panel-white mb-30">
                  <div className="box-padding bg-postjob">
                    <h5 className="icon-edu">Tell us about your role</h5>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="row mt-30">
                        <div className="col-lg-9">
                          <div className="row">
                            {/* Job Title */}
                            <div className="col-lg-12">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Job title *
                                </label>
                                <input
                                  type="text"
                                  name="jobTitle"
                                  className="form-control"
                                  placeholder="e.g. Senior Product Designer"
                                  value={formik.values.jobTitle}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.jobTitle &&
                                  formik.errors.jobTitle && (
                                    <p className="text-danger">
                                      {formik.errors.jobTitle}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Job Description */}
                            <div className="col-lg-12">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Add your job description *
                                </label>
                                <textarea
                                  name="jobDescription"
                                  className="form-control"
                                  rows={6}
                                  placeholder="Describe the job responsibilities, skills, etc."
                                  value={formik.values.jobDescription}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.jobDescription &&
                                  formik.errors.jobDescription && (
                                    <p className="text-danger">
                                      {formik.errors.jobDescription}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Salary */}
                            <div className="col-lg-6 col-md-6">
                              <DynamicSelect
                                label="Salary"
                                name="salary"
                                formik={formik}
                                options={salaryOptions}
                                valueKey="value"
                                labelKey="label"
                                placeholder="Select Salary"
                              />
                            </div>

                            {/* Category */}
                            <div className="col-lg-6 col-md-6">
                              <DynamicSelect
                                label="Job Category"
                                name="category"
                                formik={formik}
                                options={jobCategories}
                                valueKey="_id"
                                labelKey="title"
                                placeholder="Select Category"
                              />
                            </div>

                            {/* Tags */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Tags (optional)
                                </label>
                                <input
                                  type="text"
                                  name="tags"
                                  className="form-control"
                                  placeholder="Figma, UI/UX, Sketch..."
                                  value={formik.values.tags}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                <small className="text-muted">
                                  Separate tags with commas
                                </small>
                              </div>
                            </div>

                            {/* Job Type */}
                            <div className="col-lg-6 col-md-6">
                              <DynamicSelect
                                label="Job Type"
                                name="jobType"
                                formik={formik}
                                options={jobTypes}
                                valueKey="_id"
                                labelKey="name"
                                placeholder="Select Type"
                              />
                            </div>

                            {/* Location - Area */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Area *
                                </label>
                                <input
                                  type="text"
                                  name="area"
                                  className="form-control"
                                  placeholder="Area"
                                  value={formik.values.area}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.area && formik.errors.area && (
                                  <p className="text-danger">
                                    {formik.errors.area}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Location - State */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  State *
                                </label>
                                <select
                                  name="state"
                                  className="form-control"
                                  value={formik.values.state}
                                  onChange={(e) => {
                                    const stateValue = e.target.value;
                                    formik.setFieldValue("state", stateValue);

                                    // Update city dropdown options dynamically
                                    if (stateValue) {
                                      const selected = cityStateData.data.find(
                                        (item) => item.state === stateValue
                                      );
                                      setCities(
                                        selected ? selected.cities : []
                                      );
                                      // Clear city if state changes
                                      formik.setFieldValue("city", "");
                                    } else {
                                      setCities([]);
                                      formik.setFieldValue("city", "");
                                    }
                                  }}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">Select State</option>
                                  {cityStateData.data.map((item) => (
                                    <option key={item.state} value={item.state}>
                                      {item.state}
                                    </option>
                                  ))}
                                </select>
                                {formik.touched.state &&
                                  formik.errors.state && (
                                    <p className="text-danger">
                                      {formik.errors.state}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Location - City */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  City *
                                </label>
                                <select
                                  name="city"
                                  className="form-control"
                                  value={formik.values.city}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">Select City</option>
                                  {cities.map((city) => (
                                    <option key={city} value={city}>
                                      {city}
                                    </option>
                                  ))}
                                </select>
                                {formik.touched.city && formik.errors.city && (
                                  <p className="text-danger">
                                    {formik.errors.city}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Location - Country */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Country *
                                </label>
                                <input
                                  type="text"
                                  name="country"
                                  className="form-control"
                                  placeholder="Country"
                                  value={formik.values.country}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.country &&
                                  formik.errors.country && (
                                    <p className="text-danger">
                                      {formik.errors.country}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Submit Button */}
                            <div className="col-lg-12">
                              <div className="form-group mt-10">
                                <button
                                  type="submit"
                                  className="btn btn-default btn-brand icon-tick"
                                  disabled={formik.isSubmitting}
                                >
                                  {formik.isSubmitting
                                    ? isEditMode
                                      ? "Updating..."
                                      : "Posting..."
                                    : isEditMode
                                    ? "Update Job"
                                    : "Post New Job"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
