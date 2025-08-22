import React from "react";

const DynamicSelect = ({
  label,
  name,
  formik,
  options = [],
  valueKey = "value",
  labelKey = "label",
  placeholder = "Select an option",
}) => {
  return (
    <div className="form-group mb-30">
      <label className="font-sm color-text-mutted mb-10">{label} *</label>
      <select
        name={name}
        className="form-control"
        value={formik.values[name] || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{ margin: "0px" }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt[valueKey]} value={opt[valueKey]}>
            {opt[labelKey]}
          </option>
        ))}
      </select>
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-danger">{formik.errors[name]}</p>
      )}
    </div>
  );
};

export default DynamicSelect;
