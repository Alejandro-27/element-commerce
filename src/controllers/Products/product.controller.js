import Product from "../../models/Products/Product";
import { uploadFile } from "../../middleware/tools/firebase";
import Users from "../../models/Users/Users";

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { nameProduct, description, price, category } = req.body;
    const photoProduct = req.file;

    let photoUrl = "";
    if (photoProduct) {
      const folderPath = `products/${category || "general"}`; // Usa la categoría o una carpeta por defecto
      const fileName = `${Date.now()}_${photoProduct.originalname}`; // Define un nombre único para el archivo
      photoUrl = await uploadFile(photoProduct.buffer, folderPath, fileName); // Sube el archivo y recibe la URL
    }

    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { _id, name, email, photo } = req.user;
    
    const newProduct = new Product({
      nameProduct,
      description,
      price,
      photoProduct: photoUrl,
      category,
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


//! Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! Obtener todos los productos por filtros
export const getProductsFilter = async (req, res) => {
  const {
    productId,
    category,
    nameProduct,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    let filter = {};

    // Filtrar por ID del producto si se proporciona
    if (productId) {
      filter._id = productId;
    }

    // Filtrar por categoría si se proporciona
    if (category) {
      filter.category = new RegExp(category, "i"); // Búsqueda insensible a mayúsculas
    }

    // Filtrar por nombre del producto si se proporciona
    if (nameProduct) {
      filter.nameProduct = new RegExp(nameProduct, "i"); // Búsqueda insensible a mayúsculas
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

    // Convertir `page` y `limit` a números
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calcular el número de documentos que se deben saltar
    const skip = (pageNumber - 1) * limitNumber;

    // Buscar productos en la base de datos con los filtros aplicados y aplicar paginación
    const products = await Product.find(filter).skip(skip).limit(limitNumber);

    // Contar el total de documentos que cumplen con los filtros
    const totalProducts = await Product.countDocuments(filter);

    // Responder con los productos, el total y la información de paginación
    res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limitNumber),
      currentPage: pageNumber,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
};

//! Calificar un producto
export const rateProduct = async (req, res) => {
  const { productId } = req.params;
  const { score } = req.body;
  const userId = req.user.id; // El ID del usuario obtenido del token

  try {
    // Buscar el producto por ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Verificar si el usuario ya ha calificado el producto
    const existingRating = product.ratings.find((rating) => rating.userId === userId);
    if (existingRating) {
      return res.status(400).json({ message: "El usuario ya ha calificado este producto" });
    }

    // Agregar la nueva calificación
    product.ratings.push({ userId, score });

    // Calcular el promedio de las calificaciones
    const totalScores = product.ratings.reduce((acc, rating) => acc + rating.score, 0);
    product.qualification = totalScores / product.ratings.length;

    // Guardar los cambios en la base de datos
    await product.save();

    res.status(200).json({ message: "Calificación agregada con éxito", product });
  } catch (error) {
    res.status(500).json({ message: "Error al calificar el producto", error });
  }
};
