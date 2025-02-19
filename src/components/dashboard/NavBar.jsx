
import React, { useState, memo } from "react";

import { FaCartShopping, FaBell } from "react-icons/fa6";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { IoBarbellOutline, IoChatbubbleEllipsesSharp, IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { PiBellLight } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";

function NavBar({ user, title, isMenuOpen, toogleIsOpen }) {
  const navigate = useNavigate();

  const navigateToCart = () => navigate('/dashboard/cart');
  const navigateToInstantChat = () => navigate('/dashboard/instant_chat');

  return (
    <nav className="p-2 flex items-center justify-between gap-2 bg-transparent h-20">
      {/* Title */}
      <div
        onClick={toogleIsOpen}
        className="cursor-pointer text-white block mr-2 md:hidden transition-all ease-in-out duration-300"
      >
        {!isMenuOpen ? <FaBars size={24} /> : <FaTimes size={24} />}
      </div>
      <h1 className="font-bold text-white text-sm md:text-[25px] truncate mr-auto md:mr-0">
        Discover
      </h1>

      {/* Search Bar (Hidden on Small Screens) */}
      <div className="flex-1 max-w-[400px] mx-1 hidden md:flex h-10 items-center gap-2 bg-gray-500/50 p-2 text-white">
        <FaSearch size={20} />
        <input
          type="text"
          placeholder="Search here..."
          className="w-full h-[80%] placeholder:text-sm placeholder:text-inherit focus:outline-none bg-transparent"
        />
      </div>

      {/* Icons and Profile Section */}
      <div className="flex items-center gap-4 text-white">
        {/* Language Selector */}
        <div className="hidden md:flex items-center cursor-pointer gap-2 w-10 h-10 rounded-full bg-gray-500/50">
          {/* <img src={UsFlag} alt="US Flag" /> */}
          <p className="font-semibold text-gray-600 text-xs">Eng</p>
        </div>
        {/* Notification */}
        <div className="hidden md:flex items-center justify-center cursor-pointer gap-2 w-10 h-10 rounded-full bg-gray-500/50">
          <PiBellLight size={20} />
        </div>

        {/* profile */}
        <div className="flex items-center gap-2 ml-2 font-medium">
          <p>Hello, {user?.name || "DefComm"}</p>
          <div className="flex items-center rounded-full bg-gray-100/50 w-max p-1">
            <span className="w-8 h-8 rounded-full bg-gray-300"></span>
            <span className="w-8 h-8 rounded-full flex items-center justify-center"><IoIosArrowDown size={20}/> </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default memo(NavBar); 
