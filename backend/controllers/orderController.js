const Restaurant = require('../models/restaurantModel');
const Order = require('../models/orderModel');
const res = require('express/lib/response');

exports.placeOrder = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(
      restaurantId
    );
    const {
      items,
      delivery_address,
      payment,
      total_amount,
      status,
      created_at,
    } = req.body;

    // check if restaurant exists
    if (!restaurant) {
      return res.status(404).json({
        status: 'failed',
        message: 'No restaurant found with that ID',
      });
    }

    // check if the user exists
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({
        status: 'failed',
        message: 'User not authenticated',
      });
    }
    // must contain at least one item

    if (!items || items.length === 0) {
      return res.status(400).json({
        status: 'failed',
        message: 'Order must contain at least one item',
      });
    }

    const newOrder = await Order.create({
      customer_id: userId,
      restaurant_id: restaurantId,
      items,
      delivery_address,
      payment,
      total_amount,
      status,
      created_at,
    });

    res.status(200).json({
      status: 'successfully ordered',
      data: {
        newOrder,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const order = await Order.find({
      customer_id: req.user.id,
    })
      .populate('restaurant_id')
      .populate('customer_id')
      .populate('payments')
      .populate('delivery')
      .sort({ created_at: -1 });

    res.status(200).json({
      status: 'success',
      num_orders: order.length,
      data: {
        order: order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.updateMyOrders = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        order: order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};
