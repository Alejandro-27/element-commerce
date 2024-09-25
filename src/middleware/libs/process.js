const sharp = require("sharp");
//import ffmpeg from "fluent-ffmpeg";
const fs = require("fs");
//import { bucket } from "../tools/cloudstorage";
//import config from "../../config";
import mongoose from "mongoose";
//import path from "path";

export const generateImages = async (files, fieldName) => {
    const images = [];
    const deleteFiles = [];
  
    const processingPromises = files.map(async (element) => {
      const fileNameWithoutSpaces = element.originalname.replace(/\s/g, "_");
      const baseName = fileNameWithoutSpaces.split(".").slice(0, -1).join(".");
  
      const sizes = [
        { suffix: "sm", width: 1280, height: 715 },
        { suffix: "lg", width: 1080, height: 1080 },
        { suffix: "md", width: 500, height: 500 },
        { suffix: "xs", width: 320, height: 570 },
      ];
  
      const processingTasks = sizes.map(async ({ suffix, width, height }) => {
        const outputPath = `${element.destination}/${suffix}_${baseName}.webp`;
  
        await sharp(element.path)
          .resize(width, height)
          .webp({ lossless: true })
          .toFile(outputPath);
  
        const uploadResult = await uploadImageStorage(
          outputPath,
          `${suffix}_${baseName}.webp`
        );
  
        deleteFiles.push(outputPath);
  
        return { [suffix]: uploadResult.imagelink || "" };
      });
  
      const [smResult, lgResult, mdResult, xsResult] = await Promise.all(
        processingTasks
      );
  
      const imageId = new mongoose.Types.ObjectId();
      const imageObject = {
        _id: imageId,
        urlsm: smResult.sm,
        urllg: lgResult.lg,
        urlmd: mdResult.md,
        urlxs: xsResult.xs,
      };
  
      imageObject[fieldName] = smResult.sm || "";
  
      images.push(imageObject);
  
      // Eliminar archivo original después de procesar
      deleteFiles.push(element.path);
    });
  
    await Promise.all(processingPromises);
  
    return { [fieldName]: images, deleteFiles };
  };