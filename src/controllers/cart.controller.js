import {
  getOrCreateCartService,
  addToCartService,
  removeFromCartService,
  emptyCartService,
} from "../services/cart.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getMyCart = catchAsync(async (req, res) => {
  const cart = await getOrCreateCartService(req.user._id);
  res.status(200).json({ status: "success", data: { cart } });
});

export const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await addToCartService(req.user._id, productId, quantity);
  res.status(200).json({ status: "success", data: { cart } });
});

export const removeFromCart = catchAsync(async (req, res) => {
  const { productId } = req.body;
  const cart = await removeFromCartService(req.user._id, productId);
  res.status(200).json({ status: "success", data: { cart } });
});

export const clearCart = catchAsync(async (req, res) => {
  const cart = await emptyCartService(req.user._id);
  res.status(200).json({ status: "success", data: { cart } });
});
