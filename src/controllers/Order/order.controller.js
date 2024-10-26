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

    // Información del usuario a partir del token
    const userInfo = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      photo: req.user.photo || [],
    };

    // Crear la orden
    const order = new Order({
      user: userInfo, // Información del usuario
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

  //! Editar una orden
  export const editOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
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
  
      // Actualizar la orden
      const order = await Order.findByIdAndUpdate(orderId, {
        items,
        totalAmount,
        paymentInfo,
        shippingAddress,
      });
  
      res.status(200).json({
        message: 'Orden actualizada exitosamente',
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al editar la orden' });
    }
  };
  
  //! Eliminar una orden
  export const deleteOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Eliminar la orden
      const order = await Order.findByIdAndDelete(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }
  
      res.status(200).json({
        message: 'Orden eliminada exitosamente',
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar la orden' });
    }
  };
  
  //! Obtener una orden
  export const getOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Obtener la orden
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }
  
      res.status(200).json({
        message: 'Orden obtenida exitosamente',
        order,
      });
    } catch (error) {
      console.error(error); // Mostrar el error en la consola
      res.status(500).json({ message: 'Error al obtener la orden' });
    }
  };
  
  //! Obtener una lista de ordenes
  export const getOrders = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
  
      // Obtener las ordenes
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
  
      if (!orders) {
        return res.status(404).json({ message: 'No se encontraron ordenes' });
      }
  
      res.status(200).json({
        message: 'Ordenes obtenidas exitosamente',
        orders,
      });
    } catch (error) {
      console.error(error); // Mostrar el error en la consola
      res.status(500).json({ message: 'Error al obtener las ordenes' });
    } finally {
      await client.end();
    }
  };
  
  //! Obtener una lista de pedidos de un usuario
  export const getOrdersByUser = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
  
    try {
      const userId = req.user._id; // ID del usuario autenticado
  
      // Convertir `page` y `limit` a números
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      // Calcular el número de documentos que se deben saltar
      const skip = (pageNumber - 1) * limitNumber;
  
      // Buscar órdenes del usuario y aplicar paginación
      const orders = await Order.find({ "user._id": userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);
  
      // Contar el total de órdenes del usuario
      const totalOrders = await Order.countDocuments({ "user._id": userId });
  
      // Responder con las órdenes, el total y la información de paginación
      res.status(200).json({
        orders,
        totalPages: Math.ceil(totalOrders / limitNumber),
        currentPage: pageNumber,
        totalOrders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener las órdenes", error });
    }
  };
  