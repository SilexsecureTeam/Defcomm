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
import SEOHelmet from "../engine/SEOHelmet";
import useGroups from "../hooks/useGroup";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { useFetchGroups } = useGroups();

  // Fetch groups
  const { data: groups, isLoading, error } = useFetchGroups();

  return (
    <>
      {/* SEO Content */}
      <SEOHelmet title="Dashboard" />
      <div className="text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Broadcast />
            <RecentCalls />
          </div>
          <div>
            <EmergencyBanner />
            <Categories />
            {/* Pass groups data to SecureGroup */}
            <SecureGroup groups={groups} isLoading={isLoading} error={error} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
