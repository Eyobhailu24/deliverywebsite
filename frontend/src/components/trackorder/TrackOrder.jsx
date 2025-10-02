import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // saved at login
        const res = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/api/v1/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data.data.order)
        setOrders(res.data.data.order);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-100 to-white">
        <p className="text-lg font-semibold animate-pulse text-gray-800">
          Loading orders...
        </p>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-yellow-100 to-white">
        <p className="text-xl font-bold text-gray-800">
          No orders yet. Go order some food! 🍔
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-yellow-600 transition"
        >
          Back to Home
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-6">
      {/* Floating Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition"
      >
        ⬅
      </button>

      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        My Orders
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-xl p-6 border-l-4 border-yellow-400 hover:shadow-lg transition"
          >
            <h3 className="font-bold text-lg text-gray-900">
              {order.restaurant_id?.name ||
                'Unknown Restaurant'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {order.restaurant_id?.address}
            </p>

            <div className="mb-3">
              <strong className="text-gray-800">
                Items:
              </strong>
              <ul className="list-disc ml-6 text-gray-700">
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.name} × {item.quantity} —{' '}
                    {item.price} birr
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                <strong>Status:</strong>{' '}
                <span className="text-yellow-600 font-semibold">
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Delivery Man:</strong>{' '}
                <span className="text-yellow-600 font-semibold">
                  {order.delivery[0].delivery_Man} (
                  {order.delivery[0].status})
                </span>
              </p>
              <p>
                <strong>Total:</strong>{' '}
                <span className="text-yellow-600 font-semibold">
                  {order.total_amount} birr
                </span>
              </p>
              <p>
                <strong>Payment:</strong>{' '}
                <span className="text-yellow-600 font-semibold">
                  {order.payments[0]?.method ||
                    order.payment.method}{' '}
                  (
                  {order.payments[0]?.status ||
                    order.payment.status}
                  )
                </span>
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Ordered at:{' '}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrackOrder;
