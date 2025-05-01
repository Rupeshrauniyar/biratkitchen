import React, {useState, useContext, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {AppContext} from "../contexts/AppContext";
import toast from "react-hot-toast";
import axios from "../axios";
import {CheckCircle, Clock, TruckIcon, Package, ChevronLeft, Phone, MapPin, CreditCard, ShoppingBag, Calendar, RefreshCw, Loader2} from "lucide-react";
import Loader from "../components/Loader";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
    <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${color}`}>
      {icon}
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
    </span>
  );
};

const View = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setsaveLoading] = useState(false);

  //   const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [Status, setStatus] = useState(orders?.status);

  const query = useParams();

  const fetchorders = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/user/order/get`, {params: {id: query.id}});
      if (response.data?.orders._id) {
        setOrders(response.data.orders);
      } else {
        setOrders({});
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

  const handleOptionChange = (e) => {
    if (orders.status !== e) {
      setStatus(e);
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };
  const handleSave = async () => {
    try {
      setsaveLoading(true);
      const Data = {
        id: orders._id,
        status: Status,
      };
      const response = await axios.post(`${BACKEND_URL}/api/admin/order/edit-status`, Data);
      if (response.data.success === "true") {
        setOrders((prev) => ({
          ...prev,
          status: Status,
        }));
        toast.success("Status updated successfully.");
        setIsChanged(false);
      } else {
        // setOrders({});
      }
    } catch (err) {
      setError(err);
      toast.error("Failed to edit status");
    } finally {
      setsaveLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchorders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section with Back Button and Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors group rounded-full  py-2 hover:bg-gray-100 self-start">
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Orders</span>
          </Link>
        </div>
        {/* Ordered Items Column */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex  items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                Ordered Items
                <span className="ml-2 text-sm font-normal text-gray-500">({orders?.foodDetails?.length || 0} items)</span>
              </h2>
              <select
                value={Status ? Status : orders?.status}
                className="p-2 border border-2 border-black rounded-md"
                onChange={(e) => handleOptionChange(e.target.value)}>
                <option
                  className="capitalize"
                  value={orders?.status}>
                  {orders?.status}
                </option>
                {orders?.status === "pending" ? (
                  <>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancel</option>
                  </>
                ) : orders?.status === "shipped" ? (
                  <>
                    <option value="pending">Pending</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancel</option>
                  </>
                ) : orders?.status === "delivered" ? (
                  <>
                    <option value="pending">Pending</option>
                    <option value="shipped">shipped</option>
                    <option value="cancelled">cancel</option>
                  </>
                ) : (
                  <>
                    <option value="pending">Pending</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                  </>
                )}
              </select>
              {isChanged ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="ml-1 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white dark:bg-zinc-900 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {saveLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="w-5 h-5 animate-spin " />
                      </div>
                    ) : (
                      "Save"
                    )}
                  </button>
                </>
              ) : (
                <></>
              )}
              {}
            </div>

            <div className="divide-y divide-gray-100">
              {orders?.foodDetails?.map((item, index) => (
                <div
                  key={item._id || index}
                  className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 ">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-full h-[180px] object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{item.product?.name}</h3>
                      <p className="text-gray-500 text-sm my-2 truncate">{item.product?.description}</p>

                      <hr className="my-3 border-gray-100 rounded-full" />

                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div className="min-w-0">
                          <span className="text-xs text-gray-500">Price</span>
                          <p className="text-gray-800 font-medium">₹{item.product?.price}</p>
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs text-gray-500">Quantity</span>
                          <p className="text-gray-800 font-medium">{item.quantity}</p>
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs text-gray-500">Total</span>
                          <p className="text-gray-800 font-bold">₹{item.productTotalPrice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Order Summary & Customer Details Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Order Summary Section */}
            <div className="bg-gray-50 p-6 border border-gray-100 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{orders?.totalOrderPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Charges:</span>
                  <span className="font-medium">₹{orders?.deliveryCharges}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-gray-800">₹{orders?.totalOrderPrice + orders?.deliveryCharges}</span>
                </div>
              </div>
            </div>

            {/* Customer Details Section */}
            <div className="bg-gray-50 p-6 border border-gray-100 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Customer Details</h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-gray-800 font-medium text-sm truncate">{orders?._id}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="text-gray-800 font-medium">{orders?.full_name}</p>
                    <p className="text-gray-600 text-sm">{orders?.ph_num}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="text-gray-800">{orders?.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="text-gray-800 font-medium">{orders?.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="text-gray-800">{new Date(orders?.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
