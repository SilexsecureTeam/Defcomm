import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiLogOut } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import DashTabs from "../components/dashboard/DashTabs";
import Broadcast from "../components/dashboard/Broadcast";
import RecentCalls from "../components/dashboard/RecentCalls";
import EmergencyBanner from "../components/dashboard/EmergencyBanner";
import Categories from "../components/dashboard/Categories";
import SecureGroup from "../components/dashboard/SecureGroup";
const Dashboard = () => {
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
        <main className="flex-1 md:p-6">
          <div className="bg-[#121a0f] min-h-screen text-white p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Broadcast />
                <RecentCalls />
              </div>
              <EmergencyBanner />
            </div>
            <Categories />
            <SecureGroup />
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
