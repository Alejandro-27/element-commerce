import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Guarda la foto temporalmente en memoria (evita fallos de compatibilidad de almacenamiento)
const storage = multer.memoryStorage();

export const uploadUserPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("El archivo subido no es una imagen válida"), false);
    }
  },
});

// Función helper para subir la imagen a Cloudinary desde memoria
export const uploadToCloudinary = (
  fileBuffer,
  folder = "element-commerce/users",
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 500, height: 500, crop: "limit", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};
