import React, { useRef, useState } from "react";

interface AvatarUploadProps {
  initials: string;
}

export function AvatarUpload({ initials }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "var(--color-primary)",
          color: "var(--color-surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
          fontWeight: 600,
        }}
      >
        {initials}
      </div>

      <div className="file-upload" style={{ textAlign: "center", border: "none", padding: 0 }}>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          className="btn"
          onClick={() => fileInputRef.current?.click()}
          style={{ background: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}
        >
          Change photo
        </button>
        {fileName && (
          <p className="text-muted" style={{ fontSize: "0.85rem", marginTop: "8px", marginBottom: 0 }}>
            Selected: {fileName}
          </p>
        )}
      </div>
    </div>
  );
}
