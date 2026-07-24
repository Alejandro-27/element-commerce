import {
  createOrderService,
  updateOrderStatusService,
  getOrderByIdService,
  getUserOrdersService,
  getAllOrdersAdminService,
} from "../services/order.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createOrder = catchAsync(async (req, res) => {
  const order = await createOrderService(req.body, req.user);
  res.status(201).json({ status: "success", data: { order } });
});

export const getOrder = catchAsync(async (req, res) => {
  const order = await getOrderByIdService(req.params.orderId, req.user);
  res.status(200).json({ status: "success", data: { order } });
});

export const getMyOrders = catchAsync(async (req, res) => {
  const result = await getUserOrdersService(req.user._id, req.query);
  res.status(200).json({ status: "success", data: result });
});

export const getAllOrders = catchAsync(async (req, res) => {
  const result = await getAllOrdersAdminService(req.query);
  res.status(200).json({ status: "success", data: result });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const order = await updateOrderStatusService(req.params.orderId, status);
  res.status(200).json({ status: "success", data: { order } });
});
