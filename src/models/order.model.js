import mongoose from "mongoose";

const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    nameProduct: { type: String, required: true }, // Copia histórica
    price: { type: Number, required: true }, // Precio al momento de la compra
    quantity: { type: Number, required: true, min: 1 },
    photoProduct: { type: String, default: "" },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
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
      transactionId: { type: String, default: "" },
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
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
