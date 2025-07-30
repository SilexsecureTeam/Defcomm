import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const SecureRoute = () => {
  const { authDetails, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading)
    return <div className="text-white text-center mt-10">Loading...</div>;

  if (authDetails?.user?.status?.toLowerCase() !== "active") {
    const isFromLogout = location.state?.fromLogout;
    return (
      <Navigate
        to="/login"
        state={isFromLogout ? {} : { from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default SecureRoute;
