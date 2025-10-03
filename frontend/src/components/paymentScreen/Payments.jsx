import axios from 'axios';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

function Payments() {
  const [loading, setLoading] = useState(false);
  const [user] = useState(
    JSON.parse(localStorage.getItem('user')) || ''
  );
  console.log(user);
  const location = useLocation();
  const { order } = location.state;

  console.log(order.newOrder.total_amount);

  const handleChapaPayment = async () => {
    try {
      setLoading(true);

      // Call backend API
      const res = await axios.post(
        'https://food-delivery-backend-3ita.onrender.com/api/v1/payments/chapa/initialize',
        {
          order_id: order.newOrder._id,
          amount: order.newOrder.total_amount,
          email: user.email,
          first_name: user.name,
          last_name: 'hailu',
          phone: '0968475774',
        }
      );

      if (res.data.checkout_url) {
        // Redirect to Chapa payment page
        window.location.href = res.data.checkout_url;
      } else {
        alert('Something went wrong initializing payment');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to start payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        {/* Chapa Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://ethiopianlogos.com/logos/chapa_gradient/chapa_gradient.png"
            alt="Chapa Logo"
            className="h-12"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Complete Your Payment
        </h2>
        <p className="text-gray-500 mb-6">
          You are about to pay for your order from Flash
          Delivery.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <p className="text-lg text-gray-600">
            Total Amount
          </p>
          <p className="text-4xl font-extrabold text-gray-900">
            {order.newOrder.total_amount.toFixed(2)}{' '}
            <span className="text-2xl font-semibold">
              ETB
            </span>
          </p>
        </div>

        <button
          onClick={handleChapaPayment}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-700 transition-all duration-300 disabled:bg-green-300"
        >
          {loading ? 'Processing...' : 'Pay with Chapa'}
        </button>
      </div>
    </div>
  );
}

export default Payments;
