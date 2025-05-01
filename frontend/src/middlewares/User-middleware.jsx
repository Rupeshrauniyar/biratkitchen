import React, {useContext} from "react";
import {AppContext} from "../contexts/AppContext";
import {Outlet} from "react-router-dom";
import Signup from "../pages/Signup";
import LoaderComp from "../components/Loader";
const UserMiddleware = () => {
  const {user, isLoading} = useContext(AppContext);
  
  return (
    <div className="">
      {/* {console.log(user)} */}
      {isLoading ? (
        <>
          <LoaderComp />
        </>
      ) : user && user?._id ? (
        <Outlet />
      ) : (
        <div className="w-full min-h-screen">
          <Signup />
        </div>
      )}
      {/* <Outlet /> */}
    </div>
  );
};

export default UserMiddleware;
