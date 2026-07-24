import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

//! Resumen de Estadísticas
export const getDashboardData = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } });

    res.status(200).json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalProducts,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo datos del dashboard" });
  }
};

//! Gestión de pedidos
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo los pedidos" });
  }
};

//! Actualizar el estado del pedido
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error actualizando el estado del pedido" });
  }
};

//! Obtener un pedido por ID
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("user", "name email");
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo el pedido" });
  }
};
