import { Router } from "express";
import multer from "multer";
import path from "path";
import { verifyToken } from "../../middleware/tokenValitador";

import {
  createOrder,
} from "../../controllers/Order/order.controller";
const router = Router();

router.post("/createOrder", verifyToken, createOrder);
//! Crear una orden

export default router;
