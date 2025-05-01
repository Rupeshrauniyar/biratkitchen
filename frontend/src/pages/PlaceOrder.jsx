import React, {useState, useContext, useRef, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {AppContext} from "../contexts/AppContext";
import { Loader2,  Mail, MapPin, PhoneCall, Wallet} from "lucide-react";
import {io} from "socket.io-client";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const socket = io(backendUrl);

const PlaceOrder = (props) => {
  const navigate = useNavigate();
  const {user, setUser, cart} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isMounted = useRef(true);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });
  const [product, setProduct] = useState(
    cart?.map((cartItem) => {
      const Data = {
        product: cartItem.product._id,
        quantity: cartItem.quantity,
        productTotalPrice: cartItem.product.price * cartItem.quantity,
      };

      return Data;
    })
  );
  const [inpValue, setInpValue] = useState({
    full_name: user ? user.full_name : "",
    ph_num: user ? user.ph_num : "",
    address: "",
    paymentMethod: "cash",
    id: user ? user._id : "",
    product,
  });
  const {state} = useLocation();

  const validateForm = () => {
    let isValid = true;
    const newFieldErrors = {
      email: "",
      password: "",
    };

    // Email validation
    if (!inpValue.email) {
      newFieldErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(inpValue.email)) {
      newFieldErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!inpValue.password) {
      newFieldErrors.password = "Password is required";
      isValid = false;
    }

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // if (!validateForm()) {
    //   return;
    // }

    setLoading(true);

    try {
      socket.emit("create-order", inpValue);
    } catch (error) {
     
      setErrorMessage("An error occurred. Please try again.");
      setIsRedirecting(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const {name, value} = e.currentTarget;
    setInpValue((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const requiredFields = [
    {
      name: "full_name",
      label: "Full name",
      type: "text",
      value: user ? user.full_name : "",
      svg: <Mail />,
      placeholder: "Enter your full name",
    },
    {
      name: "ph_num",
      label: "Phone number",
      type: "number",
      value: user ? user.ph_num : "",

      svg: <PhoneCall />,
      placeholder: "Enter your phone number",
    },
    {
      name: "address",
      label: "Address",
      value: user ? user.address : "",

      type: "text",
      svg: <MapPin />,
      placeholder: "Enter your address",
    },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      svg: <Wallet />,
      option: [
        {
          name: "Cash",
          value: "cash",
        },
        {
          name: "Online",
          value: "online",
        },
      ],
    },
  ];
  useEffect(() => {
    socket.on("create-product-success", (Data) => {
      setIsRedirecting(true);
      // console.log(Data);
      localStorage.setItem("orders", JSON.stringify(Data));
      navigate("/bookings");
    });
    socket.on("create-product-failure", (Data) => {
      // console.log(Data);
      setErrorMessage("Failed to place order.");
      setLoading(false);
    });
  }, []);

  if (props.setHidden) {
    return null;
  }
  return (
    <div className="w-full h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-black dark:text-white text-black">
      <div className="w-full h-full max-w-md flex flex-col item-center justify-center">
        <div className="text-center">
          {/* {console.log(product)} */}
          <h2 className="text-3xl font-extrabold dark:text-gray-200 text-gray-900">Place your order.</h2>
          <p className="mt-2 text-sm dark:text-gray-300 text-gray-600">Confirm your details.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
          noValidate>
          {errorMessage && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              role="alert">
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="space-y-4 dark:text-white">
            {/* {console.log(inpValue)} */}
            {requiredFields.map((field, index) => (
              <div key={index}>
                {field.type === "select" ? (
                  <>
                    <div className="">
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium dark:text-white text-gray-700">
                        {field.label}
                      </label>
                      <div className="mt-1 relative dark:text-white dark:bg-black">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none dark:text-white w-8">{field.svg}</div>
                        <select
                          id={field.name}
                          name={field.name}
                          onChange={handleInput}
                          className={`dark:text-white dark:bg-black block w-full pl-10 pr-3 py-3 border ${
                            fieldErrors[field.name] ? "border-red-500" : "border-gray-300"
                          } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 dark:focus:ring-zinc-300 focus:ring-black focus:border-black sm:text-sm transition-all duration-200`}
                          placeholder={field.placeholder}>
                          <option value={field.option[0].value}>{field.option[0].name}</option>
                          <option value={field.option[1].value}>{field.option[1].name}</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium dark:text-white text-gray-700">
                      {field.label}
                    </label>
                    <div className="mt-1 relative dark:text-white dark:bg-black">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none dark:text-white w-8">{field.svg}</div>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.value}
                        type={field.type}
                        onChange={handleInput}
                        className={`appearance-none dark:text-white dark:bg-black block w-full pl-10 pr-3 py-3 border ${
                          fieldErrors[field.name] ? "border-red-500" : "border-gray-300"
                        } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 dark:focus:ring-zinc-300 focus:ring-black focus:border-black sm:text-sm transition-all duration-200`}
                        placeholder={field.placeholder}
                      />
                    </div>
                  </div>
                )}

                {fieldErrors[field.name] && <p className="mt-1 text-sm text-red-600">{fieldErrors[field.name]}</p>}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || isRedirecting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white dark:bg-zinc-900 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading || isRedirecting ? (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                {isRedirecting ? "Redirecting..." : "Placing..."}
              </div>
            ) : (
              "Place order"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
