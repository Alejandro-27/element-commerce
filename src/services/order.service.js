import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import { AppError } from "../utils/appError.js";

export const createOrderService = async (orderData, user) => {
  const { items, paymentInfo, shippingAddress } = orderData;

  if (!items || items.length === 0) {
    throw new AppError("No hay productos en el pedido", 400);
  }

  let totalAmount = 0;
  const processedItems = [];

  // 1. Validar Stock y Congelar Precios de forma Atómica
  for (const item of items) {
    // Descuento Atómico de Stock para evitar Race Conditions
    const product = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true },
    );

    if (!product) {
      throw new AppError(
        `Producto no disponible o stock insuficiente para procesar la orden`,
        400,
      );
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    processedItems.push({
      product: product._id,
      nameProduct: product.nameProduct,
      price: product.price,
      quantity: item.quantity,
      photoProduct: product.photoProduct,
    });
  }

  // 2. Crear la Orden
  const order = await Order.create({
    user: user._id,
    items: processedItems,
    totalAmount,
    paymentInfo,
    shippingAddress,
    orderStatus: "Pending",
  });

  // 3. Vaciar el Carrito del usuario tras la compra exitosa
  await Cart.findOneAndUpdate(
    { user: user._id },
    { items: [], totalAmount: 0 },
  );

  return order;
};

export const updateOrderStatusService = async (orderId, orderStatus) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true, runValidators: true },
  );

  if (!order) {
    throw new AppError("Orden no encontrada", 404);
  }

  return order;
};

export const getOrderByIdService = async (orderId, currentUser) => {
  const order = await Order.findById(orderId).populate(
    "user",
    "firstName lastName email",
  );

  if (!order) {
    throw new AppError("Orden no encontrada", 404);
  }

  // Restricción: Un cliente solo puede ver sus propias órdenes, salvo que sea Admin
  if (
    order.user._id.toString() !== currentUser._id.toString() &&
    currentUser.role !== "admin"
  ) {
    throw new AppError("No tienes permiso para ver esta orden", 403);
  }

  return order;
};

export const getUserOrdersService = async (userId, queryParams) => {
  const { page = 1, limit = 10 } = queryParams;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const [orders, totalOrders] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments({ user: userId }),
  ]);

  return {
    orders,
    totalOrders,
    totalPages: Math.ceil(totalOrders / limitNum),
    currentPage: pageNum,
  };
};

export const getAllOrdersAdminService = async (queryParams) => {
  const { page = 1, limit = 10 } = queryParams;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const [orders, totalOrders] = await Promise.all([
    Order.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(),
  ]);

  return {
    orders,
    totalOrders,
    totalPages: Math.ceil(totalOrders / limitNum),
    currentPage: pageNum,
  };
};
