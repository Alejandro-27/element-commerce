import sharp from 'sharp';
import fs from 'fs/promises';
import mongoose from 'mongoose';

/**
 * Procesa imágenes subidas, genera diferentes tamaños optimizados en WebP
 * y elimina los archivos temporales.
 */
export const processAndOptimizeImages = async (files) => {
  if (!files || files.length === 0) return [];

  const processedImages = [];

  for (const file of files) {
    const fileNameWithoutSpaces = file.originalname.replace(/\s/g, '_');
    const baseName = fileNameWithoutSpaces.split('.').slice(0, -1).join('.');

    const sizes = [
      { suffix: 'lg', width: 1080, height: 1080 },
      { suffix: 'md', width: 500, height: 500 },
      { suffix: 'sm', width: 320, height: 320 }
    ];

    const urls = {};

    for (const size of sizes) {
      const outputPath = `${file.destination}/${size.suffix}_${baseName}.webp`;

      await sharp(file.path)
        .resize(size.width, size.height, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(outputPath);

      // Guardamos la ruta relativa/URL para la base de datos
      urls[size.suffix] = `/uploads/${size.suffix}_${baseName}.webp`;
    }

    // Guardamos la referencia de imágenes con sus tamaños
    processedImages.push({
      _id: new mongoose.Types.ObjectId(),
      lg: urls.lg,
      md: urls.md,
      sm: urls.sm
    });

    // Limpiamos el archivo original subido por Multer
    try {
      await fs.unlink(file.path);
    } catch (err) {
      console.error(`Error eliminando archivo temporal ${file.path}:`, err);
    }
  }

  return processedImages;
};