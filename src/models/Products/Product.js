import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user: { _id: String, name: String, email: String, photo: Array },
    nameProduct: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    photoProduct: {
      type: Array,
    },
    stock: {
      // Cantidad
      type: Number,
      //required: true,
    },
    category: {
      type: String,
      required: true,
    },
    qualification: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        userId: { type: String, required: true }, // ID del usuario que calificó
        score: { type: Number, required: true, min: 1, max: 5 }, // Puntuación entre 1 y 5
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
