import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Note: Cloudinary automatically reads the CLOUDINARY_URL environment variable.

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "globetrotter/avatars",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
});

export const uploadAvatar = multer({ storage });
