import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
} from "../controllers/user.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadUserPhoto } from "../config/cloudinary.js";
const router = Router();

// Cambiamos 'upload.single' por 'uploadUserPhoto.single'
router.post(
  "/register",
  uploadUserPhoto.single("avatar"),
  registerValidator,
  register,
);
router.post("/login", loginValidator, login);
router.post("/logout", logout);

// Ruta protegida por JWT Cookie
router.get("/profile", protect, getProfile);

export default router;
