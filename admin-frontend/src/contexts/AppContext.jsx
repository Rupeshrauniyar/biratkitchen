import React, {createContext, useState, useEffect} from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "../axios";
export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkUser = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/check`);
      if (response.data.status === "OK" && response.data.admin) {
        setUser(response.data.admin);
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
        setIsLoading(false);
      } else {
        setUser([]);
        localStorage.clear("admin");
        setIsLoading(false);
      }
    } catch (err) {
      setUser([]);

      localStorage.clear("admin");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      checkUser();
    } catch (err) {
      setUser([]);

      setIsLoading(false);
    }
  }, []);

  return (
    <AppContext.Provider value={{isLoggedIn, checkUser, setIsLoggedIn, user, setUser, isAdmin, setIsAdmin, isLoading, setIsLoading, error, setError}}>
      {children}
    </AppContext.Provider>
  );
};
