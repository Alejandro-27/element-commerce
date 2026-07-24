import Product from "../models/product.model.js";
import { uploadFile } from "../config/firebase.js";
import { AppError } from "../utils/appError.js";

export const createProductService = async (productData, file, user) => {
  const { nameProduct, description, price, category, stock } = productData;

  let photoUrl = "";
  if (file) {
    const folderPath = `products/${category || "general"}`;
    const fileName = `${Date.now()}_${file.originalname}`;
    photoUrl = await uploadFile(file.buffer, folderPath, fileName);
  }

  const product = await Product.create({
    nameProduct,
    description,
    price: Number(price),
    category,
    stock: stock ? Number(stock) : 1,
    photoProduct: photoUrl,
    user: user._id,
  });

  return product;
};

export const updateProductService = async (
  idProduct,
  updateData,
  file,
  currentUser,
) => {
  const product = await Product.findById(idProduct);
  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  // Verificar si es dueño o Administrador
  if (
    product.user.toString() !== currentUser._id.toString() &&
    currentUser.role !== "admin"
  ) {
    throw new AppError("No tienes permisos para editar este producto", 403);
  }

  if (file) {
    const folderPath = `products/${updateData.category || product.category}`;
    const fileName = `${Date.now()}_${file.originalname}`;
    updateData.photoProduct = await uploadFile(
      file.buffer,
      folderPath,
      fileName,
    );
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    idProduct,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedProduct;
};

export const deleteProductService = async (idProduct, currentUser) => {
  const product = await Product.findById(idProduct);
  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  if (
    product.user.toString() !== currentUser._id.toString() &&
    currentUser.role !== "admin"
  ) {
    throw new AppError("No tienes permisos para eliminar este producto", 403);
  }

  await Product.findByIdAndDelete(idProduct);
};

export const getProductsFilteredService = async (queryParams) => {
  const {
    productId,
    category,
    nameProduct,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = queryParams;

  const filter = {};

  if (productId) filter._id = productId;
  if (category) filter.category = category.toLowerCase();

  // Búsqueda segura evitando inyección Regex
  if (nameProduct) {
    const sanitizedName = nameProduct.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.nameProduct = new RegExp(sanitizedName, "i");
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .populate("user", "firstName lastName email")
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limitNum),
    currentPage: pageNum,
  };
};

export const rateProductService = async (productId, score, userId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  const hasRated = product.ratings.some(
    (r) => r.userId.toString() === userId.toString(),
  );
  if (hasRated) {
    throw new AppError("Ya has calificado este producto anteriormente", 400);
  }

  product.ratings.push({ userId, score: Number(score) });

  // Recalcular promedio
  const totalScore = product.ratings.reduce((acc, item) => acc + item.score, 0);
  product.qualification = Number(
    (totalScore / product.ratings.length).toFixed(1),
  );

  await product.save();
  return product;
};
