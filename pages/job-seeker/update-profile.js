import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import DynamicSelect from "@/components/elements/DynamicSelect";
import {
  getDepartments,
  getJobCategories,
  getJobTypes,
  getSalaryData,
} from "@/api/job";
import { getuser, updateUserProfileWithResume } from "@/api/auth";
import Swal from "sweetalert2";
import moment from "moment";
import locationData from "../../utils/countriesStatesCities.json";
import degreeList from "../../utils/degree.json";
import instituteList from "../../utils/institute.json";
import positionList from "../../utils/position.json";

const noticePeriodOptions = [
  { value: "immediate", label: "Immediate" },
  { value: "15-days", label: "15 Days" },
  { value: "30-days", label: "30 Days" },
  { value: "60-days", label: "60 Days" },
  { value: "90-days", label: "90 Days" },
  { value: "more-than-90-days", label: "More than 90 Days" },
];

const totalExperienceOptions = [
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-8", label: "5-8 years" },
  { value: "8-10", label: "8-10 years" },
  { value: "10-15", label: "10-15 years" },
  { value: "15+", label: "15+ years" },
];

const validationSchema = Yup.object().shape({
  name: Yup.string().nullable().notRequired(),
  email: Yup.string().email("Invalid email").nullable().notRequired(),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
    .nullable()
    .notRequired(),
  workStatus: Yup.string().nullable().notRequired(),
  address: Yup.string().nullable().notRequired(),
  city: Yup.string().nullable().notRequired(),
  state: Yup.string().nullable().notRequired(),
  country: Yup.string().nullable().notRequired(),

  dateOfBirth: Yup.date()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .max(new Date(), "Date of birth cannot be in the future")
    .notRequired(),

  pincode: Yup.string()
    .matches(/^$|^[0-9]{6}$/, "Pincode must be 6 digits") // Allow empty string
    .nullable()
    .notRequired(),

  employeeDescription: Yup.string().nullable().notRequired(),
  gender: Yup.string().nullable().notRequired(),
  totalWorkExperience: Yup.string().nullable().notRequired(),
  noticePeriod: Yup.string().nullable().notRequired(),
  currentSalary: Yup.string().nullable().notRequired(),

  department: Yup.array().of(Yup.string().nullable()).nullable().notRequired(),
  industry: Yup.array().of(Yup.string().nullable()).nullable().notRequired(),

  education: Yup.array()
    .of(
      Yup.object().shape({
        degree: Yup.string().nullable().notRequired(),
        institution: Yup.string().nullable().notRequired(),
        graduationYear: Yup.number()
          .nullable()
          .transform((v, o) => (o === "" ? null : v))
          .min(1950, "Year must be >= 1950")
          .max(2030, "Year must be <= 2030")
          .notRequired(),
      })
    )
    .nullable()
    .notRequired(),

  experience: Yup.array()
    .of(
      Yup.object().shape({
        companyName: Yup.string().nullable().notRequired(),
        position: Yup.string().nullable().notRequired(),
        startDate: Yup.date()
          .nullable()
          .transform((v, o) => (o === "" ? null : v))
          .notRequired(),
        endDate: Yup.date()
          .nullable()
          .transform((v, o) => (o === "" ? null : v))
          .notRequired(),
        currentJob: Yup.boolean().notRequired(),
        description: Yup.string().nullable().notRequired(),
      })
    )
    .nullable()
    .notRequired(),
});

export default function UserProfileUpdate() {
  const user = useSelector((state) => state.auth.user);
  console.log("🚀user --->", user);
  const dispatch = useDispatch();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [skills, setSkills] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [industries, setIndustries] = useState([]);
  const fileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [preferredLocations, setPreferredLocations] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New states for department and industry dropdowns
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [industrySearch, setIndustrySearch] = useState("");
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  useEffect(() => {
    dispatch(getuser());
  }, [dispatch]);

  const {
    jobCategories,
    jobTypes,
    departments: departmentOptions,
    salaryRanges,
    loading,
  } = useSelector((state) => state.job);
  console.log("🚀salaryRanges --->", salaryRanges);
  console.log("🚀jobCategories --->", jobCategories);
  console.log("🚀departments --->", departmentOptions);

  useEffect(() => {
    dispatch(getJobCategories());
    dispatch(getJobTypes());
    dispatch(getDepartments());
    dispatch(getSalaryData());
  }, [dispatch]);

  // Transform API data for dropdowns
  const salaryOptions =
    salaryRanges?.map((range) => ({
      value: range._id,
      label: range.range,
    })) || [];

  const departmentSelectOptions =
    departmentOptions?.map((dept) => ({
      value: dept._id,
      label: dept.name,
    })) || [];

  const industrySelectOptions =
    jobCategories?.map((category) => ({
      value: category._id,
      label: category.title,
    })) || [];

  console.log("Location Data Sample:", locationData?.[0]);

  useEffect(() => {
    if (user?.profilePhotoUrl) {
      setPhotoPreview(user.profilePhotoUrl);
    }
    if (user?.resumeUrl) {
      setResumeFileName(user.resumeUrl.split("/").pop());
    }
  }, [user]);

  useEffect(() => {
    // Filter to only show India
    const indiaOnly = locationData.filter(
      (country) => country.name === "India"
    );
    setCountries(indiaOnly.map((country) => country.name));
  }, []);

  const defaultInitialValues = {
    name: "",
    email: "",
    mobile: "",
    dateOfBirth: null,
    employeeDescription: "",
    gender: "",
    workStatus: "unemployed",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    currentPassword: "",
    newPassword: "",
    jobType: "",
    department: [],
    category: "",
    salaryRange: "",
    industry: [],
    totalWorkExperience: "",
    noticePeriod: "",
    currentSalary: "",
    preferredLocations: [],

    education: [
      {
        degree: "",
        institution: "",
        graduationYear: null,
      },
    ],

    experience: [
      {
        companyName: "",
        position: "",
        startDate: null,
        endDate: null,
        currentJob: false,
        description: "",
      },
    ],
  };

  // function useScrollToError(errors, touched) {
  //   useEffect(() => {
  //     const errorKeys = Object.keys(errors);
  //     if (errorKeys.length > 0) {
  //       // Find the first touched + errored field
  //       const firstErrorKey = errorKeys.find((key) => touched[key] || true);
  //       if (firstErrorKey) {
  //         const errorElement = document.querySelector(
  //           `[name="${firstErrorKey}"]`
  //         );

  //         if (
  //           errorElement &&
  //           typeof errorElement.scrollIntoView === "function"
  //         ) {
  //           errorElement.scrollIntoView({
  //             behavior: "smooth",
  //             block: "center",
  //           });
  //           errorElement.focus();
  //         }
  //       }
  //     }
  //   }, [errors]);
  // }

  const formik = useFormik({
    initialValues: defaultInitialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append all form fields
      Object.keys(values).forEach((key) => {
        if (values[key] !== null && values[key] !== undefined) {
          if (["education", "experience"].includes(key)) {
            formData.append(key, JSON.stringify(values[key]));
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      // Append photo file if exists
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      // Append resume file if exists
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      // Append skills
      formData.append("skills", JSON.stringify(skills));

      // Append departments and industries
      formData.append("departments", JSON.stringify(departments));
      formData.append("industries", JSON.stringify(industries));

      // Create preferences object with preferred locations (OLD LOGIC)
      const preferences = {
        jobTypes: values.jobType ? [values.jobType] : [],
        department: departments, // Use departments from state
        category: values.category ? [values.category] : [],
        salary_range: values.salaryRange || "",
        preffered_locations: preferredLocations, // Add preferred locations from state
        industry: industries, // Use industries from state
      };

      // Append preferences (OLD LOGIC)
      formData.append("preferences", JSON.stringify(preferences));

      // Append professional fields
      if (values.totalWorkExperience) {
        formData.append("totalWorkExperience", values.totalWorkExperience);
      }
      if (values.noticePeriod) {
        formData.append("noticePeriod", values.noticePeriod);
      }
      if (values.currentSalary) {
        formData.append("currentSalary", values.currentSalary);
      }

      const data = await dispatch(
        updateUserProfileWithResume(formData, {
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

      if (data?.success) {
        setPhotoFile(null);
        setResumeFile(null);
      }

      setIsSubmitting(false);
    },
    enableReinitialize: true,
  });

  // useScrollToError(formik.errors, formik.touched);

  useEffect(() => {
    if (user) {
      // Initialize departments and industries from user data
      const userDepartments = user.department
        ? Array.isArray(user.department)
          ? user.department
          : [user.department]
        : [];
      const userIndustries = user.industry
        ? Array.isArray(user.industry)
          ? user.industry
          : [user.industry]
        : [];

      // Extract IDs if objects
      const departmentIds = userDepartments.map((dept) => dept._id || dept);
      const industryIds = userIndustries.map((ind) => ind._id || ind);

      formik.setValues({
        ...defaultInitialValues,
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        dateOfBirth: user.dateOfBirth
          ? moment(user.dateOfBirth).format("YYYY-MM-DD")
          : "",
        gender: user.gender || "",
        employeeDescription: user.employeeDescription || "",
        workStatus: user.workStatus || "unemployed",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "India",
        pincode: user.pincode || "",
        totalWorkExperience: user.totalWorkExperience || "",
        noticePeriod: user.noticePeriod || "",
        currentSalary: user.currentSalary || "",
        department: departmentIds,
        industry: industryIds,
        education:
          user.education?.length > 0
            ? user.education
            : defaultInitialValues.education,
        experience:
          user.experience?.length > 0
            ? user.experience
            : defaultInitialValues.experience,
        jobType:
          user.preferences?.jobTypes?.[0]?._id ||
          user.preferences?.jobTypes?.[0] ||
          "",
        category:
          user.preferences?.category?.[0]?._id ||
          user.preferences?.category?.[0] ||
          "",
        salaryRange:
          user.preferences?.salary_range?._id ||
          user.preferences?.salary_range ||
          "",
      });

      setSkills(user.skills || []);
      setPreferredLocations(user.preferences?.preffered_locations || []);

      // Set departments and industries for display
      setDepartments(departmentIds);
      setIndustries(industryIds);
    }
  }, [user]);

  useEffect(() => {
    // Automatically set India and load its states
    const indiaData = locationData.find((c) => c.name === "India");
    if (indiaData) {
      setStates(indiaData.states.map((s) => s.name));
    }
  }, []);

  useEffect(() => {
    if (formik.values.country) {
      handleCountryChange({ target: { value: formik.values.country } }, true);
    }
  }, [formik.values.country]);

  useEffect(() => {
    if (formik.values.state && formik.values.country) {
      handleStateChange({ target: { value: formik.values.state } }, true);
    }
  }, [formik.values.state]);

  useEffect(() => {
    // Flatten only Indian cities from locationData for the dropdown
    const cities = [];
    const indiaData = locationData.find((country) => country.name === "India");

    if (indiaData) {
      indiaData.states.forEach((state) => {
        state.cities.forEach((city) => {
          cities.push({
            name: city.name,
            state: state.name,
            country: indiaData.name,
          });
        });
      });
    }

    setAllCities(cities);
  }, []);

  const addPreferredLocation = (location) => {
    if (location && !preferredLocations.includes(location)) {
      setPreferredLocations([...preferredLocations, location]);
    }
    setLocationSearch("");
    setShowLocationDropdown(false);
  };

  const removePreferredLocation = (index) => {
    const newLocations = [...preferredLocations];
    newLocations.splice(index, 1);
    setPreferredLocations(newLocations);
  };

  // Department functions
  const addDepartment = (departmentValue = null) => {
    const valueToAdd = departmentValue || departmentSearch.trim();
    if (valueToAdd && !departments.includes(valueToAdd)) {
      const newDepartments = [...departments, valueToAdd];
      setDepartments(newDepartments);
      formik.setFieldValue("department", newDepartments);
    }
    setDepartmentSearch("");
    setShowDepartmentDropdown(false);
  };

  const removeDepartment = (index) => {
    const newDepartments = [...departments];
    newDepartments.splice(index, 1);
    setDepartments(newDepartments);
    formik.setFieldValue("department", newDepartments);
  };

  // Industry functions
  const addIndustry = (industryValue = null) => {
    const valueToAdd = industryValue || industrySearch.trim();
    if (valueToAdd && !industries.includes(valueToAdd)) {
      const newIndustries = [...industries, valueToAdd];
      setIndustries(newIndustries);
      formik.setFieldValue("industry", newIndustries);
    }
    setIndustrySearch("");
    setShowIndustryDropdown(false);
  };

  const removeIndustry = (index) => {
    const newIndustries = [...industries];
    newIndustries.splice(index, 1);
    setIndustries(newIndustries);
    formik.setFieldValue("industry", newIndustries);
  };

  // Filter departments based on search
  const getFilteredDepartments = () => {
    if (!departmentSearch) return departmentSelectOptions.slice(0, 50);

    const searchLower = departmentSearch.toLowerCase();
    return departmentSelectOptions
      .filter((dept) => dept.label.toLowerCase().includes(searchLower))
      .slice(0, 50);
  };

  // Filter industries based on search
  const getFilteredIndustries = () => {
    if (!industrySearch) return industrySelectOptions.slice(0, 50);

    const searchLower = industrySearch.toLowerCase();
    return industrySelectOptions
      .filter((industry) => industry.label.toLowerCase().includes(searchLower))
      .slice(0, 50);
  };

  // Filter cities based on search (with performance optimization)
  const getFilteredCities = () => {
    if (!locationSearch) return allCities.slice(0, 50); // Show only first 50 when no search

    const searchLower = locationSearch.toLowerCase();
    return allCities
      .filter(
        (city) =>
          city.name.toLowerCase().includes(searchLower) ||
          city.state.toLowerCase().includes(searchLower) ||
          city.country.toLowerCase().includes(searchLower)
      )
      .slice(0, 50); // Limit to 50 results for performance
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  // Drag and drop handlers for resume
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Check if file is a valid resume type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (validTypes.includes(file.type)) {
        setResumeFile(file);
        setResumeFileName(file.name);
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid File",
          text: "Please upload only PDF, DOC, or DOCX files.",
        });
      }
    }
  };

  // Download resume function
  const downloadResume = async () => {
    if (!user?.resume) return;

    const resumePath = user.resume.replace(/^src[\\/]/, "");
    const resumeUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${resumePath}`;

    try {
      const response = await fetch(resumeUrl);

      if (!response.ok) {
        console.error("Failed to fetch resume file.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      // Determine final filename
      const fileName =
        resumeFileName ||
        user.resume.split("/").pop().replace(/^\d+-/, "") ||
        "resume.pdf";

      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  const addSkill = () => {
    const skillInput = document.getElementById("skillInput");
    const skill = skillInput.value.trim();
    if (skill) {
      setSkills([...skills, skill]);
      skillInput.value = "";
    }
  };

  const removeSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const handleCountryChange = (e, preserveExisting = false) => {
    const selectedCountry = e.target.value;

    formik.setFieldValue("country", selectedCountry);

    if (!preserveExisting) {
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
    }

    const countryObj = locationData.find((c) => c.name === selectedCountry);
    if (countryObj) {
      setStates(countryObj.states.map((s) => s.name));
      if (!preserveExisting) setCities([]); // reset cities only if not preserving
    }
  };

  const handleStateChange = (e, preserveCity = false) => {
    const selectedState = e.target.value;
    formik.setFieldValue("state", selectedState);

    if (!preserveCity) formik.setFieldValue("city", "");

    const countryObj = locationData.find((country) =>
      country.states.some((s) => s.name === selectedState)
    );

    if (countryObj) {
      formik.setFieldValue("country", countryObj.name);

      const stateObj = countryObj.states.find((s) => s.name === selectedState);
      if (stateObj) {
        setCities(stateObj.cities.map((city) => city.name));
      }
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    formik.setFieldValue("city", selectedCity);

    // find state and country for the selected city
    for (const country of locationData) {
      for (const state of country.states) {
        const cityFound = state.cities.find((c) => c.name === selectedCity);
        if (cityFound) {
          formik.setFieldValue("state", state.name);
          formik.setFieldValue("country", country.name);
          return;
        }
      }
    }
  };

  // Add click outside handlers for all dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Location dropdown
      if (
        showLocationDropdown &&
        !event.target.closest(".user-upt-profile-skill-input-container")
      ) {
        setShowLocationDropdown(false);
      }

      // Department dropdown
      if (
        showDepartmentDropdown &&
        !event.target.closest(".department-dropdown-container")
      ) {
        setShowDepartmentDropdown(false);
      }

      // Industry dropdown
      if (
        showIndustryDropdown &&
        !event.target.closest(".industry-dropdown-container")
      ) {
        setShowIndustryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLocationDropdown, showDepartmentDropdown, showIndustryDropdown]);

  return (
    <>
      <Layout>
        <div>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              {/* Basic Information Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-person me-2"></i> Basic Information
                </div>
                <div className="user-upt-profile-card-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            cursor: "pointer",
                            border: "3px solid #e9ecef",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#007bff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e9ecef";
                          }}
                          onClick={() => fileInputRef.current.click()}
                        >
                          {photoPreview ? (
                            <>
                              <img
                                src={photoPreview}
                                alt="Profile Photo"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  background: "rgba(0, 0, 0, 0.7)",
                                  color: "white",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  opacity: 0,
                                  transition: "opacity 0.3s ease",
                                  borderRadius: "50%",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = 1;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = 0;
                                }}
                              >
                                <i
                                  className="bi bi-camera"
                                  style={{
                                    fontSize: "24px",
                                    marginBottom: "5px",
                                  }}
                                ></i>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  Change Photo
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "100%",
                                  height: "100%",
                                  background: "#007bff",
                                  color: "white",
                                  fontSize: "48px",
                                  fontWeight: "bold",
                                }}
                              >
                                {user?.name
                                  ? user.name.charAt(0).toUpperCase()
                                  : "U"}
                              </span>
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  background: "rgba(0, 0, 0, 0.7)",
                                  color: "white",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  opacity: 0,
                                  transition: "opacity 0.3s ease",
                                  borderRadius: "50%",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = 1;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = 0;
                                }}
                              >
                                <i
                                  className="bi bi-camera"
                                  style={{
                                    fontSize: "24px",
                                    marginBottom: "5px",
                                  }}
                                ></i>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  Add Photo
                                </span>
                              </div>
                            </>
                          )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handlePhotoUpload}
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className="user-upt-profile-status-badge">
                          {user?.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="user-upt-profile-work-status">
                        {formik.values.workStatus === "unemployed"
                          ? "Looking for job"
                          : "Employed"}
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="form-control user-upt-profile-form-control"
                            name="name"
                            placeholder="Enter your full name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.name && formik.errors.name && (
                            <div className="text-danger">
                              {formik.errors.name}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="form-control user-upt-profile-form-control"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled
                          />
                          {formik.touched.email && formik.errors.email && (
                            <div className="text-danger">
                              {formik.errors.email}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            className="form-control user-upt-profile-form-control"
                            name="mobile"
                            placeholder="Enter your mobile number"
                            value={formik.values.mobile}
                            disabled
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.mobile && formik.errors.mobile && (
                            <div className="text-danger">
                              {formik.errors.mobile}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            className="form-control user-upt-profile-form-control"
                            placeholder="YYYY-MM-DD"
                            name="dateOfBirth"
                            value={formik.values.dateOfBirth || ""}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Gender
                          </label>
                          <select
                            className="form-select user-upt-profile-form-control"
                            name="gender"
                            value={formik.values.gender}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">
                              Prefer not to say
                            </option>
                          </select>
                          {formik.touched.gender && formik.errors.gender && (
                            <div className="text-danger">
                              {formik.errors.gender}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 user-upt-profile-form-group">
                          <label className="user-upt-profile-form-label">
                            Work Status
                          </label>
                          <select
                            className="form-select user-upt-profile-form-control"
                            name="workStatus"
                            value={formik.values.workStatus}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option value="">Select Status</option>
                            <option value="employed">Employed</option>
                            <option value="unemployed">Unemployed</option>
                            <option value="student">Student</option>
                            <option value="self-employed">Self-Employed</option>
                          </select>
                          {formik.touched.workStatus &&
                            formik.errors.workStatus && (
                              <div className="text-danger">
                                {formik.errors.workStatus}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="col-md-12 user-upt-profile-form-group">
                        <label className="user-upt-profile-form-label">
                          Description
                        </label>
                        <textarea
                          className="form-control user-upt-profile-form-control"
                          name="employeeDescription"
                          placeholder="Write a short description about yourself"
                          rows="4"
                          value={formik.values.employeeDescription}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.employeeDescription &&
                          formik.errors.employeeDescription && (
                            <div className="text-danger">
                              {formik.errors.employeeDescription}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-geo-alt me-2"></i> Location Information
                </div>
                <div className="user-upt-profile-card-body">
                  <div className="row">
                    {/* Address */}
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        placeholder="Enter your address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.address && formik.errors.address && (
                        <div className="text-danger">
                          {formik.errors.address}
                        </div>
                      )}
                    </div>

                    {/* Country */}
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Country *
                      </label>
                      <select
                        name="country"
                        className="form-control user-upt-profile-form-control"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled
                        style={{
                          backgroundColor: "#f5f5f5",
                          cursor: "not-allowed",
                        }}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country, index) => (
                          <option key={index} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      {formik.touched.country && formik.errors.country && (
                        <div className="text-danger">
                          {formik.errors.country}
                        </div>
                      )}
                    </div>

                    {/* State */}
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        State *
                      </label>
                      <select
                        name="state"
                        className="form-control user-upt-profile-form-control"
                        value={formik.values.state}
                        onChange={handleStateChange}
                        onBlur={formik.handleBlur}
                        disabled={!formik.values.country}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {formik.touched.state && formik.errors.state && (
                        <div className="text-danger">{formik.errors.state}</div>
                      )}
                    </div>

                    {/* City */}
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        City *
                      </label>
                      <select
                        name="city"
                        className="form-control user-upt-profile-form-control"
                        value={formik.values.city}
                        onChange={handleCityChange}
                        onBlur={formik.handleBlur}
                        disabled={!formik.values.state}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {formik.touched.city && formik.errors.city && (
                        <div className="text-danger">{formik.errors.city}</div>
                      )}
                    </div>

                    {/* Pincode */}
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your pincode"
                        className="form-control user-upt-profile-form-control"
                        name="pincode"
                        value={formik.values.pincode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.pincode && formik.errors.pincode && (
                        <div className="text-danger">
                          {formik.errors.pincode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information Card */}
              <div
                className="user-upt-profile-card"
                style={{ overflow: "visible" }}
              >
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-briefcase me-2"></i> Professional
                  Information
                </div>
                <div
                  className="user-upt-profile-card-body"
                  style={{ overflow: "visible" }}
                >
                  <div className="row">
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Total Work Experience *
                      </label>
                      <select
                        className="form-select user-upt-profile-form-control"
                        name="totalWorkExperience"
                        value={formik.values.totalWorkExperience}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Select Experience</option>
                        {totalExperienceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {formik.touched.totalWorkExperience &&
                        formik.errors.totalWorkExperience && (
                          <div className="text-danger">
                            {formik.errors.totalWorkExperience}
                          </div>
                        )}
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Notice Period *
                      </label>
                      <select
                        className="form-select user-upt-profile-form-control"
                        name="noticePeriod"
                        value={formik.values.noticePeriod}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Select Notice Period</option>
                        {noticePeriodOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {formik.touched.noticePeriod &&
                        formik.errors.noticePeriod && (
                          <div className="text-danger">
                            {formik.errors.noticePeriod}
                          </div>
                        )}
                    </div>

                    {/* Department - Multiple Select with Dropdown like Skills */}
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Industry *
                      </label>
                      <div
                        className="user-upt-profile-skill-input-container justify-content-between department-dropdown-container"
                        style={{ position: "relative" }}
                      >
                        <input
                          type="text"
                          className="form-control user-upt-profile-form-control"
                          placeholder="Search for a industry..."
                          value={departmentSearch}
                          onChange={(e) => setDepartmentSearch(e.target.value)}
                          onFocus={() => setShowDepartmentDropdown(true)}
                          style={{ width: "100%" }}
                        />

                        {showDepartmentDropdown && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              maxHeight: "200px",
                              overflowY: "auto",
                              backgroundColor: "white",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              marginTop: "4px",
                              zIndex: 10000,
                              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            }}
                            className="custom-scrollbar"
                          >
                            {getFilteredDepartments().length > 0 ? (
                              getFilteredDepartments().map((dept, index) => (
                                <div
                                  key={index}
                                  onClick={() => addDepartment(dept.value)}
                                  style={{
                                    padding: "10px 15px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #f0f0f0",
                                    transition: "background-color 0.2s",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#f8f9fa")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "white")
                                  }
                                >
                                  <div style={{ fontWeight: "500" }}>
                                    {dept.label}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div
                                style={{
                                  padding: "15px",
                                  textAlign: "center",
                                  color: "#6c757d",
                                }}
                              >
                                No industries found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div id="departmentsContainer" className="mt-2">
                        {departments.map((department, index) => (
                          <div
                            key={index}
                            className="user-upt-profile-skill-badge"
                          >
                            {departmentSelectOptions.find(
                              (dept) => dept.value === department
                            )?.label || department}
                            <span
                              className="user-upt-profile-skill-remove"
                              onClick={() => removeDepartment(index)}
                            >
                              ×
                            </span>
                          </div>
                        ))}
                      </div>
                      {formik.touched.department &&
                        formik.errors.department && (
                          <div className="text-danger">
                            {formik.errors.department}
                          </div>
                        )}
                    </div>

                    {/* Industry - Multiple Select with Dropdown like Skills */}
                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Which Category you prefered *
                      </label>
                      <div
                        className="user-upt-profile-skill-input-container justify-content-between industry-dropdown-container"
                        style={{ position: "relative" }}
                      >
                        <input
                          type="text"
                          className="form-control user-upt-profile-form-control"
                          placeholder="Search for a Category..."
                          value={industrySearch}
                          onChange={(e) => setIndustrySearch(e.target.value)}
                          onFocus={() => setShowIndustryDropdown(true)}
                          style={{ width: "100%" }}
                        />

                        {showIndustryDropdown && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              maxHeight: "200px",
                              overflowY: "auto",
                              backgroundColor: "white",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              marginTop: "4px",
                              zIndex: 10000,
                              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            }}
                            className="custom-scrollbar"
                          >
                            {getFilteredIndustries().length > 0 ? (
                              getFilteredIndustries().map((industry, index) => (
                                <div
                                  key={index}
                                  onClick={() => addIndustry(industry.value)}
                                  style={{
                                    padding: "10px 15px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #f0f0f0",
                                    transition: "background-color 0.2s",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#f8f9fa")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "white")
                                  }
                                >
                                  <div style={{ fontWeight: "500" }}>
                                    {industry.label}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div
                                style={{
                                  padding: "15px",
                                  textAlign: "center",
                                  color: "#6c757d",
                                }}
                              >
                                No job categories found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div id="industriesContainer" className="mt-2">
                        {industries.map((industry, index) => (
                          <div
                            key={index}
                            className="user-upt-profile-skill-badge"
                          >
                            {industrySelectOptions.find(
                              (ind) => ind.value === industry
                            )?.label || industry}
                            <span
                              className="user-upt-profile-skill-remove"
                              onClick={() => removeIndustry(index)}
                            >
                              ×
                            </span>
                          </div>
                        ))}
                      </div>
                      {formik.touched.industry && formik.errors.industry && (
                        <div className="text-danger">
                          {formik.errors.industry}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Current Annual Salary (optional)
                      </label>
                      <input
                        type="text"
                        className="form-control user-upt-profile-form-control"
                        name="currentSalary"
                        placeholder="Enter your current salary EX.10LPA"
                        value={formik.values.currentSalary}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.currentSalary &&
                        formik.errors.currentSalary && (
                          <div className="text-danger">
                            {formik.errors.currentSalary}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-tools me-2"></i> Skills
                </div>
                <div className="user-upt-profile-card-body">
                  <div className="user-upt-profile-form-group">
                    <label className="user-upt-profile-form-label">
                      Your Skills
                    </label>
                    <div className="user-upt-profile-skill-input-container justify-content-between">
                      <input
                        type="text"
                        className="form-control user-upt-profile-form-control"
                        placeholder="Add a skill"
                        id="skillInput"
                        style={{ width: "calc(100% - 120px)" }}
                      />
                      <button
                        type="button"
                        className="user-upt-profile-add-btn"
                        onClick={addSkill}
                      >
                        <i className="bi bi-plus-lg"></i> Add
                      </button>
                    </div>
                    <div id="skillsContainer">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="user-upt-profile-skill-badge"
                        >
                          {skill}
                          <span
                            className="user-upt-profile-skill-remove"
                            onClick={() => removeSkill(index)}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-book me-2"></i> Education
                </div>
                <div className="user-upt-profile-card-body">
                  <FieldArray name="education">
                    {({ push, remove }) => (
                      <div id="educationContainer">
                        {formik.values.education.map((entry, index) => (
                          <div key={index} className="user-upt-profile-entry">
                            {formik.values.education.length > 1 && (
                              <button
                                type="button"
                                className="user-upt-profile-remove-btn"
                                onClick={() => remove(index)}
                              >
                                <i className="bi bi-x-circle"></i>
                              </button>
                            )}
                            <div className="row">
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Highest Degree *
                                </label>
                                <select
                                  name={`education[${index}].degree`}
                                  className="form-control user-upt-profile-form-control"
                                  value={formik.values.education[index].degree}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">Select Degree</option>
                                  {degreeList.degrees.map((degree, i) => (
                                    <option key={i} value={degree}>
                                      {degree}
                                    </option>
                                  ))}
                                </select>

                                {formik.values.education[index].degree ===
                                  "Other" && (
                                  <input
                                    type="text"
                                    name={`education[${index}].degree`}
                                    placeholder="Enter your degree"
                                    className="form-control mt-2"
                                    onChange={formik.handleChange}
                                  />
                                )}

                                {formik.touched.education?.[index]?.degree &&
                                  formik.errors.education?.[index]?.degree && (
                                    <div className="text-danger">
                                      {formik.errors.education[index].degree}
                                    </div>
                                  )}
                              </div>

                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Institution *
                                </label>

                                <select
                                  name={`education[${index}].institution`}
                                  className="form-control user-upt-profile-form-control"
                                  value={
                                    formik.values.education[index].institution
                                  }
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">Select Institution</option>

                                  {/* Map through institution list */}
                                  {instituteList.institutions.map(
                                    (institute, i) => (
                                      <option key={i} value={institute}>
                                        {institute}
                                      </option>
                                    )
                                  )}
                                </select>

                                {formik.touched.education?.[index]
                                  ?.institution &&
                                  formik.errors.education?.[index]
                                    ?.institution && (
                                    <div className="text-danger">
                                      {
                                        formik.errors.education[index]
                                          .institution
                                      }
                                    </div>
                                  )}
                              </div>

                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Graduation Year *
                                </label>
                                <input
                                  type="number"
                                  className="form-control user-upt-profile-form-control"
                                  placeholder="e.g. 2020"
                                  min="1950"
                                  max="2030"
                                  name={`education[${index}].graduationYear`}
                                  value={
                                    formik.values.education[index]
                                      .graduationYear
                                  }
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.education?.[index]
                                  ?.graduationYear &&
                                  formik.errors.education?.[index]
                                    ?.graduationYear && (
                                    <div className="text-danger">
                                      {
                                        formik.errors.education[index]
                                          .graduationYear
                                      }
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="user-upt-profile-add-btn"
                          onClick={() =>
                            push({
                              degree: "",
                              institution: "",
                              graduationYear: "",
                            })
                          }
                        >
                          <i className="bi bi-plus-lg me-2"></i> Add Education
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              {/* Experience Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-briefcase me-2"></i> Work Experience
                </div>
                <div className="user-upt-profile-card-body">
                  <FieldArray name="experience">
                    {({ push, remove }) => (
                      <div id="experienceContainer">
                        {formik.values.experience.map((entry, index) => (
                          <div key={index} className="user-upt-profile-entry">
                            {formik.values.experience.length > 1 && (
                              <button
                                type="button"
                                className="user-upt-profile-remove-btn"
                                onClick={() => remove(index)}
                              >
                                <i className="bi bi-x-circle"></i>
                              </button>
                            )}
                            <div className="row">
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Company Name *
                                </label>
                                <input
                                  type="text"
                                  name={`experience[${index}].companyName`}
                                  value={
                                    formik.values.experience[index].companyName
                                  }
                                  placeholder="e.g. Example Corporation"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                                {formik.touched.experience?.[index]
                                  ?.companyName &&
                                  formik.errors.experience?.[index]
                                    ?.companyName && (
                                    <div className="text-danger">
                                      {
                                        formik.errors.experience[index]
                                          .companyName
                                      }
                                    </div>
                                  )}
                              </div>

                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Position *
                                </label>

                                <select
                                  name={`experience[${index}].position`}
                                  className="form-control user-upt-profile-form-control"
                                  value={
                                    formik.values.experience[index].position
                                  }
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">Select Position</option>

                                  {/* Map through position list */}
                                  {positionList.positions.map((pos, i) => (
                                    <option key={i} value={pos}>
                                      {pos}
                                    </option>
                                  ))}
                                </select>

                                {formik.touched.experience?.[index]?.position &&
                                  formik.errors.experience?.[index]
                                    ?.position && (
                                    <div className="text-danger">
                                      {formik.errors.experience[index].position}
                                    </div>
                                  )}
                              </div>

                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Start Date *
                                </label>
                                <input
                                  type="date"
                                  className="form-control user-upt-profile-form-control"
                                  name={`experience[${index}].startDate`}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={moment(
                                    formik.values.experience[index].startDate
                                  ).format("YYYY-MM-DD")}
                                />
                                {formik.touched.experience?.[index]
                                  ?.startDate &&
                                  formik.errors.experience?.[index]
                                    ?.startDate && (
                                    <div className="text-danger">
                                      {
                                        formik.errors.experience[index]
                                          .startDate
                                      }
                                    </div>
                                  )}
                              </div>
                              <div className="col-md-6 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  className="form-control user-upt-profile-form-control"
                                  placeholder="YYYY-MM-DD"
                                  name={`experience[${index}].endDate`}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={moment(
                                    formik.values.experience[index].endDate
                                  ).format("YYYY-MM-DD")}
                                  disabled={
                                    formik.values.experience[index].currentJob
                                  }
                                />
                                <div className="form-check mt-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name={`experience[${index}].currentJob`}
                                    onChange={formik.handleChange}
                                    checked={
                                      formik.values.experience[index].currentJob
                                    }
                                  />
                                  <label className="form-check-label">
                                    I currently work here
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-12 user-upt-profile-form-group">
                                <label className="user-upt-profile-form-label">
                                  Description
                                </label>
                                <textarea
                                  className="form-control user-upt-profile-form-control user-upt-profile-textarea"
                                  placeholder="Describe your responsibilities and achievements"
                                  name={`experience[${index}].description`}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={
                                    formik.values.experience[index].description
                                  }
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="user-upt-profile-add-btn"
                          onClick={() =>
                            push({
                              companyName: "",
                              position: "",
                              startDate: "",
                              endDate: "",
                              currentJob: false,
                              description: "",
                            })
                          }
                        >
                          <i className="bi bi-plus-lg me-2"></i> Add Experience
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              {/* Preferences Card */}
              <div
                className="user-upt-profile-card"
                style={{ overflow: "visible" }}
              >
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-heart me-2"></i> Job Preferences
                </div>
                <div
                  className="user-upt-profile-card-body"
                  style={{ overflow: "visible" }}
                >
                  <div className="row">
                    <div className="col-md-6 user-upt-profile-form-group">
                      <DynamicSelect
                        label="Job Type"
                        name="jobType"
                        formik={formik}
                        options={jobTypes}
                        valueKey="_id"
                        labelKey="name"
                        placeholder="Select Type"
                        className="user-upt-profile-form-label"
                        required={false}
                        selectClassName="form-control user-upt-profile-form-control"
                      />
                    </div>
                    <div className="col-md-6 user-upt-profile-form-group">
                      <DynamicSelect
                        label="Salary"
                        name="salaryRange"
                        required={false}
                        formik={formik}
                        options={salaryOptions}
                        valueKey="value"
                        labelKey="label"
                        placeholder="Select Salary"
                        className="user-upt-profile-form-label"
                        selectClassName="form-control user-upt-profile-form-control"
                      />
                    </div>

                    <div className="col-md-12 user-upt-profile-form-group">
                      <label className="user-upt-profile-form-label">
                        Preferred Locations
                      </label>
                      <div
                        className="user-upt-profile-skill-input-container"
                        style={{ position: "relative" }}
                      >
                        <input
                          type="text"
                          className="form-control user-upt-profile-form-control"
                          placeholder="Search for a city..."
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          onFocus={() => setShowLocationDropdown(true)}
                          style={{ width: "100%" }}
                        />

                        {showLocationDropdown && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              maxHeight: "400px",
                              overflowY: "auto",
                              backgroundColor: "white",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              marginTop: "4px",
                              zIndex: 9999,
                              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            }}
                            className="custom-scrollbar"
                          >
                            {getFilteredCities().length > 0 ? (
                              getFilteredCities().map((city, index) => (
                                <div
                                  key={index}
                                  onClick={() =>
                                    addPreferredLocation(city.name)
                                  }
                                  style={{
                                    padding: "10px 15px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #f0f0f0",
                                    transition: "background-color 0.2s",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#f8f9fa")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "white")
                                  }
                                >
                                  <div style={{ fontWeight: "500" }}>
                                    {city.name}
                                  </div>
                                  <small style={{ color: "#6c757d" }}>
                                    {city.state}, {city.country}
                                  </small>
                                </div>
                              ))
                            ) : (
                              <div
                                style={{
                                  padding: "15px",
                                  textAlign: "center",
                                  color: "#6c757d",
                                }}
                              >
                                No cities found
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Display selected locations like skills */}
                      <div id="preferredLocationsContainer" className="mt-2">
                        {preferredLocations.map((location, index) => (
                          <div
                            key={index}
                            className="user-upt-profile-skill-badge"
                          >
                            {location}
                            <span
                              className="user-upt-profile-skill-remove"
                              onClick={() => removePreferredLocation(index)}
                            >
                              ×
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Card */}
              <div className="user-upt-profile-card">
                <div className="user-upt-profile-card-header">
                  <i className="bi bi-file-earmark me-2"></i> Resume
                </div>
                <div className="user-upt-profile-card-body">
                  <div className="user-upt-profile-form-group">
                    <label className="user-upt-profile-form-label">
                      Upload Your Resume
                    </label>

                    {/* Drag and Drop Area */}
                    <div
                      className={`update-profile-drag ${
                        isDragActive ? "update-profile-drag-active" : ""
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => resumeFileInputRef.current?.click()}
                    >
                      <div className="update-profile-drag-content">
                        <i className="bi bi-cloud-arrow-up update-profile-drag-icon"></i>
                        <p className="update-profile-drag-text">
                          {isDragActive
                            ? "Drop your resume here"
                            : "Drag & drop your resume here or click to browse"}
                        </p>
                        <p className="update-profile-drag-subtext">
                          Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                        </p>
                      </div>
                    </div>

                    <input
                      type="file"
                      className="form-control user-upt-profile-form-control mt-3"
                      accept=".pdf,.doc,.docx"
                      ref={resumeFileInputRef}
                      onChange={handleResumeUpload}
                      style={{ display: "none" }}
                    />

                    {/* Show existing file info */}
                    {(user?.resume || resumeFileName) && (
                      <div className="mt-3 d-flex align-items-center justify-content-between w-100">
                        <span
                          className="fw-semibold text-dark text-truncate me-3"
                          style={{ maxWidth: "70%" }}
                        >
                          {resumeFileName ? (
                            <>
                              <span className="text-muted">
                                Selected file:{" "}
                              </span>
                              {resumeFileName}
                            </>
                          ) : (
                            <>
                              <span className="text-muted">Current file: </span>
                              {user.resume
                                .split("/")
                                .pop()
                                .replace(/^\d+-/, "")}
                            </>
                          )}
                        </span>

                        {user?.resume && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={downloadResume}
                          >
                            <i className="bi bi-download me-1"></i> Download
                            Resume
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-light user-upt-profile-btn-outline"
                >
                  <i className="bi bi-x-circle me-2"></i> Cancel
                </button>
                <button
                  type="submit"
                  className="btn user-upt-profile-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </FormikProvider>
        </div>
      </Layout>
    </>
  );
}
