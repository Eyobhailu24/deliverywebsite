import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

function Success() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    'Verifying payment...'
  );

  useEffect(() => {
    const verifyPayment = async () => {
      const tx_ref = params.get('tx_ref'); // from Chapa
      console.log(params);
      if (!tx_ref) {
        setMessage('No transaction reference found.');
        return;
      }

      try {
        const res = await axios.get(
          `https://food-delivery-backend-3ita.onrender.com/api/v1/payments/chapa/verify?tx_ref=${tx_ref}`
        );
        if (res.data.success) {
          setMessage(
            '✅ Payment successful! Your order is being processed.'
          );
        } else {
          setMessage(
            '❌ Payment failed. Please try again.'
          );
        }
      } catch (err) {
        console.error(err);
        setMessage('⚠️ Error verifying payment.');
      }
    };

    verifyPayment();
    setTimeout(() => {
      navigate('/');
    }, 3000);
  }, [params]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          {/* You can add a logo here if you want */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Status
        </h2>
        <p className="text-gray-600 text-lg">{message}</p>
        <p className="text-sm text-gray-400 mt-6">
          You will be redirected shortly...
        </p>
      </div>
    </div>
  );
}

export default Success;
