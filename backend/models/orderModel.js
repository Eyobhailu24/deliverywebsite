const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: true });

const orderSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  delivery_address: {
    latitude: Number,
    longitude: Number
  },
  items: [OrderItemSchema],
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
    default: "pending"
  },
  total_amount: {
    type: Number,
    default: 10
  },
  payment: {
    method: {
      type: String,
      enum: ["cash_on_delivery", "chapa"],
      default: "cash_on_delivery"
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    transaction_id: {
      type: String,
      default: null
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

orderSchema.virtual('payments', {
  ref: 'Payment', // The model to use
  localField: '_id', // Order._id
  foreignField: 'order_id', // Payment.order_id
});
orderSchema.virtual('delivery', {
  ref: 'Delivery', // The model to use
  localField: '_id', // Order._id
  foreignField: 'order_id', // Delivery.order_id
});

orderSchema.set('toObject', { virtuals: true });
orderSchema.set('toJSON', { virtuals: true });


const Order = mongoose.model('Order',orderSchema)

module.exports = Order;