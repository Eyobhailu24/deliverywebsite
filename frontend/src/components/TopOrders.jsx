import { useEffect, useState } from 'react';
import { useCarts } from '../context/CartContext';

export default function TopOrders({
  searchQuery,
  restaurants,
  items,
}) {
  const { cart, addToCart } = useCarts(); // <-- assume clearCart exists in your context
  const [active, setActive] = useState('');

  // Extract categories
  const categories = restaurants
    .map((r) => r.menu.map((m) => m.category))
    .flat();

  const uniqueCategories = [...new Set(categories)];

  // Flatten items

  // Default tab
  useEffect(() => {
    if (uniqueCategories.length && !active) {
      setActive(uniqueCategories[0]);
    }
  }, [uniqueCategories, active]);

  // Filtered items
  const filtered = items.filter(
    (item) =>
      item.category === active &&
      item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  
  const discount = filtered.filter(
    (item) => item.discount !== null
  );


  // Handle add to cart with restaurant restriction
  const handleAddToCart = (item) => {
    if (
      cart.length > 0 &&
      cart[0].restaurantId !== item.restaurantId
    ) {
      alert(
        `You can only order from one restaurant at a time.`
      );
      return;
    }
    const finalItem = {
      ...item,
      price: item.discount
        ? item.price - (item.price * item.discount) / 100
        : item.price,
    };
    addToCart(finalItem);
  };

  return (
    <>
      {discount ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-6">
            Top Recommended Orders
          </h2>

          <div className="flex gap-4 mb-6 overflow-x-auto">
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap cursor-pointer ${
                  active === cat
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {discount.map((order, idx) => (
              <div
                key={idx}
                className="relative w-full h-56 sm:h-64 md:h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <img
                  src={order.image_url}
                  alt={order.name}
                  className="w-full h-full object-cover"
                />
                {
                  <div
                    className="absolute top-0 right-0 bg-transparent text-white text-sm font-bold tracking-wider uppercase px-3 py-1.5 rounded-bl-xl"
                    style={{
                      textShadow:
                        '0px 2px 6px rgba(0,0,0,0.9)',
                    }}
                  >
                    {order.discount}% OFF
                  </div>
                }
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-black/30 text-white p-4 flex flex-col gap-2">
                  <h3 className="font-semibold text-base">
                    {order.name}
                  </h3>
                  <p className="text-sm">
                    ETB {order.price - (order.price * order.discount) / 100} –{' '}
                    <span className="italic">
                      {order.restaurant}
                    </span>
                  </p>
                  <button
                    onClick={() => handleAddToCart(order)}
                    className="self-start bg-yellow-500 text-white px-3 py-1.5 cursor-pointer rounded text-sm hover:bg-yellow-600 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-gray-500 col-span-full">
          No discount item found in this category.
        </p>
      )}
    </>
  );
}
