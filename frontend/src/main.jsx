import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { StrictMode } from 'react';
import { RestaurantProvider } from './context/RestaurantContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RestaurantProvider>
      <App />
    </RestaurantProvider>
  </StrictMode>
);
