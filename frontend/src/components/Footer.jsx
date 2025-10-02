import { useNavigate } from 'react-router-dom';
import flashLogo from '../assets/flash.png';

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-8">
        {/* Subscribe */}
        <div>
          <img
            src={flashLogo}
            alt="Flash Logo"
            className="h-10 w-auto object-contain"
          />
          <p className="mt-2">Get Exclusive Deals</p>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-white mb-2">
            Legal Pages
          </h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#">Terms & Conditions</a>
            </li>
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">Cookies</a>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold text-white mb-2">
            Registration
          </h4>
          <ul className="space-y-1 text-sm">
            <li
              onClick={() => navigate('/signup')}
              className="cursor-pointer"
            >
              Sign Up
            </li>
            <li
              onClick={() => navigate('/login')}
              className="cursor-pointer"
            >
              Log In
            </li>
            <li>
              <a className="cursor-pointer" href="#">
                Sign up to deliver
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center text-sm py-4 text-gray-500">
        © Flashdz 2024, All Rights Reserved.
      </div>
    </footer>
  );
}
