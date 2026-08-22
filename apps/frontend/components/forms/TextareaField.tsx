import React from "react";

interface TextareaFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  rows?: number;
}

export function TextareaField({
  label,
  id,
  value,
  onChange,
  error,
  hint,
  placeholder,
  rows = 4,
}: TextareaFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={error ? "error" : ""}
      />
      {error && <span className="field-error">{error}</span>}
      {hint && !error && <span className="field-hint">{hint}</span>}
    </div>
  );
}
