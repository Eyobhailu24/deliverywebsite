import axios from 'axios';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const RestaurantContext = createContext();


export function RestaurantProvider({ children }) {
  const [restaurants, setRestaurant] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);



  const setLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      (err) => {
        console.error('Error getting location:', err);
        alert('Failed to get location. Please enable GPS.');
      },
      { enableHighAccuracy: true }
    );
  };
 
  
  useEffect(() => {
    document.title = 'Home - Flashdz';

    const fetchRestaurants = async () => {
      const token = localStorage.getItem('token');

      try {
        setIsLoading(true);
        const res = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/api/v1/restaurants/`,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setRestaurant(res.data.data.restaurants);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

return (
  <RestaurantContext.Provider value={{ restaurants, isLoading, latitude ,longitude, setLocation }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurants() {
  return useContext(RestaurantContext);
}