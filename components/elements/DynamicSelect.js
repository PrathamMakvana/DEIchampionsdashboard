import React from "react";

const DynamicSelect = ({
  label,
  name,
  formik,
  required = true,
  options = [],
  valueKey = "value",
  labelKey = "label",
  placeholder = "Select an option",
  className = "font-sm color-text-mutted mb-10",
  selectClassName = "form-control",
}) => {
  return (
    <div className="form-group mb-30">
      <label className={className}>
        {label}
        {required && "*"}
      </label>
      <select
        name={name}
        className={selectClassName}
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
