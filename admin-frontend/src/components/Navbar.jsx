import React, {useState, useEffect, useContext} from "react";
import {Link, NavLink, useLocation} from "react-router-dom";
import {Home, PlusCircle, User, LogOut, Settings, ClipboardList, FileText} from "lucide-react";
import {AppContext} from "../contexts/AppContext";
const Navbar = () => {
  const {user} = useContext(AppContext);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("/");

  useEffect(() => {
    setActiveTab(location.pathname === "/bookings/other" ? "/bookings" : location.pathname === "/bookings/history" ? "/bookings" : location.pathname);
  }, [location]);

  const navLinks = [
    {
      path: "/",
      name: "Home",
      icon: Home,
    },

    {
      path: "/products",
      name: "Menu",
      icon: ClipboardList,
    },
    {
      path: "/create",
      name: "Create",
      icon: PlusCircle,
    },
    {
      path: "/profile",
      name: "Profile",
      icon: User,
    },
    {
      path: "/dashboard",
      name: "Record",
      icon: FileText,
    },
  ];

  return (
    <>
      {user && user._id ? (
        <>
          {/* Normal Desktop Sidebar */}
          <div className="hidden lg:block fixed left-0 top-0 h-full w-[20%] dark:bg-zinc-900 dark:text-white text-black bg-white shadow-md z-40 pt-16">
            <div className="flex flex-col h-full p-4">
              {navLinks.map((navLink, index) => (
                <NavLink
                  key={index}
                  to={navLink.path}
                  className={({isActive}) => `
                 flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200
                 ${
                   isActive
                     ? "dark:bg-zinc-800 bg-black text-white dark:text-white dark:hover:bg-zinc-700 hover:bg-zinc-900"
                     : "dark:text-gray-200 text-gray-700 dark:hover:bg-zinc-800 hover:bg-gray-100"
                 }
               `}>
                  <navLink.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{navLink.name}</span>
                </NavLink>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Settings Link */}
              <NavLink
                to="/settings"
                className={({isActive}) => `
               flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200
               ${
                 isActive
                   ? "dark:bg-zinc-800 bg-black text-white dark:text-white dark:hover:bg-zinc-700 hover:bg-zinc-900"
                   : "dark:text-gray-200 text-gray-700 dark:hover:bg-zinc-800 hover:bg-gray-100"
               }
             `}>
                <Settings className="w-5 h-5 mr-3" />
                <span className="font-medium">Settings</span>
              </NavLink>
            </div>
          </div>

          {/* Normal Mobile Bottom Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 dark:bg-zinc-900 dark:text-white text-black bg-white z-40">
            <div className="flex justify-around items-center h-16 px-2">
              {navLinks.map((navLink, index) => (
                <Link
                  key={index}
                  to={navLink.path}
                  className="flex flex-col items-center justify-center w-[80px]">
                  <div
                    className={`
                   flex flex-col items-center justify-center px-4 py-2 rounded-md transition-all duration-200 relative
                   ${activeTab === navLink.path ? "text-black bg-black" : "text-gray-500"}
                 `}>
                    <navLink.icon
                      className={`
                   w-5 h-5 transition-all duration-200
                   ${activeTab === navLink.path ? "scale-110 text-white" : "scale-100"}
                 `}
                    />
                    <span className={`text-xs font-medium ${activeTab === navLink.path ? "text-white" : "text-gray-500"}`}>{navLink.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Navbar;
