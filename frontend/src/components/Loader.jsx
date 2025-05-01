import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-3"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  );
};

export default Loader;
