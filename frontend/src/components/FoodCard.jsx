import React, {useState, useEffect, useContext} from "react";
import axios from "../axios";
import Loader from "../components/Loader";
import {Minus, Plus, Search, RefreshCw, Grid, List, ShoppingBag, Filter, Tag, ChevronRight, X, Trash} from "lucide-react";
import {AppContext} from "../contexts/AppContext";
import {useNavigate, Link} from "react-router-dom";
import {toast} from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const FoodCard = (props) => {
  const {cart, setCart, user, setUser} = useContext(AppContext);

  const [AddToCartLoading, setAddToCartLoading] = useState(true);

  const handleAddToCart = (product) => {
    const Data = {
      product,
      quantity: 1,
    };
    setCart((prev) => [...prev, Data]);

    toast.success(`${props.product.name} added to cart`);
    setAddToCartLoading(false);
  };

  const handleIncrQuantity = (product) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) => (item.product._id === product._id ? {...item, quantity: item.quantity + 1} : item));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    setAddToCartLoading(false);
  };

  const handleDecrQuantity = (product) => {
    setCart((prev) => {
      let updatedCart = prev.map((item, i) => (item.product._id === product._id ? {...item, quantity: item.quantity - 1} : item));
      updatedCart = updatedCart.filter((item) => item.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    setAddToCartLoading(false);
  };

  const removeFromCart = (product) => {
    setCart((prev) => {
      const filteredProduct = prev.filter((item) => item.product._id !== product._id);
      // toast.success(`${product.name} removed from cart`);
      return filteredProduct;
    });
    setAddToCartLoading(false);
  };
  const updateCartInDB = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/cart/update`, cart);
      if (response.data.success) {
        // toast.success(`product added to cart in database.`);
      }
    } catch (err) {
      // console.log("err", err);
      // toast.error(`unable to add product to cart in database.`);
    }
  };
  useEffect(() => {
    if (!AddToCartLoading) {
      if (user && user._id) {
        updateCartInDB();
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setUser((prev) => ({...prev, cart: cart}));
      setAddToCartLoading(true);
    }
  }, [AddToCartLoading]);

  return (
    <div
      className={`bg-white ${
        props?.doMb ? "last-of-type:mb-0" : ""
      } rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}>
      <div className="relative h-48 overflow-hidden group">
        {/* {console.log("props", props)} */}
        <img
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          src={props.product.image}
          alt={props.product.name}
        />
        <div className="absolute top-3 right-3">
          <span className="text-xs px-2 py-1 bg-white/90 text-gray-800 font-medium rounded-full">{props.product.category}</span>
        </div>
      </div>
      <div className="p-4 rounded-b-lg">
        <h3 className="text-lg font-semibold text-gray-800">{props.product.name}</h3>
        <p className="text-gray-600 text-sm mt-1 mb-3 line-clamp-2">{props.product.description}</p>

        <div className="flex justify-between items-center mt-auto">
          <div className="text-gray-800 font-bold">₹{props.product.price}</div>

          {cart && cart.some((cartItem) => cartItem.product._id === props.product._id) ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-around rounded-lg overflow-hidden mb-2">
                <span></span>
                <span></span>

                <button
                  onClick={() => removeFromCart(props.product)}
                  className="p-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg ml-25">
                  <Trash className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center rounded-lg overflow-hidden">
                <button
                  onClick={() => handleDecrQuantity(props.product)}
                  className="p-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-l-lg">
                  <Minus className="w-6 h-6" />
                </button>
                <div className="px-6 py-1 bg-gray-50 font-medium text-xl text-pink-600">
                  {cart.find((item) => item.product._id === props.product._id)?.quantity || 0}
                </div>
                <button
                  onClick={() => handleIncrQuantity(props.product)}
                  className="p-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-r-lg">
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleAddToCart(props.product)}
              className="px-3 py-1.5 bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm font-medium rounded-lg">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
