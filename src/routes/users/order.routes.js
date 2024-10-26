import { Router } from "express";
import multer from "multer";
import path from "path";
import { verifyToken } from "../../middleware/tokenValitador";

import {
  createOrder,
  editOrder,
  deleteOrder,
  getOrder,
  getOrders,
  getOrdersByUser,
} from "../../controllers/Order/order.controller";
const router = Router();

//! Crear una orden
router.post("/createOrder", verifyToken, createOrder);

//! Editar una orden
router.put("/editOrder/:orderId", verifyToken, editOrder);

//! Eliminar una orden
router.delete("/deleteOrder/:orderId", verifyToken, deleteOrder);

//! Obtener una orden
router.get("/getOrder/:orderId", verifyToken, getOrder);

//! Obtener una lista de ordenes
router.get("/getOrders", verifyToken, getOrders);

//! Obtener una lista de pedidos de un usuario
router.get("/getOrdersByUser", verifyToken, getOrdersByUser);

export default router;
