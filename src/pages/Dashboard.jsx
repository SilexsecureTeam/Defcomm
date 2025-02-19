import React,{useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiLogOut } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import DashTabs from "../components/dashboard/DashTabs";

const Dashboard=() => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-transparent">
      
    {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="mt-10">
        <DashTabs />
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6">
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
