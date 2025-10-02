const { nanoid } = require('nanoid');
const Payment = require('../models/paymentModel'); // your mongoose schema
const axios = require('axios');

async function initializeChapaPayment(req, res) {
  try {
    const {
      order_id,
      amount,
      email,
      first_name,
      last_name,
      phone,
    } = req.body;

    // Build payment data
    const tx_ref = nanoid();
    const data = {
      amount,
      currency: 'ETB',
      email,
      first_name,
      last_name,
      phone_number: phone,
      tx_ref, // unique transaction reference
      callback_url: `${
        import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
      }/api/v1/payments/chapa/verify`,
      return_url: `${
        import.meta.env.FRONTEND_URL
      }/payments/success?tx_ref=${tx_ref}`,
    };

    // Send request to Chapa API
    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === 'success') {
      // Save payment to DB with pending status
      const payment = new Payment({
        order_id,
        amount,
        method: 'chapa',
        status: 'pending',
        transaction_id: data.tx_ref,
      });
      await payment.save();

      // Return checkout URL to frontend
      return res.json({
        checkout_url: response.data.data.checkout_url,
      });
    } else {
      return res
        .status(400)
        .json({ error: 'Failed to initialize payment' });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'Internal Server Error' });
  }
}

async function verifyChapaPayment(req, res) {
  try {
    const tx_ref = req.query.tx_ref; // transaction reference from callback
    console.log('my name isssssss ' + tx_ref);

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status === 'success') {
      const payment = await Payment.findOneAndUpdate(
        { transaction_id: tx_ref },
        { status: 'completed' },
        { new: true }
      );

      // Redirect or respond to frontend
      return res.json({ success: true, payment });
    } else {
      await Payment.findOneAndUpdate(
        { transaction_id: tx_ref },
        { status: 'failed' }
      );
      return res.json({
        success: false,
        message: 'Payment failed',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
}

module.exports = {
  initializeChapaPayment,
  verifyChapaPayment,
};
