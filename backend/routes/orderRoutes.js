const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/:restaurantId')
  .post(authController.protect,authController.restrictTo('user'), orderController.placeOrder);

router
  .route('/')
  .get(authController.protect, orderController.getMyOrders);

module.exports = router;
