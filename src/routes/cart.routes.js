import { Router } from "express";
import {
  getMyCartController,
  addToCartController,
  removeFromCartController,
  clearCartController,
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas las rutas son protegidas
router.use(protect);

// Obtener carrito
router.get("/", getMyCartController);

// Agregar producto (acepta / y /items)
router.post("/items", addToCartController);

// Eliminar un producto del carrito (por param o por body)
router.delete("/items/:productId", removeFromCartController);
router.delete("/items", removeFromCartController);

// Vaciar carrito
router.delete("/clear", clearCartController);

export default router;
