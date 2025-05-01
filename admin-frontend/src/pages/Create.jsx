import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "../axios";

import {toast} from "react-hot-toast";

const Create = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [formData, setFormData] = useState({
    name: "",
    type: "Veg",
    category: "Normal",
    price: "",
    description: "",
    image: null,
  });

  const categories = ["Normal", "Biryani", "Gravy", "Fried", "Dessert", "Drink"];

  const handleChange = (e) => {
    const {name, value, files} = e.target;
    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target.result;
      setImage(base64Image);
      setFormData((prev) => ({
        ...prev,
        image: base64Image,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/product/create`, formData, );

      if (response.status === 200 && response.data.status === "OK") {
        toast.success("Product created successfully!");
        navigate("/products");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create New Product</h1>
            <p className="mt-2 text-sm text-gray-600">Fill in the details below to add a new product to the menu</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 transition duration-150 ease-in-out"
                  placeholder="Enter product name"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="block w-full p-2 rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 transition duration-150 ease-in-out">
                  <option value="Veg">Vegetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 transition duration-150 ease-in-out">
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="block p-2 w-full pl-7 rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 transition duration-150 ease-in-out"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 transition duration-150 ease-in-out"
                  placeholder="Enter product description"
                />
              </div>

              {/* Image */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-gray-600 hover:text-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500">
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition duration-150 ease-in-out">
                    {image ? (
                      <>
                        <div className="w-full h-full overflow-hidden">
                          <img
                            src={image}
                            className="w-full xl:h-[400px] sm:h-[200px] rounded-xl object-cover"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true">
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <span>Upload a file</span>

                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      id="file-upload"
                      name="image"
                      type="file"
                      onChange={handleImageChange}
                      required
                      accept="image/*"
                      className="sr-only hidden"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out transform hover:scale-[1.02]">
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
