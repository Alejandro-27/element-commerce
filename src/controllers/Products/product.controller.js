import Product from "../../models/Products/Product";
import { uploadFile } from "../../middleware/tools/firebase";


// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const photo = req.file;

    if (!name || !description || !price || !photo || !category) {
      return res.status(404).json({
        message: "Complete todos los datos para crear el producto",
        status: false,
      });
    }

    // Sube la imagen a Firebase Storage
    let photoUrl = "";
    if (photo) {
      const fileName = `${Date.now()}_${photo.originalname}`; // Define un nombre único para el archivo
      photoUrl = await uploadFile(photo.buffer, fileName); // Sube el archivo y recibe la URL
    }

    const newProduct = new Product({
      name,
      description,
      price,
      photo: photoUrl,
      category,
    });

    const saveProduct = await newProduct.save();

    return res
      .status(200)
      .json({ message: "Producto creado", status: true, saveProduct });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor", status: false });
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
    const { idProduct } = req.params;

    if (!idProduct) {
      return res.status(404).json({
        message: "Selecciona el producto que deseas eliminar",
        status: false,
      });
    }

    const deleteProduct = await Product.findByIdAndDelete(idProduct);

    res.status(200).json({ message: "Producto eliminado", deleteProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
