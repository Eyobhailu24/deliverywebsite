import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Categories({ restaurants }) {
  const [selected] = useState('');
  const navigate = useNavigate()

  // flatten categories from restaurants
  const cat = restaurants.map((r) => r.menu.map((m) => m));
  const categories = cat.flat();

  // ✅ remove duplicate categories by category name
  const uniqueCategories = Array.from(
    new Map(categories.map((c) => [c.category, c])).values()
  );  

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-4xl font-bold mb-6">
        Food Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {uniqueCategories.map((cat) => (
          <button
            key={cat.category}
            onClick={() => navigate(`/fooditems/${cat.category}`)}
            className={`relative w-full h-40 sm:h-48 md:h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer ${
              selected === cat.category
                ? 'ring-2 ring-yellow-500'
                : ''
            }`}
          >
            <img
              src={cat.image}
              alt={cat.image}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-black/20 text-white text-center py-2">
              <span className="font-semibold text-sm sm:text-base">
                {cat.category}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
