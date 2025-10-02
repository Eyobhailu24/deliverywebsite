import { useEffect, useState } from 'react';
import Categories from '../components/Categories';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import PopularRestaurants from '../components/PopularRestaurants';
import TopBar from '../components/TopBar';
import TopOrders from '../components/TopOrders';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useRestaurants } from '../context/RestaurantContext';
import Home from '../components/deliveryManScreen/Home';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurant] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || ''
  );
  const { setLocation } = useRestaurants();

  setLocation();

  useEffect(() => {
    document.title = 'Home - Flashdz';
    const fetchRestaurants = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/api/v1/restaurants/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRestaurant(res.data.data.restaurants);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    };
    fetchRestaurants();
  }, []);

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

  return (
    <div className="min-h-screen w-full flex flex-col">
      {(user.role === 'delivery-man') ? (
        <div>
        <TopBar />
        <Navbar user={user} setUser={setUser} />
        <Home />
      </div>
      ) : (
        <>
          <TopBar />
          <Navbar user={user} setUser={setUser} />
          <Hero
            onSearch={(q) => setSearchQuery(q)}
            user={user}
            setUser={setUser}
          />
          <main className="flex-grow">
            <div id="top">
              <TopOrders
                searchQuery={searchQuery}
                restaurants={restaurants}
                items={items}
              />
            </div>
            <PopularRestaurants restaurants={restaurants} />
            <Categories restaurants={restaurants} />
          </main>
          <Footer />
          <Toaster position="top-center" />
        </>
        
      )}
    </div>
  );
}

export default HomePage;
