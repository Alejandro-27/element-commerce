import { Router } from "express";
import multer from "multer";
import path from "path";
import { verifyToken } from "../../middleware/tokenValitador";
import {
  addToCart,
  removeFromCart,
  getCart,
  emptyCart,
  getCarts,
  getCartsByUser,
} from "../../controllers/ShoppingCart/shoppingCart.controller";

const router = Router();

//! Agregar al carrito
router.post("/addToCart", verifyToken, addToCart);

//! Eliminar del carrito
router.delete("/removeFromCart", verifyToken, removeFromCart);

//! Obtener el carrito
router.get("/getCart", verifyToken, getCart);

//! Vaciar el carrito
router.put("/emptyCart", verifyToken, emptyCart);

//! Obtener los carritos
router.get("/getCarts", verifyToken, getCarts);

//! Obtener los carritos del usuario
router.get("/getCartsByUser", verifyToken, getCartsByUser);

export default router;
