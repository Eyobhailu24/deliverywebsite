import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCarts } from '../../context/CartContext';
import { X } from 'lucide-react'; // 👈 make sure you have this imported
import toast, { Toaster } from 'react-hot-toast';
import { useRestaurants } from '../../context/RestaurantContext';

export default function Checkout() {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState();
  const [paymentMethod, setPaymentMethod] = useState(
    'cash_on_delivery'
  );
  const [discount, setDiscount] = useState(0);
  const [user] = useState(
    JSON.parse(localStorage.getItem('user')) || ''
  );

  const { cart, removeFromCart, total, Coupon } =
    useCarts();
  
  const { latitude, longitude} = useRestaurants()
  console.log(latitude, longitude)

  const menuItems = cart.map((item) => ({
    item_id: item._id, // uses backend ID
    name: item.name,
    price: item.price,
    quantity: item.qty,
  }));

  // const cart = JSON.parse(localStorage.getItem('cart'));
  // console.log(cart);

  const { id } = useParams();

  const deliveryFee = 10.0;
  const serviceCharge = 15.0;
  const totalToPay =
    total - discount + deliveryFee + serviceCharge;

  console.log(paymentMethod);

  const orderData = {
    customer_id: user._id,
    restaurant_id: id,
    items: menuItems,
    delivery_address: {
      latitude:latitude,
      longitude:longitude
    },
    total_amount: totalToPay,
    payment: {
      method: paymentMethod,
      status: 'pending',
    },
  };

  async function handleOrder(id) {
    if (!user) {
      alert('you need to log in First');
      return navigate('/login');
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://127.0.0.1:3000/api/v1/orders/${id}`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const order = res.data.data;
      console.log(order);
      if (paymentMethod === 'cash_on_delivery') {
        navigate('/');
      } else if (paymentMethod === 'chapa')
        navigate(`/initialpayment`, {
          state: { order: order },
        });
      toast.success('Order Placed Successfully');
      // navigate(`/payments/${res.data.data}`);
      // if (orderData.payment.method === 'cash_on_delivery'){

      // }
      // if (orderData.payment.method === 'chapa'){
      //   navigate('/payment')
      // }
      const orderId = order.newOrder._id;

      // 2. Assign driver
      const deliveryRes = await axios.post(
        `http://127.0.0.1:3000/api/v1/delivery/${orderId}`
      );

      console.log(deliveryRes)
      // setDelivery(deliveryRes.data.delivery);
    } catch (err) {
      toast.error(err?.message + ' failed to place order');
    }
  }

  function handleDiscount() {
    if (Coupon === coupon) {
      setDiscount(100);
    } else {
      setDiscount(0);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
      {/* Card container */}
      <div className="bg-white w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col relative">
        {/* Close button */}
        <button
          onClick={() => navigate(-1)} // 👈 closes modal (go back)
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="bg-green-600 text-white p-5 flex items-center gap-3 rounded-t-2xl">
          <span className="text-2xl">🛒</span>
          <h1 className="text-2xl font-bold">My Basket</h1>
        </div>

        {/* Cart Items */}
        <div className="flex-1 divide-y">
          {cart?.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start p-4"
            >
              {/* Left side */}
              <div className="flex gap-3">
                <div className="bg-orange-500 text-white w-9 h-9 flex items-center justify-center rounded-full font-semibold">
                  {item.qty}x
                </div>
                <div>
                  <p className="font-bold text-green-700">
                    ETB {item.price.toFixed(2)}
                  </p>
                  <p className="font-semibold">
                    {item.name}
                  </p>
                  {item.description && (
                    <p className="text-sm text-gray-500">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeFromCart(item.name)}
                className="text-gray-400 hover:text-red-500"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t p-5 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Sub Total:</span>
            <span>{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Discounts:</span>
            <span>-{discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">
              Delivery Fee:
            </span>
            <span>{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">
              Service Charge:
            </span>
            <span>{serviceCharge.toFixed(2)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="bg-orange-100 p-5 flex justify-between items-center font-bold text-lg">
          <span>Total to pay</span>
          <span className="text-orange-600">
            ETB {totalToPay.toFixed(2)}
          </span>
        </div>

        {/* Payment Method */}
        <div className="p-4 space-y-2">
          <label
            htmlFor="payment-method"
            className="block font-medium text-gray-700"
          >
            Select your payment method
          </label>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          >
            <option value="cash_on_delivery">
              💵 Cash on Delivery
            </option>
            <option value="chapa">💳 Chapa</option>
          </select>
        </div>

        {/* Coupon */}
        <div className="p-4 space-y-3">
          <div className="flex">
            <input
              type="text"
              placeholder="Apply Coupon Code here"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="flex-grow px-3 py-2 rounded-l-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            />
            <button
              onClick={handleDiscount}
              className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="p-5">
          <button
            onClick={() => handleOrder(id)}
            className="w-full bg-orange-500 text-white py-3 rounded font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition"
          >
            ➡️ Place Order!
          </button>
        </div>
      </div>
    </div>
  );
}
