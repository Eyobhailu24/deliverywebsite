import { Menu, ShoppingCart, X, Trash } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import flashLogo from '../assets/flash.png';
import { useCarts } from '../context/CartContext';

export default function Navbar({ user, restaurant }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { cart, total, removeFromCart } = useCarts();
  const [activeLink, setActiveLink] = useState('Home');
  const [showCart, setShowCart] = useState(false); // cart popup state

  function handleLogin() {
    if (user) return navigate('/profile');
    navigate('/login');
  }

  function myOrders(l) {
    setActiveLink(l);
    if (l === 'Track Order') navigate('/orders');
  }

  return (
    <header className="bg-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={flashLogo}
              alt="Flash Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-end ml-9 gap-8 text-gray-700 font-medium">
            {['Track Order'].map((l) => (
              <a
                key={l}
                className={`${
                  activeLink === l
                    ? 'text-yellow-600'
                    : 'text-yellow-900'
                } hover:text-yellow-600 hover:cursor-pointer`}
                onClick={() => myOrders(l)}
              >
                {l}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogin}
              className="hidden md:inline bg-black text-white px-4 py-2 rounded-full"
            >
              {user ? 'Profile' : 'Signup'}
            </button>

            {/* Shopping cart trigger */}
            <div
              onClick={() => setShowCart(true)}
              className="flex items-center gap-3 bg-green-50 border border-green-200 px-3 py-2 rounded-lg cursor-pointer"
            >
              <ShoppingCart size={18} />
              <div className="text-sm">
                <div className="font-medium">Items</div>
                <div className="text-xs text-gray-500">
                  ETB {total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Mobile Menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setOpen((s) => !s)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-3">
              {['Track Order'].map((l) => (
                <a
                  key={l}
                  className={`px-3 py-2 rounded hover:bg-gray-100 ${
                    activeLink === l
                      ? 'text-yellow-600'
                      : 'text-gray-700'
                  }`}
                  onClick={() => myOrders(l)}
                >
                  {l}
                </a>
              ))}
              <button
                onClick={handleLogin}
                className="mx-3 my-2 bg-black text-white px-4 py-2 rounded"
              >
                {user ? 'Profile' : 'Signup'}
              </button>
            </nav>
          </div>
        )}
      </div>
      {/* Cart Popup Drawer */}
      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-50 w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-800">
                Your Cart
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowCart(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingCart
                    size={48}
                    className="mx-auto text-gray-300"
                  />
                  <p className="mt-4 text-gray-500">
                    Your cart is empty.
                  </p>
                  <p className="text-sm text-gray-400">
                    Add items to get started!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.qty} × ETB{' '}
                          {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <p className="font-bold text-gray-900 w-24 text-right">
                          ETB{' '}
                          {(item.qty * item.price).toFixed(
                            2
                          )}
                        </p>
                        <button
                          onClick={() =>
                            removeFromCart(item.name)
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-white rounded-b-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800">
                    Total
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ETB {total.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `/checkout/${
                        cart[0].restaurantId ||
                        restaurant._id
                      }`
                    )
                  }
                  className="w-full bg-yellow-500 text-white font-bold cursor-pointer py-3 px-4 rounded-xl hover:bg-yellow-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
