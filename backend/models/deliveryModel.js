// models/Delivery.js
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  delivery_Man:{
    type: String,
    required: [true,'a delivery man is required']
  },
  status: {
    type: String,
    enum: [
      'assigned',
      'picked_up',
      'on_the_way',
      'delivered',
      'failed',
      'cancelled',
    ],
    default: 'assigned',
  },

  timeline: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],

  pickup_location: {
    address: String,
    latitude: Number,
    longitude: Number,
  },

  dropoff_location: {
    address: String,
    latitude: Number,
    longitude: Number,
  },

  assigned_at: { type: Date, default: Date.now },
  picked_up_at: Date,
  delivered_at: Date,
});

const Delivery = mongoose.model('Delivery', deliverySchema)

module.exports = Delivery;
