import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { _id: String, name: String, email: String, photo: Array },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Asocia el producto del pedido a la colección 'Product'
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentInfo: {
      method: {
        type: String,
        enum: ["Credit Card", "PayPal", "Bank Transfer", "Cash on Delivery"],
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
      },
      transactionId: String,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shippingDate: Date,
    deliveredDate: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
