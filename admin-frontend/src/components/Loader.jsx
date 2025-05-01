import React from "react";
import {Loader} from "lucide-react";
const LoaderComp = () => {
  return (
    <div className="flex w-full justify-center items-center mt-50">
      <Loader className="w-10 h-10 animate-spin" />
    </div>
  );
};

export default LoaderComp;
