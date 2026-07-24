import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { AppError } from "../utils/appError.js";

export const getOrCreateCartService = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "nameProduct price photoProduct stock category",
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], totalAmount: 0 });
  }

  return cart;
};

export const addToCartService = async (userId, productId, quantity) => {
  const parsedQuantity = parseInt(quantity, 10) || 1;

  if (parsedQuantity <= 0) {
    throw new AppError("La cantidad debe ser al menos 1", 400);
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  if (product.stock < parsedQuantity) {
    throw new AppError(
      `Stock insuficiente. Solo quedan ${product.stock} unidades`,
      400,
    );
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex > -1) {
    const newQuantity = cart.items[itemIndex].quantity + parsedQuantity;
    if (product.stock < newQuantity) {
      throw new AppError(
        `No puedes agregar más. Límite de stock: ${product.stock}`,
        400,
      );
    }
    cart.items[itemIndex].quantity = newQuantity;
    cart.items[itemIndex].price = product.price; // Actualiza con el precio vigente
  } else {
    cart.items.push({
      product: productId,
      quantity: parsedQuantity,
      price: product.price,
    });
  }

  // El Hook pre('save') en cart.model.js re-calcula totalAmount automáticamente
  await cart.save();

  return await cart.populate({
    path: "items.product",
    select: "nameProduct price photoProduct stock",
  });
};

export const removeFromCartService = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError("Carrito no encontrado", 404);
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );
  await cart.save();

  return await cart.populate({
    path: "items.product",
    select: "nameProduct price photoProduct stock",
  });
};

export const emptyCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError("Carrito no encontrado", 404);
  }

  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  return cart;
};
