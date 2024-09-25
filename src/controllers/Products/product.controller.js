import Product from "../../models/Products/Product";
// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, photo, category } = req.body;

    if (!name || !description || !price || !photo || !category) {
      return res
        .status(404)
        .json({
          message: "Complete todos los datos para crear el producto",
          status: false,
        });
    }


    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
