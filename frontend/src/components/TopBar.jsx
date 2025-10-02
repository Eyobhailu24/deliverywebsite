import { useCarts } from '../context/CartContext';
import { useRestaurants } from '../context/RestaurantContext';

export default function TopBar() {
  const { Coupon } = useCarts();
  const { latitude, longitude, setLocation} = useRestaurants()
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-700 flex items-center justify-between py-2">
        <div className="flex items-center gap-4">
          <span>
            ✨ Get 100 ETB Off your first order, Promo:{' '}
            <span className="font-semibold text-yellow-600">
              {Coupon}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-blue-500 hover:text-blue-700">
            {latitude}, {longitude}
            <button onClick={()=>setLocation()} className="underline ml-2 cursor-pointer text-yellow-600 hover:text-yellow-800">
              Change Location
            </button>
          </div>
          <div className="hidden sm:inline text-xs text-gray-500">
            Customer service • Delivery times
          </div>
        </div>
      </div>
    </div>
  );
}
