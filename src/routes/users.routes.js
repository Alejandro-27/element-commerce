import { Router } from "express";
import multer from "multer";
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

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/register", upload.single("photo"), registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/logout", logout);

// Ruta protegida por JWT Cookie
router.get("/profile", protect, getProfile);

export default router;
