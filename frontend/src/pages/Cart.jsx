import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import Loader from "../components/Loader";
import {Minus, Plus, Search, ShoppingCart, ShoppingBag, Package, X, CreditCard, ChevronRight, ArrowRight} from "lucide-react";
import {AppContext} from "../contexts/AppContext";
import {useNavigate, Link} from "react-router-dom";
import {toast} from "react-hot-toast";
import FoodCard from "../components/FoodCard";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const CategoryPill = ({category, isActive, onClick}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
      isActive ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}>
    {category}
  </button>
);

const Cart = (props) => {
  const {cart, user, setUser, vegMode} = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [AddToCartLoading, setAddToCartLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Normal", "Biryani", "Gravy", "Fried", "Dessert", "Drink"];

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 20 : 0; // Example delivery fee
  const total = subtotal + deliveryFee;

  // Filter products based on search term and category
  const filteredProducts = cart?.filter((cartItem) => {
    const matchesSearch =
      cartItem.product.name.toLowerCase().includes(searchTerm.toLowerCase()) || cartItem.product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || cartItem.product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (!AddToCartLoading) {
      setAddToCartLoading(true);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [AddToCartLoading]);

  return (
    <div className="min-h-screen ">
      <div className="">
        {/* {console.log(user)} */}
        <div className="overflow-hidden transition-all duration-300 mb-20">
          <div className=" md:p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 text-gray-700 rounded-full">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Cart</h1>
                  <p className="text-gray-500 mt-1">
                    {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
                  </p>
                </div>
              </div>

              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                Continue Shopping
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Categories and Search */}
          <div className=" ">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="overflow-x-auto py-2">
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <CategoryPill
                      key={category}
                      category={category}
                      isActive={selectedCategory === category}
                      onClick={() => setSelectedCategory(category)}
                    />
                  ))}
                </div>
              </div>

              <div className="relative md:ml-auto md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search items..."
                  className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
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
            </div>
          </div>

          {/* Cart Items */}
          <div className="py-2">
            <div className="w-full">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin h-12 w-12 border-b-2 border-black mb-3"></div>
                    <p className="text-gray-600">Loading your cart...</p>
                  </div>
                </div>
              ) : user?.cart?.length > 0 ? (
                filteredProducts && filteredProducts.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {/* Item Cards */}
                      {filteredProducts.map((cartItem, i) => (
                        <FoodCard
                          key={i}
                          product={cartItem.product}
                          doMb={false}
                        />
                      ))}

                      {/* Order Summary */}
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-6 mt-4 rounded-lg mb-10">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Order Summary</h3>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-800 font-medium">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span className="text-gray-800 font-medium">₹{deliveryFee}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between">
                          <span className="text-gray-800 font-semibold">Total</span>
                          <span className="text-xl font-bold text-gray-800">₹{total}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate("/place-order")}
                        className="w-full mt-6 bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center font-medium">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-lg">
                    <div className="text-center max-w-md">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gray-100 text-gray-600 rounded-full">
                          <Search className="w-10 h-10" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching items found</h3>
                      <p className="text-gray-500 mb-6">We couldn't find any items matching your filters. Try adjusting your search criteria.</p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("All");
                        }}
                        className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-lg">
                  <div className="text-center max-w-md">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-gray-100 text-gray-600 rounded-full">
                        <ShoppingBag className="w-12 h-12" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">Your cart is empty</h3>
                    <p className="text-gray-500 mb-8">
                      Looks like you haven't added anything to your cart yet. Explore our delicious menu to find something you'll love!
                    </p>
                    <Link
                      to="/"
                      className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center">
                      Browse Menu
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed lg:w-[80%] w-full right-0 lg:bottom-0 bottom-18   flex justify-center z-30">
          <div className="m-4 w-full max-w-3xl bg-white rounded-md border border-gray-200 shadow-lg flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-lg font-bold ml-2">₹{total}</div>
            </div>
            <Link
              to="/place-order"
              className="px-5 py-2.5 bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center font-medium rounded-lg">
              Checkout
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
