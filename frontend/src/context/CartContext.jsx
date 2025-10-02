import React, {
  createContext,
  useContext,
  useState,
} from 'react';

const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const Coupon = 'FlashDel';

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((p) => p.name === item.name);
      if (found) {
        return prev.map((p) =>
          p.name === item.name
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (name) => {
    setCart((prev) => prev.filter((p) => p.name !== name));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        total,
        setCart,
        Coupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCarts() {
  const context = useContext(CartContext);
  if (context === undefined)
    throw new Error(
      'PostContext was used outside of the postProvider'
    );
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CartProvider, useCarts };
