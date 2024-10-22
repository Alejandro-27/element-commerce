import Product from "../../models/Products/Product";
import { uploadFile } from "../../middleware/tools/firebase";
import Users from "../../models/Users/Users";

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { nameProduct, description, price, category } = req.body;
    const photoProduct = req.file;

    // if (!nameProduct || !description || !price || !photoProduct || !category) {
    //   return res.status(404).json({
    //     message: "Complete todos los datos para crear el producto",
    //     status: false,
    //   });
    // }

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

//! Actualizar un producto
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
      return res.status(403).json({
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

//! Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! Trae los productos por categorias
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los productos por categoría", error });
  }
};

//! Trer un producto pro id
export const getProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el producto por ID", error });
  }
};

//! Trae un producto por el precio
export const getProductByPrice = async (req, res) => {
  const { price } = req.params;
  try {
    const product = await Product.find({ price });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el producto por el precio", error });
  }
};

//! Traer un producto poe el nombre

export const getProductos = async (req, res) => {
  const { productId, category, nameProduct, minPrice, maxPrice } = req.query; // Obtén los parámetros de la query

  try {
    let filter = {};

    // Filtrar por ID del producto si se proporciona
    if (productId) {
      filter._id = productId;
    }

    // Filtrar por categoría si se proporciona
    if (category) {
      filter.category = new RegExp(category, 'i'); // Búsqueda insensible a mayúsculas
    }

    // Filtrar por nombre del producto si se proporciona
    if (nameProduct) {
      filter.nameProduct = new RegExp(nameProduct, 'i'); // Búsqueda insensible a mayúsculas
    }

    // Filtrar por precio si se proporciona
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice); // Precio mínimo
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice); // Precio máximo
      }
    }

    // Buscar productos en la base de datos con los filtros aplicados
    const products = await Product.find(filter);

    // Verificar si se encontraron productos
    if (!products.length) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
};


//! Eliminar un producto
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
