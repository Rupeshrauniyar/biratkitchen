import React, {useContext} from "react";
import {AppContext} from "../contexts/AppContext";
import {Outlet} from "react-router-dom";
import Signin from "../pages/Signin";
import LoaderComp from "../components/Loader";
const AdminMiddleware = () => {
  const {user, isLoading} = useContext(AppContext);
  return (
    <div className="">
      {isLoading ? (
        <>
          <LoaderComp />
        </>
      ) : user && user._id ? (
        <Outlet />
      ) : (
        <Signin />
      )}
    </div>
  );
};

export default AdminMiddleware;
