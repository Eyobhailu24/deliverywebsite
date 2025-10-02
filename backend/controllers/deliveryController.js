const Delivery = require('../models/deliveryModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

// Assign driver when customer places an order
exports.assignDriver = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // 1. Find the order
    const order = await Order.findById(orderId).populate(
      'restaurant_id'
    );
    if (!order)
      return res
        .status(404)
        .json({ message: 'Order not found' });

    // 2. Find an available driver (simplest way: just pick the first one)
    const driver = await User.findOne({
      role: 'delivery-man',
    });
    if (!driver)
      return res
        .status(400)
        .json({ message: 'No drivers available' });

    // 3. Create a delivery document
    const newDelivery = await Delivery.create({
      order_id: order._id,
      restaurant_id: order.restaurant_id._id,
      driver_id: driver._id,
      delivery_Man: driver.name,
      status: 'assigned',
      timeline: [{ status: 'assigned' }],
      pickup_location: {
        latitude: order.restaurant_id.latitude || null,
        longitude: order.restaurant_id.longitude || null,
      },
      dropoff_location: {
        latitude: order.delivery_address.latitude || null,
        longitude: order.delivery_address.longitude || null,
      },
    });

    return res.status(201).json({
      message: 'Driver assigned successfully',
      delivery: newDelivery,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Server error', error });
  }
};

exports.getDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.find({
      driver_id: req.user.id,
    });
    if (!delivery)
      return res.status(404).json({
        status: 'failed',
        message: 'delivery man not found',
      });

    res.status(200).json({
      status: 'success',
      data: {
        delivery,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.updateDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!delivery)
      return res.status(404).json({
        status: 'failed',
        message: 'delivery info not found',
      });

    res.status(200).json({
      status: 'success',
      data: {
        delivery,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};
