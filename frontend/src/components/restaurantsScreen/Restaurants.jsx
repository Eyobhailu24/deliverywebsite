import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCarts } from '../../context/CartContext';
import { useRestaurants } from '../../context/RestaurantContext';
import Loading from '../Loading';
import Navbar from '../Nav';
import TopBar from '../TopBar';
import Footer from '../Footer';

export default function Restaurant() {
  const { cart, addToCart } = useCarts();

  const { id } = useParams();

  const [user] = useState(
    JSON.parse(localStorage.getItem('user')) || ''
  );

  const { restaurants, isLoading } = useRestaurants();

  const restaurant = restaurants?.find((r) => r._id === id);

  if (isLoading || !restaurant) {
    return <Loading />;
  }

  const handleAddToCart = (item) => {
    const menu = { ...item, restaturantId: restaurant._id };

    if (
      cart.length > 0 &&
      cart[0].restaurantId !== menu.restaurantId
    ) {
      alert(
        `You can only order from one restaurant at a time.`
      );
      return;
    }
    addToCart(item);
  };

  console.log(cart);

  return (
    <>
      {!isLoading ? (
        <div className="min-h-screen w-full flex flex-col">
          <TopBar />
          <Navbar user={user} restaurant={restaurant} />
          <div className="bg-gray-50 min-h-screen">
            <div className="px-4 sm:px-6 lg:px-8">
              {/* LEFT: Restaurant + Menu */}
              <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow mt-6 rounded-lg p-6">
                  <h1 className="text-3xl font-bold">
                    {restaurant.name}
                  </h1>
                  <p className="text-gray-500">
                    I’m lovin’ it!
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="bg-gray-100 px-3 py-1 rounded">
                      {restaurant.description}
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded">
                      {`opening hours: ${restaurant.opening_time}`}
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded">
                      {`closing hours: ${restaurant.closing_time}`}
                    </span>
                  </div>
                </div>
                {/* Categories & Search (UI Only, no functionality) */}

                {/* Menu Sections */}
                <div className="p-6">
                  {restaurant.menu.map((section, sIdx) => (
                    <div key={sIdx} className="mt-8">
                      <h2 className="text-2xl font-bold mb-6">
                        {section.category}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                        {section.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                          >
                            <div className="relative">
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              )}
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="text-gray-500 text-sm mt-1 flex-grow">
                                  {item.description}
                                </p>
                              )}
                              <p className="font-bold text-lg mt-3 text-gray-900">
                                ETB {item.price.toFixed(2)}
                              </p>
                              <button
                                onClick={() =>
                                  handleAddToCart(item)
                                }
                                className="mt-4 w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300 cursor-pointer"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </>
  );
}
