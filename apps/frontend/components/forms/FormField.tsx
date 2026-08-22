import React from "react";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
}

export function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  hint,
  placeholder,
}: FormFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "error" : ""}
      />
      {error && <span className="field-error">{error}</span>}
      {hint && !error && <span className="field-hint">{hint}</span>}
    </div>
  );
}
