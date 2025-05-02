import React, {createContext, useState, useEffect} from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "../axios";
export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
  const [user, setUser] = useState(localStorage.getItem("user") ? localStorage.getItem("user") || {} : null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState(localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) || {} : []);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [vegMode, setVegMode] = useState(localStorage.getItem("vegMode") === "true");
  const checkUser = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/user/check`);
      if (response.data.status === "OK" && response.data.user) {
        setUser(response.data.user);
        setCart((prev) => {
          const newItems = response.data.user.cart.filter((item) => {
            return !prev.some((cartItem) => item.product._id === cartItem.product._id);
          });
          // console.log(newItems);
          localStorage.setItem("cart", JSON.stringify([...prev, ...newItems]));
          updateCartInDB([...prev, ...newItems]);
          return [...prev, ...newItems];
        });
        // setCart(response.data.user.cart);

        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsLoading(false);
      } else {
        localStorage.clear("user");
        setIsLoading(false);
      }
    } catch (err) {
      // console.log(err);
      localStorage.clear("user");
      setIsLoading(false);
    }
  };
  const updateCartInDB = async (cart) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/cart/update`, cart);
      if (response.data.success) {
        // toast.success(`product added to cart in database.`);
      }
    } catch (err) {
      // toast.error(`unable to add product to cart in database.`);
    }
  };
  useEffect(() => {
    try {
      checkUser();
    } catch (err) {
      // console.log(err);
    }
  }, []);

  // Add effect to update cart in database when cart changes
  useEffect(() => {
    if (user && user._id && cart.length >= 0 && !cartUpdated) {
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartUpdated(true);
    }
  }, [cart]);
  
  // Save vegMode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("vegMode", vegMode);
  }, [vegMode]);

  return <AppContext.Provider value={{cart, setCart, checkUser, user, setUser, isLoading, setIsLoading, vegMode, setVegMode}}>{children}</AppContext.Provider>;
};
