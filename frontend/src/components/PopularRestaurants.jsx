import { Link } from 'react-router-dom';

export default function PopularRestaurants({
  restaurants,
}) {

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-4xl font-bold mb-6">
        Popular Restaurants
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {restaurants.map((rest) => (
          <Link
            to={`/restaurant/${rest._id}`}
            key={rest._id}
          >
            <div className="relative w-full h-40 sm:h-48 md:h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <img
                src={rest.img}
                alt={rest.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-black/20 text-white text-center py-2">
                <span className="font-semibold text-sm sm:text-base">
                  {rest.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
