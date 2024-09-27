import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user: { _id: String, name: String, email: String, photo: String },
    name: {
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
    photo: {
      type: Array,
    },
    stock: { // Cantidad
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
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
