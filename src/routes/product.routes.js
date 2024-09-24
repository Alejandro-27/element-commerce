import express from "express";
import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
const router = Router();

//const router = express.Router();

// Crear un nuevo producto
router.post("/createProduct", createProduct);

// Obtener todos los productos
router.get("/", getProducts);

// Actualizar un producto
router.put("/:id", updateProduct);

// Eliminar un producto
router.delete("/:id", deleteProduct);

export default router;
