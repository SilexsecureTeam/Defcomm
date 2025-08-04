import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiLogOut } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import DashTabs from "../components/dashboard/DashTabs";
import Broadcast from "../components/walkietalkie/Broadcast";
import RecentCalls from "../components/walkietalkie/RecentCalls";
import EmergencyBanner from "../components/dashboard/EmergencyBanner";
import Categories from "../components/dashboard/Categories";
import SecureGroup from "../components/dashboard/SecureGroup";
import SEOHelmet from "../engine/SEOHelmet";
import useGroups from "../hooks/useGroup";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoFlash } from "react-icons/io5";
import Modal from "../components/modal/Modal";
import CommInterface from "../components/walkietalkie/CommInterface";

const WalkieTalkie = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* SEO Content */}
      <SEOHelmet title="Walkie Talkie" />
      {/* Header Section */}
      <div className="sticky top-0 z-50 flex xl:hidden justify-between items-center bg-oliveDark text-white p-4 text-sm font-medium dark:bg-oliveLight">
        <button
          aria-label="Upgrade to Premium"
          className="bg-white text-black dark:bg-gray-800 dark:text-white rounded-lg flex items-center gap-2 px-3 py-2 border border-olive transition-all hover:scale-105"
        >
          <IoFlash className="text-yellow" />{" "}
          <span className="hidden md:block">Upgrade to Premium</span>
        </button>
        <FaBarsStaggered
          aria-label="Open Communication Panel"
          size={24}
          className="cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </div>

      <div className="text-white">
        <div className="flex gap-4">
          <div className="md:w-2/3 flex-1">
            <Broadcast />
            <RecentCalls />
          </div>
          <div className="md:w-1/3 hidden xl:block">
            <CommInterface />
          </div>
        </div>
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
          <CommInterface />
        </Modal>
      )}
    </>
  );
};

export default WalkieTalkie;
