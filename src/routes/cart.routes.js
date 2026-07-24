import { Router } from "express";
import {
  getMyCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas las rutas del carrito son protegidas
router.use(protect);

router.get("/", getMyCart);
router.post("/items", addToCart);
router.delete("/items", removeFromCart);
router.delete("/clear", clearCart);

export default router;
