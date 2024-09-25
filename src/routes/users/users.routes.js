import express from "express";
import { Router } from "express";
import multer from "multer";
import path from "path";
import { verifyToken } from "../../middleware/tokenValitador";

import { register } from "../../controllers/Users/users.controller";
const router = Router();

const storage = multer.diskStorage({
  destination: path.join("storage/users"),
  filename: (req, file, cb) => {
    cb(null, Math.floor(Math.random() * 50) + file.originalname);
  },
});
const upload = multer({ storage }).array("photo");

router.post("/register", upload, register);

export default router;
