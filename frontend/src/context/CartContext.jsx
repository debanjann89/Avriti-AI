import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/cart/${user.id}`);
      setCartItems(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product_id) => {
    if (!user) {
      alert("Please login to add to cart");
      return;
    }
    await axios.post('http://127.0.0.1:8000/api/cart/', { user_id: user.id, product_id });
    fetchCart();
    setIsCartOpen(true);
  };

  const removeFromCart = async (item_id) => {
    await axios.delete(`http://127.0.0.1:8000/api/cart/${item_id}`);
    fetchCart();
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, toggleCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
