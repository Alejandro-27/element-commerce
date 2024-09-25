import express from "express";
import { Router } from "express";
import { verifyToken } from "../../middleware/tokenValitador.js";
import { Paginate } from "../../middleware/pagination.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../controllers/Products/product.controller.js";
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
