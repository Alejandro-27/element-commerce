import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { uploadUserPhoto } from "../config/cloudinary.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import {
  updateUserValidator,
  mongoIdValidator,
} from "../validators/user.validator.js";

const router = Router();

// Rutas Públicas / Autenticación
router.post(
  "/register",
  uploadUserPhoto.single("photo"),
  registerValidator,
  register,
);
router.post("/login", loginValidator, login);
router.post("/logout", logout);

// Rutas de Usuarios (CRUD)
router.get("/", getAllUsers);
router.get("/profile", getProfile); // O usar middleware de protección (protect)
router.get("/:id", mongoIdValidator, getUserById);
router.put(
  "/:id",
  mongoIdValidator,
  uploadUserPhoto.single("photo"),
  updateUserValidator,
  updateUser,
);
router.delete("/:id", mongoIdValidator, deleteUser);

export default router;
