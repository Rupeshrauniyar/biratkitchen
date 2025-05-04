import React, {lazy, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, useNavigate, useLocation} from "react-router-dom";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import View from "./pages/View";
import UserMiddleware from "./middlewares/User-middleware";
import {App} from "@capacitor/app";
const Home = lazy(() => import("./pages/Home"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Profile = lazy(() => import("./pages/Profile"));
const Cart = lazy(() => import("./pages/Cart"));
const Records = lazy(() => import("./pages/Records"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const Container = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = () => {
      if (location.pathname === "/") {
        App.exitApp();
      } else {
        navigate(-1);
      }
    };

    App.addListener("backButton", handleBackButton);

    return () => {
      App.removeAllListeners();
    };
  }, [navigate, location]);

  return (
    <Routes>
      <Route element={<UserMiddleware />}>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />
        <Route
          path="/place-order"
          element={<PlaceOrder />}
        />

        <Route
          path="/bookings"
          element={<Bookings />}
        />

        <Route
          path="/records"
          element={<Records />}
        />
        <Route
          path="/view/:id"
          element={<View />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />
      </Route>

      <Route
        path="/signin"
        element={<Signin />}
      />
      <Route
        path="/signup"
        element={<Signup />}
      />
    </Routes>
  );
};

export default Container;
