import Order from "../../models/Order/Order";
import Product from "../../models/Products/Product";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
//! Crear una orden
export const createOrder = async (req, res) => {
    try {
      const { items, paymentInfo, shippingAddress } = req.body;
  
      // Validar que haya items en la orden
      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No hay productos en el pedido' });
      }
  
      let totalAmount = 0;
  
      // Calcular el monto total de la orden
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: 'Producto no encontrado' });
        }
        if (item.quantity > product.stock) {
          return res.status(400).json({
            message: `Stock insuficiente para el producto ${product.nameProduct}`,
          });
        }
        totalAmount += product.price * item.quantity;
      }
  
      // Crear la orden
      const order = new Order({
        user: req.user._id, // ID del usuario que hace la orden
        items,
        totalAmount,
        paymentInfo,
        shippingAddress,
        orderStatus: 'Pending',
      });
  
      // Guardar la orden en la base de datos
      const savedOrder = await order.save();
  
      // Reducir el stock de los productos pedidos
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
  
      res.status(201).json({
        message: 'Orden creada exitosamente',
        order: savedOrder,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear la orden' });
    }
  };