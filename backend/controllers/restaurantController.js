const Restaurant = require('../models/restaurantModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllRestaurants = async (req, res, next) => {
  let filter = {};
  if (req.params.restaurantId)
    filter = { restaurant: req.params.restaurantId };

  const features = new APIFeatures(
    Restaurant.find(filter),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  const restaurants = await Restaurant.find();
  res.status(200).json({
    status: 'success',
    data: {
      restaurants: doc,
    },
  });
};

exports.getRestaurant = async (req, res, next) => {
  const restaurant = await Restaurant.findById(
    req.params.id
  );
  res.status(200).json({
    status: 'success',
    data: {
      restaurant: restaurant,
    },
  });
};
