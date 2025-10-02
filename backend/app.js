const express = require('express');
const morgan = require('morgan');
const RestaurantRouter = require('./routes/restaurantRoutes');
const UserRouter = require('./routes/userRoutes');
const OrderRouter = require('./routes/orderRoutes');
const PaymentRouter = require('./routes/paymentRoutes');
const DeliveryRouter = require('./routes/deliveryRoutes');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors({ origin: `${
  import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
}` }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morgan('dev'));

app.use('/api/v1/restaurants', RestaurantRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/orders', OrderRouter);
app.use('/api/v1/payments', PaymentRouter)
app.use('/api/v1/delivery', DeliveryRouter)

module.exports = app;
