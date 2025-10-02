const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order', // reference to the Order model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ['cash_on_delivery', 'chapa', 'telebirr'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transaction_id: {
      type: String,
      unique: true, // important for Chapa
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Payment = mongoose.model("Payment", paymentSchema)

module.exports = Payment