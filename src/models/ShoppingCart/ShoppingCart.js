import mongoose from "mongoose";
const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    user: { _id: String, name: String, email: String, photo: Array },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Referencia al modelo de producto
          required: true,
        },
        quantity: { //! Cantidad del producto en el carrito
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        total: { //! Total del producto en el carrito
          type: Number,
          required: true,
          default: function () {
            return this.quantity * this.price;
          },
        },
      },
    ],
    status: { //! Estado del carrito
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    totalAmount: { //! Total del carrito
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, 
  }
);

// Middleware para calcular el total del carrito antes de guardar
CartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);
  next();
});

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
