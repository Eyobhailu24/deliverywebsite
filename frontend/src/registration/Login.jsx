import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import flashLogo from '../assets/flash.png';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    message: '',
    type: '', // 'success' or 'error'
  });
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ message: '', type: '' });

    try {
      const url =
        'http://127.0.0.1:3000/api/v1/users/login';

      const response = await axios.post(url, form, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.data.user)
      );
      setNotification({
        message: 'Login successful! Redirecting...',
        type: 'success',
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : error.message;
      setNotification({
        message: `Error: ${errorMessage}`,
        type: 'error',
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left section: Logo and text */}
        <div className="md:w-1/2 flex flex-col items-center justify-center bg-yellow-50 p-8 md:p-10">
          <img
            src={flashLogo}
            alt="Flash Logo"
            className="h-20 w-auto mb-4"
          />
          <h2 className="text-3xl font-extrabold text-yellow-500 mb-2">
            Welcome to Flashdz
          </h2>
          <p className="text-gray-700 text-center mb-2">
            Fast, fresh, and delivered to your door.
          </p>
          <p className="text-gray-500 text-center">
            Sign in to access exclusive deals and track your
            orders easily!
          </p>
        </div>
        {/* Right section: Form */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center text-yellow-500 mb-2 md:hidden">
            <img
              src={flashLogo}
              alt="Flash Logo"
              className="h-10 mx-auto object-contain"
            />
          </h2>
          <p className="text-gray-600 text-center mt-2 md:mt-0">
            Welcome back! Please login.
          </p>

          {notification.message && (
            <div
              className={`p-4 mt-4 text-sm rounded-lg ${
                notification.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
              role="alert"
            >
              <span className="font-medium">
                {notification.type === 'success'
                  ? 'Success!'
                  : 'Oops!'}
              </span>{' '}
              {notification.message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition disabled:bg-yellow-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="text-yellow-500 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
