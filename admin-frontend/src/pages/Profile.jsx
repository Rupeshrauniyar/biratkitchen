import React, {useContext} from "react";
import {AppContext} from "../contexts/AppContext";
import {Link} from "react-router-dom";
import {User, Mail, Phone, MapPin, Clock, CheckCircle, XCircle, History, LogOut, Settings, Pen} from "lucide-react";

const Profile = () => {
  const {user, CheckUser} = useContext(AppContext);

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // // Calculate order statistics
  // const totalOrders = user.orders?.length || 0;
  // const pendingOrders = user.orders?.filter((order) => order.status === "pending").length || 0;
  // const completedOrders = user.orders?.filter((order) => order.status === "accepted").length || 0;
  // const cancelledOrders = user.orders?.filter((order) => order.status === "rejected").length || 0;

  // const stats = [
  //   {label: "Total Orders", value: totalOrders, icon: Clock, color: "bg-blue-100 text-blue-600"},
  //   {label: "Pending", value: pendingOrders, icon: History, color: "bg-yellow-100 text-yellow-600"},
  //   {label: "Completed", value: completedOrders, icon: CheckCircle, color: "bg-green-100 text-green-600"},
  //   {label: "Cancelled", value: cancelledOrders, icon: XCircle, color: "bg-red-100 text-red-600"},
  // ];
  const handleRefresh = async () => {
    try {
      await CheckUser();
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  };
  return (
    <div className="w-full  dark:bg-black dark:text-white bg-gray-100 overflow-y-auto px-4 ">
      <div className="w-full h-full py-6 ">
        <div className="bg-white dark:bg-zinc-900  rounded-xl shadow-sm p-6 mb-6">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {user.full_name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-gray-500">Admin since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="hidden lg:block flex items-center space-x-4 mb-10">
              <Link to="edit-profile">
                <button className="w-full bg-black text-white hover:bg-gray-800 flex p-2 rounded-md items-center justify-center">
                  <Pen
                    size={20}
                    className="mr-2"
                  />
                  Edit profile
                </button>
              </Link>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-600 dark:text-white">
              <User size={20} />
              <span>{user.full_name}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 dark:text-white">
              <Mail size={20} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 dark:text-white">
              <Phone size={20} />
              <span>{user.ph_num}</span>
            </div>
          </div>
          <div className="xl:hidden sm:block flex items-center space-x-4 mt-2">
            <Link to="edit-profile">
              <button className="w-full bg-black text-white hover:bg-gray-800 flex p-2 rounded-md items-center justify-center">
                <Pen
                  size={20}
                  className="mr-2"
                />
                Edit profile
              </button>
            </Link>
          </div>
        </div>

        {/* Statistics Grid
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900  rounded-xl shadow-sm p-4">
              <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center mb-3`}>
                <stat.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div> */}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/settings">
            <button className="w-full bg-black text-white hover:bg-gray-800 flex p-2 rounded-md items-center justify-center">
              <Settings
                size={20}
                className="mr-2"
              />
              Settings
            </button>
          </Link>
          <Link to="/logout">
            <button
              variant="outline"
              className="w-full bg-black text-white hover:bg-gray-800 flex p-2 rounded-md items-center justify-center">
              <LogOut
                size={20}
                className="mr-2"
              />
              Logout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
