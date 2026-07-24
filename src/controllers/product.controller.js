import {
  createProductService,
  updateProductService,
  deleteProductService,
  getProductsFilteredService,
  rateProductService,
} from "../services/product.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createProduct = catchAsync(async (req, res) => {
  const product = await createProductService(req.body, req.file, req.user);
  res.status(201).json({ status: "success", data: { product } });
});

export const updateProduct = catchAsync(async (req, res) => {
  const updatedProduct = await updateProductService(
    req.params.idProduct,
    req.body,
    req.file,
    req.user,
  );
  res
    .status(200)
    .json({ status: "success", data: { product: updatedProduct } });
});

export const deleteProduct = catchAsync(async (req, res) => {
  await deleteProductService(req.params.idProduct, req.user);
  res
    .status(200)
    .json({ status: "success", message: "Producto eliminado exitosamente" });
});

export const getProducts = catchAsync(async (req, res) => {
  const result = await getProductsFilteredService(req.query);
  res.status(200).json({ status: "success", data: result });
});

export const rateProduct = catchAsync(async (req, res) => {
  const { score } = req.body;
  const product = await rateProductService(
    req.params.productId,
    score,
    req.user._id,
  );
  res.status(200).json({ status: "success", data: { product } });
});
