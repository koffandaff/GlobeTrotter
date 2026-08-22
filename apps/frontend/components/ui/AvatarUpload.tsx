import React, { useRef, useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/canvasUtils";

interface AvatarUploadProps {
  initials: string;
  onSave?: (base64Image: string) => void;
}

export function AvatarUpload({ initials, onSave }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States
  const [fileName, setFileName] = useState<string | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null); // For cropper
  const [stagedImage, setStagedImage] = useState<string | null>(null); // Selected but not finalized
  const [finalImage, setFinalImage] = useState<string | null>(null);   // Finalized and saved
  
  // Cropper state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("userAvatar");
    if (saved) {
      setFinalImage(saved);
    }
  }, []);

  // Save to local storage when finalImage changes
  useEffect(() => {
    if (finalImage) {
      localStorage.setItem("userAvatar", finalImage);
    } else {
      localStorage.removeItem("userAvatar");
    }
  }, [finalImage]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (rawImageSrc && rawImageSrc.startsWith("blob:")) URL.revokeObjectURL(rawImageSrc);
    };
  }, [rawImageSrc]);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      if (rawImageSrc && rawImageSrc.startsWith("blob:")) URL.revokeObjectURL(rawImageSrc);
      setRawImageSrc(URL.createObjectURL(file));
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (!rawImageSrc || !croppedAreaPixels) return;
      const croppedBase64 = await getCroppedImg(rawImageSrc, croppedAreaPixels, 0);
      setStagedImage(croppedBase64);
      setFinalImage(null); // We are now in "staged" state
      setRawImageSrc(null); // close cropper modal
    } catch (e) {
      console.error(e);
    }
  }, [rawImageSrc, croppedAreaPixels]);

  const cancelCropModal = () => {
    setRawImageSrc(null);
    if (!stagedImage && !finalImage) {
      setFileName(null);
    }
  };

  // State actions
  const handleRemoveStaged = () => {
    setStagedImage(null);
    setFileName(null);
  };

  const handleConfirmStaged = () => {
    setFinalImage(stagedImage);
    setStagedImage(null);
    if (onSave && stagedImage) {
      onSave(stagedImage);
    }
  };

  const handleRemoveFinal = () => {
    setFinalImage(null);
    setFileName(null);
  };

  // Determine current image to show
  const displayImage = stagedImage || finalImage;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      {displayImage ? (
        <img
          src={displayImage}
          alt="Avatar preview"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid var(--color-border)"
          }}
        />
      ) : (
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "var(--color-accent)",
            color: "var(--color-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            fontWeight: 600,
          }}
        >
          {initials}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        
        {/* Buttons State Machine */}
        {!stagedImage && !finalImage && (
          <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            Set photo
          </button>
        )}

        {stagedImage && (
          <div style={{ display: "flex", gap: "12px" }}>
            <button type="button" className="btn btn-primary" onClick={handleConfirmStaged}>
              Confirm
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleRemoveStaged}>
              Remove
            </button>
          </div>
        )}

        {finalImage && !stagedImage && (
          <div style={{ display: "flex", gap: "12px" }}>
            <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
              Change
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleRemoveFinal}>
              Remove current
            </button>
          </div>
        )}

        {/* Info Text */}
        {stagedImage && fileName && (
          <p className="text-muted" style={{ fontSize: "0.85rem", margin: 0 }}>
            *{fileName}* is selected
          </p>
        )}
      </div>

      {/* Cropper Modal */}
      {rawImageSrc && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.8)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "var(--color-surface)",
            padding: "24px",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <h3 style={{ margin: 0 }}>Adjust Photo</h3>
            
            <div style={{ position: "relative", width: "100%", height: "300px", background: "#333", borderRadius: "4px", overflow: "hidden" }}>
              <Cropper
                image={rawImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "0.85rem" }}>Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                style={{ flex: 1 }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
              <button className="btn" style={{ background: "transparent", color: "var(--color-text)" }} onClick={cancelCropModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={showCroppedImage}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
