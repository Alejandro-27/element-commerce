import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El producto es obligatorio']
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad mínima es 1'],
      default: 1
    },
    // El precio unitario congelado temporalmente en la sesión del carrito
    price: {
      type: Number,
      required: [true, 'El precio del producto es obligatorio']
    }
  },
  { _id: true }
);

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El carrito debe pertenecer a un usuario'],
      unique: true // Garantiza un único carrito activo por usuario
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

// Middleware Pre-Save: Calcula el total del carrito dinámicamente
cartSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;