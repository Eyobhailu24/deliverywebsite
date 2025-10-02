import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCarts } from '../context/CartContext';
import { useRestaurants } from '../context/RestaurantContext';
import Footer from './Footer';
import Navbar from './NavBar';
import TopBar from './TopBar';

function FoodItems() {
  const { category } = useParams();
  const {restaurants} = useRestaurants();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || ''
  );


  const items = restaurants
    .map((r) =>
      r.menu.flatMap((m) =>
        m.items.map((i) => ({
          ...i,
          category: m.category,
          restaurant: r.name,
          restaurantId: r._id, // you can use _id if available
          image_url: i.image_url || m.image || r.img,
        }))
      )
    )
    .flat();

  const { cart, addToCart } = useCarts(); // <-- assume clearCart exists in your context

  // Extract categories
  const uniqueCategories = category;

  // Filtered items
  const filtered = items.filter(
    (item) => item.category === uniqueCategories
  );

  // Handle add to cart with restaurant restriction
  const handleAddToCart = (item) => {
    if (
      cart.length > 0 &&
      cart[0].restaurantId !== item.restaurantId
    ) {
      //you can remove all carts don't forget eyob
      alert(
        `You can only order from one restaurant at a time.`
      );
      return;
    }
    addToCart(item);
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <TopBar />
      <Navbar user={user} setUser={setUser} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-5xl font-bold mb-6">
          {uniqueCategories}
        </h2>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((order, idx) => (
            <div
              key={idx}
              className="relative w-full h-56 sm:h-64 md:h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <img
                src={order.image_url}
                alt={order.name}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-black/30 text-white p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-base">
                  {order.name}
                </h3>
                <p className="text-sm">
                  £{order.price} –{' '}
                  <span className="italic">
                    {order.restaurant}
                  </span>
                </p>
                <button
                  onClick={() => handleAddToCart(order)}
                  className="self-start cursor-pointer bg-yellow-500 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-gray-500 col-span-full">
              No items found in this category.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default FoodItems;
