import React, {useState, useEffect, useContext} from "react";
import axios from "../axios";
import {toast} from "react-hot-toast";
import {Clock, Package, TruckIcon, CheckCircle, DollarSign, ChevronRight, Search, RefreshCw, Filter, X, Calendar, Eye} from "lucide-react";
import {AppContext} from "../contexts/AppContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import LoaderComp from "../components/Loader";
import {Link, useNavigate} from "react-router-dom";
import Table from "../components/Table";

const OrderStatusBadge = ({status}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return {color: "bg-green-100  rounded-md text-green-800", icon: <CheckCircle className="w-4 h-4 mr-1" />};
      case "processing":
        return {color: "bg-blue-100  rounded-md text-blue-800", icon: <Clock className="w-4 h-4 mr-1" />};
      case "delivering":
        return {color: "bg-yellow-100  rounded-md text-yellow-800", icon: <TruckIcon className="w-4 h-4 mr-1" />};
      case "pending":
      default:
        return {color: "bg-gray-100  rounded-md text-gray-800", icon: <Package className="w-4 h-4 mr-1" />};
    }
  };

  const {color, icon} = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium ${color}`}>
      {icon}
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
    </span>
  );
};

const Bookings = () => {
  const {selectedViewProduct, setSelectedViewProduct} = useContext(AppContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchorders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/user/order/get`);
      if (response.data?.orders?.length > 0) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err);
      toast.error("Failed to fetch orders");
      // console.log(err);
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

  // Format date to more readable form

  // Filter orders based on search term and status
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch = order?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || order?._id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen w-full h-full">
      <div className="w-full">
        <div className="overflow-hidden  mb-8">
          <div className="  border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Orders</h1>
                <p className="text-gray-500 mt-1">Track and manage all your orders</p>
              </div>

              <button
                onClick={handleRefresh}
                className="flex items-center rounded-md gap-2 px-4 py-2.5 bg-gray-800 text-white hover:bg-gray-700 transition-colors">
                <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="py-2">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or order ID..."
                  className="pl-10 w-full  rounded-md py-2.5 px-4 border border-gray-300 focus:outline-none focus:border-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 text-sm font-medium  rounded-md transition-all whitespace-nowrap
                    ${statusFilter === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  All Orders
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-4 py-2 text-sm  rounded-md font-medium transition-all whitespace-nowrap
                    ${statusFilter === "pending" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter("shipped")}
                  className={`px-4 py-2 text-sm  rounded-md font-medium transition-all whitespace-nowrap
                    ${statusFilter === "shipped" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  Shipped
                </button>
                <button
                  onClick={() => setStatusFilter("delivered")}
                  className={`px-4 py-2 text-sm  rounded-md font-medium transition-all whitespace-nowrap
                    ${statusFilter === "delivered" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  Delivered
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64  ">
                <div className="flex flex-col items-center ">
                  <div className="animate-spin h-12 w-12 border-b-2 border-black mb-3 rounded-full"></div>
                  <p className="text-gray-600">Loading your orders...</p>
                </div>
              </div>
            ) : filteredOrders.length > 0 ? (
              <Table filteredOrders={filteredOrders} />
            ) : (
              <div className="bg-white border border-gray-200 text-center py-16 px-4">
                <div className="mx-auto h-20 w-20 bg-gray-100 flex items-center justify-center mb-6">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== "all" ? "No matching orders found" : "No orders yet"}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? `We couldn't find any orders matching your current filters. Try adjusting your search or filter criteria.`
                    : "When you place orders, they will appear here. Start ordering delicious food now!"}
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none">
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
