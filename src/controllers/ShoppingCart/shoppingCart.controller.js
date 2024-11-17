import Cart from "../../models/ShoppingCart/ShoppingCart";
import Product from "../../models/Products/Product";

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const userId = req.user.id; // Obtén el ID del usuario desde el token

    let cart = await Cart.findOne({ "user._id": userId, status: "active" });
    if (!cart) {
      cart = new Cart({
        user: {
          _id: userId,
          name: req.user.name,
          email: req.user.email,
          photo: req.user.photo || [],
        },
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        total: product.price * quantity,
      });
    }

    await cart.save();

    // Formatear la respuesta para incluir `user` como objeto
    const response = {
      user: cart.user,
      items: cart.items,
      totalAmount: cart.totalAmount,
      status: cart.status,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    // Buscar el carrito activo del usuario autenticado
    const cart = await Cart.findOne({
      "user._id": req.user.id,
      status: "active",
    });

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Verificar si el producto existe en el carrito
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!existingItem) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito" });
    }

    // Eliminar el producto del carrito
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    // Guardar los cambios en el carrito
    await cart.save();

    // Formatear la respuesta para incluir `user` como un objeto separado
    const response = {
      user: cart.user, // Datos del usuario
      items: cart.items, // Productos restantes en el carrito
      totalAmount: cart.totalAmount, // Total del carrito actualizado
      status: cart.status,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor", status: false });
  }
};

export const getCart = async (req, res) => {
  //! Obtener el carrito
  const { page = 1, limit = 10 } = req.query;

  try {
    const userId = req.user._id; // ID del usuario autenticado

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Buscar carritos del usuario y aplicar paginación
    const carts = await Cart.find({ "user._id": userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Contar el total de carritos del usuario

    const cart = await Cart.findOne({ "user._id": userId, status: "active" });
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.status(200).json({ carts, currentPage: pageNumber });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor", status: false });
  }
};

export const emptyCart = async (req, res) => {
  //! Vaciar el carrito
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ "user._id": userId, status: "active" });
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.items = [];
    cart.status = "active";
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    log.error(error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor", status: false });
  }
};

export const getCarts = async (req, res) => {
  //! Obtener los carritos
  const { page = 1, limit = 10 } = req.query;

  try {
    const userId = req.user._id;

    // Convertir `page` y `limit` a números
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calcular el número de documentos que se deben saltar
    const skip = (pageNumber - 1) * limitNumber;

    // Buscar carritos del usuario y aplicar paginación
    const carts = await Cart.find({ "user._id": userId, })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Contar el total de carritos del usuario
    const totalCarts = await Cart.countDocuments({ user: userId });

    // Responder con los carritos, el total y la información de paginación
    res.status(200).json({
      carts,
      totalPages: Math.ceil(totalCarts / limitNumber),
      currentPage: pageNumber,
      totalCarts,
    });
  } catch (error) {
    log.error(error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor", status: false });
  }
};

export const getCartsByUser = async (req, res) => {
  //! Obtener los carritos del usuario
  const { page = 1, limit = 10 } = req.query;

  try {
    const userId = req.user._id;

    // Convertir `page` y `limit` a números
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calcular el número de documentos que se deben saltar
    const skip = (pageNumber - 1) * limitNumber;

    // Buscar carritos del usuario y aplicar paginación
    const carts = await Cart.find({ "user._id": userId, })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Contar el total de carritos del usuario
    const totalCarts = await Cart.countDocuments({ user: userId });

    // Responder con los carritos, el total y la información de paginación
    res.status(200).json({
      carts,
      totalPages: Math.ceil(totalCarts / limitNumber),
      currentPage: pageNumber,
      totalCarts,
    });
  } catch (error) {
    log.error(error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor", status: false });
  }
};
