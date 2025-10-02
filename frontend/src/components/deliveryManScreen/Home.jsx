import axios from 'axios';
import { useEffect, useState } from 'react';

function Home() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Home - Flashdz';
    const fetchDeliveries = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(
          'http://127.0.0.1:3000/api/v1/delivery/',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedDeliveries = res.data.data.delivery;
        // Sort deliveries by assigned_at date, newest first
        const sortedDeliveries = fetchedDeliveries.sort(
          (a, b) =>
            new Date(b.assigned_at) -
            new Date(a.assigned_at)
        );
        console.log(sortedDeliveries);
        setDeliveries(sortedDeliveries);
      } catch (err) {
        console.error('Error fetching Delivery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  const updateStatus = async (deliveryId, newStatus) => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:3000/api/v1/delivery/${deliveryId}`,
        {
          status: newStatus,
        }
      );

      // Update the specific delivery and re-sort the list
      const updatedDeliveries = deliveries.map((d) =>
        d._id === deliveryId
          ? { ...d, status: newStatus }
          : d
      );
      updatedDeliveries.sort(
        (a, b) =>
          new Date(b.assigned_at) - new Date(a.assigned_at)
      );
      setDeliveries(updatedDeliveries);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-100 to-white">
        <p className="text-lg font-semibold animate-pulse text-gray-800">
          Loading deliveries...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl text-center font-bold mb-6 text-gray-800">
        🚗 Driver Dashboard
      </h1>

      {deliveries.length === 0 ? (
        <div className="bg-white shadow-md rounded-2xl p-8 text-center">
          <p className="text-gray-600 text-lg">
            No deliveries assigned yet. 🛵
          </p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto grid gap-6">
          {deliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="bg-white shadow-md rounded-xl p-6 border-l-4 border-yellow-400 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Delivery: {delivery._id}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      delivery.status === 'assigned' &&
                      'bg-blue-200 text-blue-800'
                    }
                    ${
                      delivery.status === 'picked_up' &&
                      'bg-yellow-100 text-yellow-600'
                    }
                    ${
                      delivery.status === 'on_the_way' &&
                      'bg-orange-100 text-orange-600'
                    }
                    ${
                      delivery.status === 'delivered' &&
                      'bg-green-100 text-green-700'
                    }
                    ${
                      delivery.status === 'failed' &&
                      'bg-red-100 text-red-600'
                    }
                  `}
                >
                  {delivery.status
                    .replace('_', ' ')
                    .toUpperCase()}
                </span>
              </div>

              <div className="text-gray-600 mb-3">
                <p>
                  <strong>Pickup:</strong>{' '}
                  {delivery.pickup_location?.latitude}{' '}
                  {delivery.pickup_location?.longitude}
                </p>
                <p>
                  <strong>Dropoff:</strong>{' '}
                  {delivery.dropoff_location?.latitude}
                  {','}
                  {delivery.dropoff_location?.longitude}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {delivery.status === 'assigned' && (
                  <button
                    onClick={() =>
                      updateStatus(
                        delivery._id,
                        'picked_up'
                      )
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow transition-colors"
                  >
                    Mark as Picked Up
                  </button>
                )}

                {delivery.status === 'picked_up' && (
                  <button
                    onClick={() =>
                      updateStatus(
                        delivery._id,
                        'on_the_way'
                      )
                    }
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow transition-colors"
                  >
                    On The Way
                  </button>
                )}

                {delivery.status === 'on_the_way' && (
                  <button
                    onClick={() =>
                      updateStatus(
                        delivery._id,
                        'delivered'
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition-colors"
                  >
                    Delivered
                  </button>
                )}

                {delivery.status !== 'delivered' && (
                  <button
                    onClick={() =>
                      updateStatus(delivery._id, 'failed')
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow transition-colors"
                  >
                    Failed
                  </button>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Assigned at:{' '}
                  {new Date(delivery.assigned_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
