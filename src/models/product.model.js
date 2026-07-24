import mongoose from "mongoose";

const { Schema } = mongoose;

const ratingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nameProduct: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    photoProduct: {
      type: String, // O un array de strings para las fotos
      default: "",
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
      min: [0, "El stock no puede ser negativo"],
    },
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
      lowercase: true,
    },
    qualification: {
      type: Number,
      default: 0,
    },
    ratings: [ratingSchema],
  },
  { timestamps: true },
);

// Índice de texto para búsquedas rápidas en producción
productSchema.index({ nameProduct: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
