import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaDropbox, FaAppStoreIos, FaFileAlt } from "react-icons/fa";
import { SiMega, SiNextcloud } from "react-icons/si";
import { IoIosMore } from "react-icons/io";
import { FiPlus, FiSend } from "react-icons/fi";

const storageServices = [
  { name: "Dropbox", used: 120, total: 200, color: "bg-blue-500", iconColor: "text-blue-500", bgOpacity: "bg-blue-500/30", icon: <FaDropbox /> },
  { name: "Noysi", used: 120, total: 200, color: "bg-green-500", iconColor: "text-green-500", bgOpacity: "bg-green-500/30", icon: <SiNextcloud /> },
  { name: "Mega", used: 120, total: 200, color: "bg-red-500", iconColor: "text-red-500", bgOpacity: "bg-red-500/30", icon: <SiMega /> },
  { name: "AppVeyor", used: 120, total: 200, color: "bg-blue-400", iconColor: "text-blue-400", bgOpacity: "bg-blue-400/30", icon: <FaAppStoreIos /> },
];

const recentFiles = [
  { name: "Avala Project", owner: "Carter Mango", date: "Sun, 10 May 2022", size: "3MB", color: "bg-blue-500" },
  { name: "Design Sprint", owner: "Carter Mango", date: "Sun, 10 May 2022", size: "5MB", color: "bg-green-500" },
  { name: "Atomic Design", owner: "Carter Mango", date: "Sun, 10 May 2022", size: "10MB", color: "bg-red-500" },
  { name: "UX Research", owner: "Carter Mango", date: "Sun, 10 May 2022", size: "2MB", color: "bg-yellow-500" },
];

const MyDrive = () => {
  const [showMore, setShowMore] = useState(null);

  const toggleOptions = (index) => {
    setShowMore(showMore === index ? null : index);
  };

  return (
    <div className="p-6 bg-transparent">
      {/* My Drive Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-semibold">My Drive</h2>
        <button className="bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200">+ Add New</button>
      </div>

      {/* Storage Services */}
      <div className="grid grid-cols-responsive-sm gap-6">
        {storageServices.map((service, index) => (
          <motion.div
            key={service.name}
            className="bg-white rounded-lg p-4 shadow-md w-full min-h-40 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div className="flex items-center space-x-3">
              {/* Animated Icon */}
              <motion.figure
                whileHover={{ scale: 1.1 }}
                className={`p-3 rounded-lg ${service.bgOpacity} flex items-center justify-center`}
              >
                <div className={`text-2xl ${service.iconColor}`}>{service.icon}</div>
              </motion.figure>
              <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${service.color} h-2 rounded-full`}
                  style={{ width: `${(service.used / service.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 flex justify-between">
                {service.total}GB &nbsp; <span className="text-gray-400">{service.used}GB</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Files Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">Recent Files</h2>
          <button className="text-gray-400 hover:text-white">View All</button>
        </div>
        <div className="space-y-4">
          {recentFiles.map((file, index) => (
            <motion.div
              key={index}
              className="flex flex-wrap min-[800px]:flex-nowrap items-center justify-between gap-2 bg-white rounded-lg p-4 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              {/* File Icon and Name */}
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`p-2 rounded-lg ${file.color}/30`}
                >
                  <FaFileAlt className={`${file.color} text-lg`} />
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
              </div>

              {/* File Details (shown when more is clicked) */}
              <section
                className={`${
                  index === showMore ? "flex" : "hidden"
                } order-1 basis-full min-[800px]:flex min-[800px]:basis-auto min-[800px]:order-0 flex-1 items-center justify-around gap-2`}
              >
                <p className="text-gray-500 text-sm">{file.owner}</p>
                <p className="text-gray-500 text-sm">{file.date}</p>
                <p className="text-gray-500 text-sm">{file.size}</p>
              </section>

              {/* Animated Action Icons */}
              <div className="flex space-x-4 text-gray-500 min-[800px]:order-1">
                <motion.div whileHover={{ scale: 1.2 }}>
                  <FiPlus className="cursor-pointer hover:text-black" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }}>
                  <FiSend className="cursor-pointer hover:text-black" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }} onClick={() => toggleOptions(index)}>
                  <IoIosMore className="cursor-pointer hover:text-black" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyDrive;
