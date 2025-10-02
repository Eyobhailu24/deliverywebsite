const express = require('express')
const authController = require('../controllers/authController');
const deliveryController = require('../controllers/deliveryController');

const router = express.Router();

router.route('/:orderId').post(deliveryController.assignDriver)
router.route('/').get(authController.protect,deliveryController.getDelivery)
router.route('/:id').put(deliveryController.updateDelivery)


module.exports = router;