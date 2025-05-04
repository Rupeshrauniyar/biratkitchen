import React, {createContext, useState, useEffect} from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "../axios";
export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
  const [user, setUser] = useState(localStorage.getItem("user") ? localStorage.getItem("user") || {} : null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [vegMode, setVegMode] = useState(localStorage.getItem("vegMode") === "true");

  const checkUser = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/user/check`);
      if (response.data.status === "OK" && response.data.user) {
        setUser(response.data.user);
        setCart(response.data.user.cart);
        const newUser = {
          createdAt: response.data.user.createdAt,
          email: response.data.user.email,
          full_name: response.data.user.full_name,
          ph_num: response.data.user.ph_num,
          __v: response.data.user.__v,
          _id: response.data.user._id,
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        setIsLoading(false);
      } else {
        localStorage.clear("user");
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      localStorage.clear("user");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      checkUser();
    } catch (err) {
      // console.log(err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vegMode", vegMode);
  }, [vegMode]);

  return <AppContext.Provider value={{cart, setCart, checkUser, user, setUser, isLoading, setIsLoading, vegMode, setVegMode}}>{children}</AppContext.Provider>;
};
