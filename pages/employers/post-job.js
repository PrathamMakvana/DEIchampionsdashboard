"use client";
import {
  createJobs,
  updateJob,
  getJob,
  getJobCategories,
  getJobTypes,
  getDepartments,
  getSalaryData,
} from "@/api/job";
import DynamicSelect from "@/components/elements/DynamicSelect";
import Layout from "@/components/layout/Layout";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import cityStateData from "@/utils/countriesStatesCities.json";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";


const indiaData = cityStateData.find(
  (country) => country.name.toLowerCase() === "india"
);

// Sort states alphabetically
const indiaStates = indiaData?.states
  ?.map((st) => st.name)
  ?.sort((a, b) => a.localeCompare(b)) || [];



const CKEditor = dynamic(
  async () => {
    const { CKEditor } = await import("@ckeditor/ckeditor5-react");
    const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic"))
      .default;
    return function EditorComponent(props) {
      return <CKEditor editor={ClassicEditor} {...props} />;
    };
  },
  { ssr: false }
);

// Yup validation schema
const validationSchema = Yup.object({
  jobTitle: Yup.string().required("Job title is required"),
  jobDescription: Yup.string().required("Job description is required"),
  // area: Yup.string().required("Area is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  // country: Yup.string().required("Country is required"),
  status: Yup.string().required("Status is required"),
  salary: Yup.string().required("Salary range is required"),
  category: Yup.string().required("Category is required"),
  tags: Yup.string(),
  jobType: Yup.string().required("Job type is required"),
  department: Yup.string().required("Department is required"),
  jobLocation: Yup.string().required("Job location is required"),
  workExperience: Yup.string().required("Work experience is required"),
  candidateQualification: Yup.string().required(
    "Candidate qualification is required"
  ),
  genderPreference: Yup.string().required("Gender preference is required"),
  candidateIndustry: Yup.string().required("Candidate industry is required"),
  languages: Yup.string(),
  contactPerson: Yup.string().required("Contact person is required"),
  contactPhone: Yup.string().required("Contact phone is required"),
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
    // area: "",
    city: "",
    state: "",
    // country: "",
    status: "open",
    salary: "",
    category: "",
    tags: "",
    jobType: "",
    department: "",
    jobLocation: "",
    workExperience: "",
    candidateQualification: "",
    genderPreference: "",
    candidateIndustry: "",
    languages: "",
    contactPerson: "",
    contactPhone: "",
    allowDirectCall: false,
    callFrom: "09:30 am",
    callTo: "06:00 pm",
  });

  const {
    jobCategories,
    jobTypes,
    departments,
    currentJob,
    salaryRanges,
    loading,
  } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(getJobCategories());
    dispatch(getJobTypes());
    dispatch(getDepartments());
    dispatch(getSalaryData());

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
        // area: currentJob.area || "",
        city: currentJob.city || "",
        state: currentJob.state || "",
        // country: currentJob.country || "",
        status: currentJob.status || "open",
        salary: currentJob?.salary?._id || "",
        category: currentJob.category?._id || "",
        tags: Array.isArray(currentJob.tags) ? currentJob.tags.join(", ") : "",
        jobType: currentJob.jobType?._id || "",
        department: currentJob.department?._id || "",
        jobLocation: currentJob.jobLocation || "",
        workExperience: currentJob.workExperience || "",
        candidateQualification: currentJob.candidateQualification || "",
        genderPreference: currentJob.genderPreference || "",
        candidateIndustry: currentJob.candidateIndustry || "",
        languages: Array.isArray(currentJob.languages)
          ? currentJob.languages.join(", ")
          : "",
        contactPerson: currentJob.contactPerson || "",
        contactPhone: currentJob.contactPhone || "",
        allowDirectCall: currentJob.allowDirectCall || false,
        callFrom: currentJob.callFrom || "09:30 am",
        callTo: currentJob.callTo || "06:00 pm",
      };

      setInitialValues(values);
      formik.setValues(values);

      // Set cities based on state
if (currentJob.state) {
  const india = cityStateData.find(
    (country) => country.name?.toLowerCase() === "india"
  );

  const selected = india?.states?.find(
    (st) => st.name === currentJob.state
  );

  setCities(
    selected?.cities
      ? selected.cities.map((c) => c.name).sort((a, b) => a.localeCompare(b))
      : []
  );
}


    }
  }, [currentJob, isEditMode]);

  const salaryOptions = useMemo(() => {
    return salaryRanges.map((range) => ({
      value: range._id,
      label: range.range,
    }));
  }, [salaryRanges]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Convert tags and languages from string to array
      const submitData = {
        ...values,
        tags: values.tags
          ? values.tags.split(",").map((tag) => tag.trim())
          : [],
        languages: values.languages
          ? values.languages.split(",").map((lang) => lang.trim())
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

                                <CKEditor
                                  data={formik.values.jobDescription}
                                  onChange={(event, editor) => {
                                    const data = editor.getData();
                                    formik.setFieldValue(
                                      "jobDescription",
                                      data
                                    );
                                  }}
                                  onBlur={() =>
                                    formik.setFieldTouched(
                                      "jobDescription",
                                      true
                                    )
                                  }
                                  config={{
                                    placeholder:
                                      "Describe the job responsibilities, skills, etc.",
                                  }}
                                />

                                {formik.touched.jobDescription &&
                                  formik.errors.jobDescription && (
                                    <p className="text-danger">
                                      {formik.errors.jobDescription}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Department */}
                            <div className="col-lg-6 col-md-6">
                              <DynamicSelect
                                label="Department"
                                name="department"
                                formik={formik}
                                options={departments}
                                valueKey="_id"
                                labelKey="name"
                                placeholder="Select Department"
                              />
                            </div>

                            {/* Salary */}
                            <div className="col-lg-6 col-md-6">
                              <DynamicSelect
                                label="Salary Per Annual "
                                name="salary"
                                formik={formik}
                                options={salaryRanges}
                                valueKey="_id"
                                labelKey="range"
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
                                  Tags (Skills)
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
                                {formik.touched.tags && formik.errors.tags && (
                                  <p className="text-danger">
                                    {formik.errors.tags}
                                  </p>
                                )}
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

                            {/* Job Location */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Job Location *
                                </label>
                                <select
                                  name="jobLocation"
                                  className="form-control"
                                  value={formik.values.jobLocation}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">Select Job Location</option>
                                  <option value="On-site">On-site</option>
                                  <option value="Remote">Remote</option>
                                  <option value="Hybrid">Hybrid</option>
                                </select>
                                {formik.touched.jobLocation &&
                                  formik.errors.jobLocation && (
                                    <p className="text-danger">
                                      {formik.errors.jobLocation}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Work Experience */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Work Experience *
                                </label>
                                <select
                                  name="workExperience"
                                  className="form-control"
                                  value={formik.values.workExperience}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">Select Experience</option>
                                  <option value="Fresher">Fresher</option>
                                  <option value="0-1 years">0-1 years</option>
                                  <option value="1-3 years">1-3 years</option>
                                  <option value="3-5 years">3-5 years</option>
                                  <option value="5-7 years">5-7 years</option>
                                  <option value="7-10 years">7-10 years</option>
                                  <option value="10+ years">10+ years</option>
                                </select>
                                {formik.touched.workExperience &&
                                  formik.errors.workExperience && (
                                    <p className="text-danger">
                                      {formik.errors.workExperience}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Candidate Qualification */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Candidate Qualification *
                                </label>
                                <select
                                  name="candidateQualification"
                                  className="form-control"
                                  value={formik.values.candidateQualification}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">Select Qualification</option>
                                  <option value="High School">
                                    High School
                                  </option>
                                  <option value="Diploma">Diploma</option>
                                  <option value="Bachelor's Degree">
                                    Bachelor's Degree
                                  </option>
                                  <option value="Master's Degree">
                                    Master's Degree
                                  </option>
                                  <option value="PhD">PhD</option>
                                  <option value="Any">Any</option>
                                </select>
                                {formik.touched.candidateQualification &&
                                  formik.errors.candidateQualification && (
                                    <p className="text-danger">
                                      {formik.errors.candidateQualification}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Gender Preference */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Gender Preference *
                                </label>
                                <select
                                  name="genderPreference"
                                  className="form-control"
                                  value={formik.values.genderPreference}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Any">Any</option>
                                </select>
                                {formik.touched.genderPreference &&
                                  formik.errors.genderPreference && (
                                    <p className="text-danger">
                                      {formik.errors.genderPreference}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Candidate Industry */}
                            <div className="col-lg-6 col-md-6">
                              {/* <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Candidate Industry You Want to Hire From *
                                </label>
                                <input
                                  type="text"
                                  name="candidateIndustry"
                                  className="form-control"
                                  placeholder="e.g. IT, Healthcare, Finance"
                                  value={formik.values.candidateIndustry}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.candidateIndustry &&
                                  formik.errors.candidateIndustry && (
                                    <p className="text-danger">
                                      {formik.errors.candidateIndustry}
                                    </p>
                                  )}
                              </div> */}
                              <DynamicSelect
                                label="Candidate Industry You Want to Hire From *"
                                name="candidateIndustry"
                                formik={formik}
                                options={departments}
                                valueKey="name"
                                labelKey="name"
                                placeholder="Select Candidate Industry"
                              />
                            </div>

                            {/* Languages */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Language Knows *
                                </label>
                                <input
                                  type="text"
                                  name="languages"
                                  className="form-control"
                                  placeholder="e.g. English, Hindi, Spanish"
                                  value={formik.values.languages}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                <small className="text-muted">
                                  Separate languages with commas
                                </small>
                                {formik.touched.languages &&
                                  formik.errors.languages && (
                                    <p className="text-danger">
                                      {formik.errors.languages}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Communication Preferences */}
                            <div className="col-lg-12">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Allow candidates to call you directly?
                                </label>
                                <div className="d-flex gap-3">
                                  <label className="radio-btn">
                                    <input
                                      type="radio"
                                      name="allowDirectCall"
                                      value="true"
                                      checked={
                                        formik.values.allowDirectCall === true
                                      }
                                      onChange={() =>
                                        formik.setFieldValue(
                                          "allowDirectCall",
                                          true
                                        )
                                      }
                                    />
                                    Yes
                                  </label>
                                  <label className="radio-btn">
                                    <input
                                      type="radio"
                                      name="allowDirectCall"
                                      value="false"
                                      checked={
                                        formik.values.allowDirectCall === false
                                      }
                                      onChange={() =>
                                        formik.setFieldValue(
                                          "allowDirectCall",
                                          false
                                        )
                                      }
                                    />
                                    No
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Contact Person */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Contact person for calls *
                                </label>
                                <input
                                  type="text"
                                  name="contactPerson"
                                  className="form-control"
                                  placeholder="Recruiter name"
                                  value={formik.values.contactPerson}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.contactPerson &&
                                  formik.errors.contactPerson && (
                                    <p className="text-danger">
                                      {formik.errors.contactPerson}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Contact Phone */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Contact phone *
                                </label>
                                <input
                                  type="tel"
                                  name="contactPhone"
                                  className="form-control"
                                  placeholder="+91 98765 43210"
                                  value={formik.values.contactPhone}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.contactPhone &&
                                  formik.errors.contactPhone && (
                                    <p className="text-danger">
                                      {formik.errors.contactPhone}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Call Timing */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group mb-30">
                                <label className="font-sm color-text-mutted mb-10">
                                  Receive calls between
                                </label>
                                <div className="row">
                                  <div className="col-6">
                                    <select
                                      name="callFrom"
                                      className="form-control"
                                      value={formik.values.callFrom}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    >
                                      <option value="09:30 am">09:30 am</option>
                                      <option value="10:00 am">10:00 am</option>
                                      <option value="10:30 am">10:30 am</option>
                                      <option value="11:00 am">11:00 am</option>
                                      <option value="11:30 am">11:30 am</option>
                                      <option value="12:00 pm">12:00 pm</option>
                                    </select>
                                  </div>
                                  <div className="col-6">
                                    <select
                                      name="callTo"
                                      className="form-control"
                                      value={formik.values.callTo}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    >
                                      <option value="06:00 pm">06:00 pm</option>
                                      <option value="06:30 pm">06:30 pm</option>
                                      <option value="07:00 pm">07:00 pm</option>
                                      <option value="07:30 pm">07:30 pm</option>
                                      <option value="08:00 pm">08:00 pm</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Location - State */}
<div className="col-lg-6 col-md-6">
  <div className="form-group mb-30">
    <label className="font-sm color-text-mutted mb-10">State *</label>

    <select
      name="state"
      className="form-control"
      value={formik.values.state}
      onChange={(e) => {
        const stateValue = e.target.value;
        formik.setFieldValue("state", stateValue);

        // Find selected state from India
        const selectedState = indiaData.states.find(
          (st) => st.name === stateValue
        );

        // Set sorted cities
        setCities(
          selectedState
            ? [...selectedState.cities]
                .map((c) => c.name)
                .sort((a, b) => a.localeCompare(b))
            : []
        );

        formik.setFieldValue("city", "");
      }}
      onBlur={formik.handleBlur}
    >
      <option value="">Select State</option>

      {indiaStates.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>

    {formik.touched.state && formik.errors.state && (
      <p className="text-danger">{formik.errors.state}</p>
    )}
  </div>
</div>


                            {/* Location - City */}
<div className="col-lg-6 col-md-6">
  <div className="form-group mb-30">
    <label className="font-sm color-text-mutted mb-10">City *</label>

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
      <p className="text-danger">{formik.errors.city}</p>
    )}
  </div>
</div>

                            {/* Status */}
                            {isEditMode && (
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group mb-30">
                                  <label className="font-sm color-text-mutted mb-10">
                                    Status *
                                  </label>
                                  <select
                                    name="status"
                                    className="form-control"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  >
                                    <option value="">Select Status</option>
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                    <option value="draft">Draft</option>
                                  </select>
                                  {formik.touched.status &&
                                    formik.errors.status && (
                                      <p className="text-danger">
                                        {formik.errors.status}
                                      </p>
                                    )}
                                </div>
                              </div>
                            )}

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
