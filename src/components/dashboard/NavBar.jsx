
import React, { useState, memo } from "react";

import { FaCartShopping, FaBell } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp, IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function NavBar({ title, menu, setMenu }) {
  const navigate = useNavigate();

  const navigateToCart = () => navigate('/dashboard/cart');
  const navigateToInstantChat = () => navigate('/dashboard/instant_chat');
  
  return (
    <nav className="p-2 flex items-center justify-between bg-white shadow-md md:shadow-none">
      {/* Title */}
      <div
        onClick={() => {
          setMenu(!menu);
        }}
        className="cursor-pointer block mr-2 md:hidden transition-all ease-in-out duration-300"
      >
        {!menu ? <FaBars size={24} /> : <FaTimes size={24} />}
      </div>
      <h1 className="font-bold text-gray-600 text-sm md:text-[25px] truncate mr-auto md:mr-0">
        {title}
      </h1>

      {/* Search Bar (Hidden on Small Screens) */}
      <div className="flex-1 max-w-[400px] mx-1 hidden md:flex h-8 items-center gap-2 bg-gray-200 rounded-lg px-2 border">
        <input
          type="text"
          placeholder="Search here..."
          className="w-full h-[80%] text-gray-700 placeholder:text-sm bg-gray-200 focus:outline-none"
        />
      </div>

      {/* Icons and Profile Section */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="hidden md:flex items-center cursor-pointer gap-2">
          {/* <img src={UsFlag} alt="US Flag" /> */}
          <p className="font-semibold text-gray-600 text-xs">Eng</p>
          </div>

        {/* Icons List */}
        <ul className="flex items-center gap-4">
          <li className="relative">
            <IoChatbubbleEllipsesSharp
              onClick={navigateToInstantChat}
              className="text-xl text-gray-400 hover:scale-110 transition-transform"
            />
            <div className="absolute top-1 right-0 h-2 w-2 bg-lime-400 rounded-full"></div>
          </li>
          <li className="relative">
            <FaBell className="text-xl text-gray-400 hover:scale-110 transition-transform" />
            <div className="absolute top-1 right-0 h-2 w-2 bg-lime-400 rounded-full"></div>
          </li>
          <li className="relative">
            <FaCartShopping
              onClick={navigateToCart}
              className="text-lg text-gray-400 hover:scale-110 transition-transform"
            />
            <div className="absolute top-1 right-0 h-2 w-2 bg-lime-400 rounded-full"></div>
          </li>
          <li>
            <IoSettings className="text-lg text-gray-400 hover:scale-110 transition-transform" />
          </li>
          {/* <li className="flex-shrink-0">
            <img
              src={ProfilePic}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
          </li> */}
        </ul>
      </div>
    </nav>
  );
}

export default memo(NavBar); 
