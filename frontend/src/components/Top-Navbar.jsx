import React, {useContext, useState} from "react";
import {AppContext} from "../contexts/AppContext";
import {Link} from "react-router-dom";
import {Search, Menu, Bell, User, LogOut, Settings, Leaf} from "lucide-react";

const TopNavbar = () => {
  const {user, vegMode, setVegMode,isLoading} = useContext(AppContext);

  const toggleVegMode = () => {
    // console.log("checked");
    setVegMode((prev) => !prev);
  };

  return (
    <>
      {user ? (
        <>
          <div className="fixed top-0 left-0 w-full dark:bg-zinc-900 dark:text-white text-black bg-white z-[999] shadow-md rounded-b-2xl">
            <div className="max-w-full ">
              <div className="flex items-center justify-between py-3 xl:px-6 sm:px-2 p-2">
                {/* Left side - User info */}
                <div className="flex items-center  ">
                  <div className="relative ">
                    {user && user._id ? (
                      <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-700 text-zinc-200  rounded-full flex items-center justify-center font-bold shadow-md">
                        {user?.full_name?.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <></>
                    )}
                    {user && user._id ? (
                      <>
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="flex flex-col">
                    {user && user._id ? (
                      <>
                        <p className="font-medium dark:text-zinc-200 text-gray-800 ml-1">{user.full_name}</p>
                      </>
                    ) : (
                      <Link to="/signup">
                        <button className="font-medium text-white bg-black   px-4 py-2 rounded-full">Signup</button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center space-x-4">
                  {/* Veg Mode Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <h5 className="text-green-500 mr-1 text-sm">Veg Mode</h5>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="vegMode"
                          className="sr-only"
                          checked={vegMode}
                          onChange={toggleVegMode}
                        />
                        <label htmlFor="vegMode">
                          <div
                            className={`w-11 h-6 bg-gray-200 rounded-full after:absolute after:top-[2px] ${
                              vegMode ? "after:left-[22px] bg-green-500" : "after:left-[2px]"
                            } after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all `}></div>
                        </label>
                      </div>
                      {/* <Leaf className={`w-4 h-4 ml-1.5 ${vegMode ? "text-green-500" : "text-gray-500"}`} /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer to prevent content from hiding behind the navbar */}
          <div className="h-16"></div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default TopNavbar;
