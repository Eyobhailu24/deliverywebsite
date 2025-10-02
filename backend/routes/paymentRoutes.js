const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router
  .route('/chapa/initialize')
  .post(paymentController.initializeChapaPayment);
router
  .route('/chapa/verify')
  .get(paymentController.verifyChapaPayment);

module.exports = router;
