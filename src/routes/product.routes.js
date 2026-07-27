import { Router } from "express";
import multer from "multer";
import {
  createProductController,
  updateProductController,
  deleteProductController,
  getProductsController,
  rateProductController,
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadUserPhoto } from "../config/cloudinary.js";

const router = Router();

// Rutas Públicas (Búsqueda y visualización)
router.get("/:productId", getProductsController);

// Rutas Protegidas (Crear, Editar, Eliminar, Calificar)
router.use(protect);

router.post(
  "/",
  uploadUserPhoto.single("photoProduct"),
  createProductController,
);

router.patch(
  "/:idProduct",
  uploadUserPhoto.single("photoProduct"),
  updateProductController,
);
router.delete("/:idProduct", deleteProductController);
router.post("/:productId/rate", rateProductController);

export default router;
