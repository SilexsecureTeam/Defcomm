import React, { useState } from "react";
import { Monitor, Smartphone, Tablet, Globe, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useDeviceSettings from "../../hooks/useDeviceSettings";
import { AiOutlineLoading } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";

const SessionManager = () => {
  const {
    getDeviceLogsQuery,
    getActiveDevicesQuery,
    updateDeviceStatusMutation,
  } = useDeviceSettings();

  const { data: allDevices = [], isLoading: logsLoading } = getDeviceLogsQuery;
  const { data: activeDevices = [], isLoading: activeLoading } =
    getActiveDevicesQuery;

  const [filter, setFilter] = useState("active");
  const [updatingDevices, setUpdatingDevices] = useState({});

  const devices = (() => {
    switch (filter) {
      case "active":
        return activeDevices;
      case "all":
        return allDevices;
      case "blocked":
        return allDevices.filter((d) => d.status === "blocked");
      case "removed":
        return allDevices.filter((d) => d.status === "removed");
      default:
        return activeDevices;
    }
  })();

  const isLoading = logsLoading || activeLoading;

  const getDeviceIcon = (device) => {
    const type =
      device.os?.toLowerCase().includes("android") ||
      device.os?.toLowerCase().includes("ios")
        ? "mobile"
        : "desktop";
    switch (type) {
      case "desktop":
        return <Monitor size={24} className="text-[#16a34a]" />;
      case "mobile":
        return <Smartphone size={24} className="text-[#16a34a]" />;
      case "tablet":
        return <Tablet size={24} className="text-[#16a34a]" />;
      default:
        return <Globe size={24} className="text-gray-500" />;
    }
  };

  const getStatusClass = (device) => {
    if (device.status === "active") return "bg-[#86efac]/30 text-[#166534]";
    if (device.status === "blocked") return "bg-[#fca5a5]/30 text-[#991b1b]";
    if (device.status === "removed") return "bg-[#d1d5db]/30 text-[#374151]";
    return "bg-[#fcd34d]/30 text-[#92400e]";
  };

  const handleUpdate = (id, status) => {
    setUpdatingDevices((prev) => ({ ...prev, [id]: status }));
    updateDeviceStatusMutation.mutate(
      { id, status },
      {
        onSettled: () =>
          setUpdatingDevices((prev) => ({ ...prev, [id]: null })),
      }
    );
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Active Device Sessions
          </h1>
          <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
            Monitor and manage devices accessing your account. Ensure your
            security.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex space-x-2 bg-gray-200 p-2 rounded-full shadow-lg">
            {["active", "all", "blocked", "removed"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none ${
                  filter === tab
                    ? "bg-[#16a34a] text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Device List */}
        {isLoading ? (
          <p className="text-center text-gray-500 py-20">Loading sessions...</p>
        ) : devices.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            No sessions found for this filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {devices.map((device) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-100 rounded-2xl shadow-lg p-6 flex flex-col items-start gap-2 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl"
                >
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="p-4 bg-gray-200 rounded-full flex-shrink-0">
                      {getDeviceIcon(device)}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {device.device} ({device.os})
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">{device.browser}</span> on{" "}
                        {device.city}, {device.region}, {device.country}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        IP: {device.ip_address} | Last Active:{" "}
                        {new Date(device.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        device
                      )}`}
                    >
                      {device.is_current_session
                        ? "Active"
                        : device.status
                        ? device.status.charAt(0).toUpperCase() +
                          device.status.slice(1)
                        : "Inactive"}
                    </span>

                    {(device.is_current_session ||
                      device.status === "active") && (
                      <motion.button
                        onClick={() => handleUpdate(device.id, "remove")}
                        className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors duration-200 flex gap-1 items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={updatingDevices[device.id] === "remove"}
                      >
                        <XCircle size={16} className="mr-2" />
                        Logout{" "}
                        {updatingDevices[device.id] === "remove" && (
                          <FaSpinner className="animate-spin mr-2" />
                        )}
                      </motion.button>
                    )}

                    {device.status !== "" && !device.is_current_session && (
                      <motion.button
                        onClick={() => handleUpdate(device.id, "block")}
                        className="px-4 py-2 bg-[#d97706] text-white rounded-full text-sm font-medium hover:bg-[#b45309] transition-colors duration-200 flex gap-1 items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={updatingDevices[device.id] === "block"}
                      >
                        <XCircle size={16} className="mr-2" />
                        Block{" "}
                        {updatingDevices[device.id] === "block" && (
                          <FaSpinner className="animate-spin mr-2" />
                        )}
                      </motion.button>
                    )}

                    {device.status !== "active" && (
                      <motion.button
                        onClick={() => handleUpdate(device.id, "remove")}
                        className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors duration-200 flex gap-1 items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={updatingDevices[device.id] === "remove"}
                      >
                        <XCircle size={16} className="mr-2" />
                        Remove{" "}
                        {updatingDevices[device.id] === "remove" && (
                          <FaSpinner className="animate-spin mr-2" />
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionManager;
