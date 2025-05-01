import React, { useEffect} from "react";
import {AppContextProvider} from "./contexts/AppContext";
import {Toaster} from "react-hot-toast";
import {SplashScreen} from "@capacitor/splash-screen";


import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import {HashRouter as Router, Routes, Route} from "react-router-dom";

import TopNavbar from "./components/Top-Navbar";
import Navbar from "./components/Navbar";

import Container from "./Container";
const App = () => {
  useEffect(() => {
    // Hide the splash screen after the app is fully loaded
    const hideSplash = async () => {
      try {
        // Show the splash screen if not already visible
        await SplashScreen.show({
          showDuration: 3000,
          autoHide: true,
        });
      } catch (error) {
        console.error("Error with splash screen:", error);
      }
    };

    hideSplash();
  }, []);

  return (
    <div className=" text-black dark:bg-black dark:text-zinc-50 w-full h-screen">
      <Router>
        <AppContextProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                style: {
                  background: "#10B981",
                  color: "#fff",
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: "#EF4444",
                  color: "#fff",
                },
              },
            }}
          />
          <div className="sm:w-full ">
            <TopNavbar />
            <Navbar />
          </div>
          <div className="lg:w-[80%] sm:w-full lg:ml-[20%] sm:ml-0 p-2 overflow-x-hidden lg:h-[91%] h-[85%]">
            <Container />

            
          </div>
        </AppContextProvider>
      </Router>
    </div>
  );
};

export default App;
