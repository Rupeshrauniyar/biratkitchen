import React, {useState, useEffect} from "react";
import axios from "../axios";
import {toast} from "react-hot-toast";
import {Clock, Package, TruckIcon, CheckCircle, DollarSign, Users, ShoppingBag, ChevronRight, Search, FilterIcon, RefreshCw} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import LoaderComp from "../components/Loader";
import Table from "../components/Table";

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
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
    </span>
  );
};

const Records = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchorders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/user/order/get`,);
      // console.log(response);
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

  // Filter orders based on search term
  const filteredOrders = orders?.filter(
    (order) => order.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || order.ph_num?.includes(searchTerm.toLowerCase())
    // order.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full ">
      {/* {console.log(orders)} */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Your records</h2>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="relative w-full mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search orders by customer name, email or order ID..."
          className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoaderComp />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className=" rounded-xl border border-gray-200 overflow-x-auto">
          <Table filteredOrders={filteredOrders} />
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto h-16 w-16 bg-gray-100 flex items-center justify-center rounded-full mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{searchTerm ? "No matching orders found" : "No orders yet"}</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {searchTerm
              ? `We couldn't find any orders matching "${searchTerm}". Try a different search term.`
              : "When customers place orders, they will appear here."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Records;
