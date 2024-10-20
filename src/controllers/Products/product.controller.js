import Product from "../../models/Products/Product";
import { uploadFile } from "../../middleware/tools/firebase";
import Users from "../../models/Users/Users";

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { nameProduct, description, price, category } = req.body;
    const photoProduct = req.file;

    if (!nameProduct || !description || !price || !photoProduct || !category) {
      return res.status(404).json({
        message: "Complete todos los datos para crear el producto",
        status: false,
      });
    }

    // Sube la imagen a Firebase Storage
    let photoUrl = "";
    if (photoProduct) {
      const fileName = `${Date.now()}_${photoProduct.originalname}`; // Define un nombre único para el archivo
      photoUrl = await uploadFile(photoProduct.buffer, fileName); // Sube el archivo y recibe la URL
    }

    // Verifica si req.user está definido
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { _id, name, email, photo } = req.user;
    //const arrayCategory = JSON.parse(category);

    const newProduct = new Product({
      nameProduct,
      description,
      price,
      photoProduct: photoUrl,
      category,
      //category: arrayCategory,
      user: { _id, name, email, photo },
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
    const { idProduct } = req.params;
    const { nameProduct, description, price, stock, category, qualification } =
      req.body;
    const photoProduct = req.file;

    // Verificar si se selecciono un producto
    if (!idProduct) {
      return res.status(404).json({
        message: "Selecciona el producto que deseas actualizar",
        status: false,
      });
    }

    // Verificar si el producto existe
    const product = await Product.findById(idProduct);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Sube la imagen a Firebase Storage
    let photoUrl = "";
    if (photoProduct) {
      const fileName = `${Date.now()}_${photoProduct.originalname}`; // Define un nombre único para el archivo
      photoUrl = await uploadFile(photoProduct.buffer, fileName); // Sube el archivo y recibe la URL
    }

    if (
      req.user._id.toString() !== product.user._id.toString() &&
      req.user.admin !== "admin"
    )
      return res
        .status(403)
        .json({
          message: "No tienes permisos para editar productos",
          status: false,
        });

    // Buscar y actualizar el producto
    const updatedProduct = await Product.findByIdAndUpdate(
      idProduct,
      {
        nameProduct,
        description,
        price,
        photoProduct: photoUrl,
        stock,
        category,
        qualification,
      },
      { new: true, runValidators: true } // Retorna el producto actualizado
    );

    // Verificar si el producto existe
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Responder con el producto actualizado
    res.status(200).json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el producto" });
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
