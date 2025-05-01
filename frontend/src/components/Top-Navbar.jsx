import React, {useContext, useState} from "react";
import {AppContext} from "../contexts/AppContext";
import {Link} from "react-router-dom";
import {Search, Menu, Bell, User, LogOut, Settings} from "lucide-react";

const TopNavbar = () => {
  const {user} = useContext(AppContext);

  return (
    <>
      <div className="fixed top-0 left-0 w-full dark:bg-zinc-900 dark:text-white text-black bg-white z-[999] shadow-md rounded-b-2xl">
        <div className="max-w-full ">
          <div className="flex items-center justify-between py-3 xl:px-6 sm:px-2 p-2">
            {/* Left side - User info */}
            <div className="flex items-center  ">
              <div className="relative ">
                {user && user._id  ? (
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
              {/* <Link
            to="/search"
            className="flex items-center justify-center w-10 h-10 dark:bg-zinc-800 dark:text-white dark:hover:bg-gray-700 bg-gray-100 text-gray-700 rounded-full  hover:bg-gray-200 transition-colors duration-200">
            <Search className="w-5 h-5 " />
          </Link> */}

              <Link
                to={"/settings"}
                className="dark:bg-zinc-800 dark:text-white dark:hover:bg-gray-700 bg-gray-100 text-gray-700 flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200">
                <Menu className="w-5 h-5 " />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding behind the navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default TopNavbar;
