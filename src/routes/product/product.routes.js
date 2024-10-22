import { Router } from "express";
import multer from "multer";
import path from "path";
import { verifyToken } from "../../middleware/tokenValitador";
import { Paginate } from "../../middleware/pagination.js";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductById,
  getProductByPrice,
  getProductos,
} from "../../controllers/Products/product.controller.js";
const router = Router();

const upload = multer({
  dest: path.join("storage/product"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//! Crear un nuevo producto
router.post("/createProduct", upload.single("photoProduct"), verifyToken, createProduct); 

//! Obtener todos los productos
router.get("/getProducts", Paginate, getAllProducts);

//! Actualizar un producto
router.put("/updateProduct/:idProduct", upload.single("photoProduct"), verifyToken, updateProduct);

//! Eliminar un producto
router.delete("/deleteProduct/:idProduct", deleteProduct);

//! Trae todos los productos de una categoría 
router.get('/products/category/:category', getProductsByCategory);

//! Trae un producto por el id
router.get('/products/id/:productId', getProductById);

//! Trae un producto por el precio
router.get('/products/price/:price', getProductByPrice);

//! Ruta para obtener los productos con diferentes filtros
router.get('/products', getProductos);

export default router;
