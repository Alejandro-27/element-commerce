import { Router } from "express";
import multer from "multer";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  rateProduct,
} from "../controllers/product.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// Rutas Públicas (Búsqueda y visualización)
router.get("/", getProducts);

// Rutas Protegidas (Crear, Editar, Eliminar, Calificar)
router.use(protect);

router.post("/", upload.single("photoProduct"), createProduct);
router.patch("/:idProduct", upload.single("photoProduct"), updateProduct);
router.delete("/:idProduct", deleteProduct);
router.post("/:productId/rate", rateProduct);

export default router;
