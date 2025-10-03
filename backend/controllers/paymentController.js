const { nanoid } = require('nanoid');
const Payment = require('../models/paymentModel'); // mongoose schema
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

    // Unique transaction reference
    const tx_ref = nanoid();

    const data = {
      amount,
      currency: 'ETB',
      email,
      first_name,
      last_name,
      phone_number: phone,
      tx_ref,
      return_url: `${process.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/payments/chapa/verify?tx_ref=${tx_ref}`,
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
      // Save payment to DB (status = pending until verified)
      const payment = new Payment({
        order_id,
        amount,
        method: 'chapa',
        status: 'pending',
        transaction_id: tx_ref,
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
    const tx_ref = req.query.tx_ref;

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status === 'success') {
      await Payment.findOneAndUpdate(
        { transaction_id: tx_ref },
        { status: 'completed' }
      );
    } else {
      await Payment.findOneAndUpdate(
        { transaction_id: tx_ref },
        { status: 'failed' }
      );
    }

    // Redirect user to homepage, no messages
    return res.redirect(process.env.FRONTEND_URL);
  } catch (err) {
    console.error(err);
    return res.redirect(process.env.FRONTEND_URL); // redirect anyway
  }
}

  


module.exports = {
  initializeChapaPayment,
  verifyChapaPayment,
};
