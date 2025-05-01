import React, {useState, useEffect, useContext} from "react";
import axios from "../axios";
import Loader from "../components/Loader";
import {Cross, Pen, Trash2, Plus, Search, RefreshCw, Grid, List, SlidersHorizontal} from "lucide-react";
import EditProduct from "./EditProduct";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";

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

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [open, setOpen] = useState(location?.search === "?setOpen=true" ? true : false);
  const [selectedEditProduct, setSelectedEditProduct] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Normal", "Biryani", "Gravy", "Fried", "Dessert", "Drink"];

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendURL}/api/products/get`);
      if (response.data.status === "OK" && response.data.products.length > 0) {
        setProducts(response.data.products);
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
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    setOpen(location?.search === "?setOpen=true" ? true : false);
  }, [location]);

  const handleDelete = async (productId) => {
    try {
      setIsDeleting(productId);
      setDeleteLoading(true);
      if (productId) {
        const response = await axios.post(
          `${backendURL}/api/admin/product/delete`,
          {
            id: productId,
          },
      
        );

        if (response.data.status === "OK" && response.data.success === "true") {
          const filteredProducts = products.filter((product) => product._id !== productId);
          setProducts(filteredProducts);
          toast.success("Product deleted successfully");
        }
      }
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setIsDeleting(null);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getProducts();
  };

  const handleEdit = (productId) => {
    if (productId) {
      navigate("?setOpen=true");
      const selectedProduct = products.find((product) => product._id === productId);
      setSelectedEditProduct(selectedProduct);
    }
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Products</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            disabled={refreshing}>
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div className="relative w-full sm:w-auto flex-1">
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
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-1 mb-4">
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

      <div className="w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={product.image}
                      alt={product.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 w-full p-4">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(product._id)}
                            className="p-2 bg-white/90 text-blue-600 rounded-full transition-colors hover:bg-blue-600 hover:text-white"
                            disabled={editLoading}>
                            <Pen className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 bg-white/90 text-red-600 rounded-full transition-colors hover:bg-red-600 hover:text-white"
                            disabled={deleteLoading || isDeleting === product._id}>
                            {isDeleting === product._id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-semibold text-gray-800 flex-1 truncate">{product.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full ml-2">{product.type}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-medium">₹ {product.price}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{product.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th
                      scope="col"
                      className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
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
                          <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                            <img
                              className="h-10 w-10 object-cover"
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
                        <div className="text-sm text-gray-900">{product.category}</div>
                        <div className="text-xs text-gray-500">{product.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">₹ {product.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(product._id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            disabled={editLoading}>
                            <Pen className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            disabled={deleteLoading || isDeleting === product._id}>
                            {isDeleting === product._id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-center max-w-md">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                  <Search className="w-10 h-10" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm || selectedCategory !== "All" ? "No matching products found" : "No products yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory !== "All"
                  ? `We couldn't find any products matching your criteria. Try adjusting your filters.`
                  : "Get started by adding your first product to your inventory."}
              </p>
              {searchTerm || selectedCategory !== "All" ? (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all">
                    Clear Filters
                  </button>
                  <button
                    onClick={() => navigate("/create")}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-900 transition-all shadow-sm hover:shadow-md">
                    Add Product
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/create")}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-900 transition-all shadow-sm hover:shadow-md">
                  Add Your First Product
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10" />
          <EditProduct product={selectedEditProduct} />
        </>
      )}
    </div>
  );
};

export default Products;
