import { useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom';
import Checkout from './components/checkoutScreen/Checkout';
import FoodItems from './components/FoodItems';
import Profile from './components/Profile/Profile';
import Restaurant from './components/restaurantsScreen/Restaurants';
import TrackOrder from './components/trackorder/TrackOrder';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import Login from './registration/Login';
import Signup from './registration/Signup';
import Payments from './components/paymentScreen/Payments';
import Success from './components/paymentScreen/Success';

export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || ' '
  );

  
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route index path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={<Profile setUser={setUser} />}
          />
          <Route
            path="restaurant/:id"
            element={
              <Restaurant user={user} setUser={setUser} />
            }
          />
          <Route
            path="/checkout/:id"
            element={<Checkout />}
          />
          <Route
            path="/initialpayment"
            element={<Payments />}
          />
          <Route
            path="/payments/success"
            element={<Success />}
          />
          <Route path="/orders" element={<TrackOrder />} />
          <Route
            path="/fooditems/:category"
            element={
              <FoodItems user={user} setUser={setUser} />
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
    
  );
}
