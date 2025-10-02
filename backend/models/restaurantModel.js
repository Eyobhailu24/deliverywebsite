const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    image_url: String,
    discount: {
      type: Number,
      default: null
    }
  },
  { _id: true }
); // keep _id for each item

const MenuCategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: String,
    items: [MenuItemSchema],
  },
  { _id: true }
);

const restaurantSchema = new mongoose.Schema({
  // owner_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // reference to Users collection
  //   required: true,
  // },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  img: String,
  description: String,
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  is_open: {
    type: Boolean,
    default: true,
  },
  opening_time: String, // "09:00"
  closing_time: String, // "22:00"
  menu: [MenuCategorySchema],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Restaurant = mongoose.model(
  'Restaurant',
  restaurantSchema
);

module.exports = Restaurant;
