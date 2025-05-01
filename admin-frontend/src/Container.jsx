import React, {lazy, Suspense, useEffect} from "react";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import AdminMiddleware from "./middlewares/Admin-middleware.jsx";
import View from "./pages/View.jsx";
import {useNavigate, useLocation, BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {App} from "@capacitor/app";
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Create = lazy(() => import("./pages/Create"));
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
      <Route element={<AdminMiddleware />}>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/create"
          element={<Create />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />
        <Route
          path="/view/:id"
          element={<View />}
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
