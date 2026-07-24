import { Router } from "express";
import {
  createOrder,
  getOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas las rutas de órdenes requieren autenticación
router.use(protect);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:orderId", getOrder);

// Rutas exclusivas de Administrador
router.get("/", restrictTo("admin"), getAllOrders);
router.patch("/:orderId/status", restrictTo("admin"), updateOrderStatus);

export default router;
