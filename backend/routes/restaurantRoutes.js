const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(restaurantController.getAllRestaurants);

router
  .route('/:id')
  .get(restaurantController.getRestaurant);

module.exports = router;
