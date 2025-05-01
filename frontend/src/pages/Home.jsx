import React, {useState, useEffect, useContext} from "react";
import axios from "../axios";
import Loader from "../components/Loader";
import {Minus, Plus, Search, RefreshCw, Grid, List, ShoppingBag, Filter, Tag, ChevronRight, X} from "lucide-react";
import {AppContext} from "../contexts/AppContext";
import {useNavigate, Link} from "react-router-dom";
import {toast} from "react-hot-toast";
import FoodCard from "../components/FoodCard";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const CategoryPill = ({category, isActive, onClick}) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
      isActive ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}>
    {category}
  </button>
);

const Home = () => {
  const {cart, setCart} = useContext(AppContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [AddToCartLoading, setAddToCartLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Normal", "Biryani", "Gravy", "Fried", "Dessert", "Drink"];
  const [isUpdatable, setIsUpdatable] = useState(false);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendURL}/api/products/get`,);
      if (response.data.status === "OK" && response.data.products.length > 0) {
        setProducts(response.data.products);
        setCart((prev) => {
          return prev.map((prevProduct) => {
            const updatedProduct = response.data.products.find((item) => item._id === prevProduct.product._id);
            if (updatedProduct) {
              return {
                product: updatedProduct,
                quantity: prevProduct.quantity,
              };
            } else {
              return prevProduct;
            }
          });
        });
      } else {
        setProducts([]);
        toast.error("No products found");
      }
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsUpdatable(true);
    }
  };

  useEffect(() => {
    if (isUpdatable) {
      localStorage.setItem("cart", JSON.stringify(cart));
      setIsUpdatable(false);
    }
  }, [isUpdatable]);

  useEffect(() => {
    getProducts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getProducts();
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    const Data = {
      product,
      quantity: 1,
    };
    setCart((prev) => [...prev, Data]);
    toast.success(`${product.name} added to cart`);
    setAddToCartLoading(false);
  };

  const handleIncrQuantity = (product) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) => (item.product._id === product._id ? {...item, quantity: item.quantity + 1} : item));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleDecrQuantity = (product) => {
    setCart((prev) => {
      let updatedCart = prev.map((item, i) => (item.product._id === product._id ? {...item, quantity: item.quantity - 1} : item));
      updatedCart = updatedCart.filter((item) => item.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  useEffect(() => {
    if (!AddToCartLoading) {
      setAddToCartLoading(true);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [AddToCartLoading]);

  // Calculate cart totals
  const cartTotal = cart?.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="w-full h-full">
      {/* {console.log("p", products)} */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">Our Menu</h1>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            disabled={refreshing}>
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 transition-colors flex items-center rounded-md ${
              viewMode === "grid" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            <Grid className="w-5 h-5 mr-1.5" />
            <span className="text-sm font-medium">Grid</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 transition-colors flex items-center rounded-md ${
              viewMode === "list" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            <List className="w-5 h-5 mr-1.5" />
            <span className="text-sm font-medium">List</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
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

      <div className="overflow-x-auto pb-2 mb-6">
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

      <div className="w-full mb-20">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-64">
              {filteredProducts.map((product, i) => (
                <FoodCard
                  product={product}
                  doMb={true}
                  key={i}
                />
              ))}
            </div>
          ) : (
            <div className="border border-gray-200 overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 rounded-t-lg">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 overflow-hidden rounded-lg">
                              <img
                                className="h-12 w-12 object-cover"
                                src={product.image}
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">₹{product.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {cart && cart.some((cartItem) => cartItem.product._id === product._id) ? (
                            <div className="flex items-center justify-end rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleDecrQuantity(product)}
                                className="p-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-l-lg">
                                <Minus className="w-4 h-4" />
                              </button>
                              <div className="px-3 py-1 bg-gray-50 font-medium text-sm">
                                {cart.find((item) => item.product._id === product._id)?.quantity || 0}
                              </div>
                              <button
                                onClick={() => handleIncrQuantity(product)}
                                className="p-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-r-lg">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="px-3 py-1.5 bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm font-medium rounded-lg">
                              Add to Cart
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border border-gray-200">
            <div className="text-center max-w-md">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-gray-100 text-gray-600 rounded-full">
                  <Search className="w-10 h-10" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm || selectedCategory !== "All" ? "No matching items found" : "No items available"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory !== "All"
                  ? `We couldn't find any items matching your criteria. Try adjusting your filters.`
                  : "Our menu items will appear here once they're available."}
              </p>
              {(searchTerm || selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="px-5 py-2.5 bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm font-medium rounded-lg">
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cart Summary Bar */}
      {cart.length > 0 && (
        <div className="fixed lg:w-[80%] w-full right-0 lg:bottom-0 bottom-18   flex justify-center z-30">
          <div className="m-4 w-full max-w-3xl bg-white rounded-md border border-gray-200 shadow-lg flex items-center justify-between p-4">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                <span className="font-medium flex items-center">
                  {cart.length} item{cart.length !== 1 ? "s" : ""}
                  <div className="text-lg font-bold ml-1">₹{cartTotal}</div>
                </span>
              </div>
            </div>
            <Link
              to="/cart"
              className="px-5 py-2.5 bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center font-medium rounded-lg">
              View Cart
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
