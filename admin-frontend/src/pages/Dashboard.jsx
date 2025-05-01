import React, {useState, useEffect} from "react";
import axios from "../axios";

import {toast} from "react-hot-toast";
import {Clock, Package, TruckIcon, CheckCircle, DollarSign, ShoppingBag, ChevronRight, Search, RefreshCw, ArrowUp, BarChart3} from "lucide-react";
import Loader from "../components/Loader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StatCard = ({icon, title, value, bgColor, textColor}) => (
  <div className={`${bgColor} p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className={`text-2xl font-bold ${textColor} mt-1`}>{value}</h3>
      </div>
      <div className={`${textColor} p-3 rounded-full bg-white/10`}>{icon}</div>
    </div>
  </div>
);

const OrderStatusBadge = ({status}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return {color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-4 h-4 mr-1" />};
      case "processing":
        return {color: "bg-blue-100 text-blue-800", icon: <Clock className="w-4 h-4 mr-1" />};
      case "delivering":
        return {color: "bg-yellow-100 text-yellow-800", icon: <TruckIcon className="w-4 h-4 mr-1" />};
      case "pending":
      default:
        return {color: "bg-gray-100 text-gray-800", icon: <Package className="w-4 h-4 mr-1" />};
    }
  };

  const {color, icon} = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full ${color}`}>
      {icon}
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
    </span>
  );
};

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchorders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/order`);
      if (response.data.orders) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchorders();
  };

  useEffect(() => {
    fetchorders();
  }, []);

  // Stats for dashboard
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const processingOrders = orders.filter((order) => order.status === "processing").length;
  const deliveringOrders = orders.filter((order) => order.status === "delivering").length;
  const completedOrders = orders.filter((order) => order.status === "completed").length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalOrderPrice || 0), 0);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full h-full p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to your admin dashboard</p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors self-start"
          disabled={refreshing}>
          <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          <span className="font-medium">Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<ShoppingBag className="w-6 h-6" />}
              title="Total Orders"
              value={totalOrders}
              bgColor="bg-gradient-to-r from-blue-50 to-blue-100"
              textColor="text-blue-600"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              title="Pending"
              value={pendingOrders}
              bgColor="bg-gradient-to-r from-yellow-50 to-yellow-100"
              textColor="text-yellow-600"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="Completed"
              value={completedOrders}
              bgColor="bg-gradient-to-r from-green-50 to-green-100"
              textColor="text-green-600"
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Revenue"
              value={`₹${totalRevenue}`}
              bgColor="bg-gradient-to-r from-purple-50 to-purple-100"
              textColor="text-purple-600"
            />
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
              <div className="text-sm text-gray-500">{orders.length} total orders</div>
            </div>

            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((order, index) => (
                      <tr
                        key={order._id || index}
                        className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">#{order._id?.substring(0, 8)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.full_name}</div>
                          <div className="text-sm text-gray-500">{order.ph_num}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">₹{order.totalOrderPrice}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                  <Package className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">You haven't received any orders yet. When customers place orders, they will appear here.</p>
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Order Status Summary</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Pending</span>
                    <span className="text-sm font-medium text-gray-900">{pendingOrders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{width: `${totalOrders ? (pendingOrders / totalOrders) * 100 : 0}%`}}></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Processing</span>
                    <span className="text-sm font-medium text-gray-900">{processingOrders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{width: `${totalOrders ? (processingOrders / totalOrders) * 100 : 0}%`}}></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Delivering</span>
                    <span className="text-sm font-medium text-gray-900">{deliveringOrders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-orange-500 h-2.5 rounded-full"
                      style={{width: `${totalOrders ? (deliveringOrders / totalOrders) * 100 : 0}%`}}></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Completed</span>
                    <span className="text-sm font-medium text-gray-900">{completedOrders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{width: `${totalOrders ? (completedOrders / totalOrders) * 100 : 0}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
