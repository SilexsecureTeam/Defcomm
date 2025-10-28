import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const RequestsPanel = ({ pendingRequests }) => {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-24 right-6  border border-gray-700 rounded-2xl shadow-lg w-64 z-50 ${
        panelCollapsed
          ? "opacity-0 backdrop-blur-0 bg-gray-900/50"
          : "opacity-100 backdrop-blur-md bg-gray-900/90"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">
          Join Requests ({pendingRequests?.length})
        </h3>

        {/* Toggle Button */}
        <button
          onClick={() => setPanelCollapsed((prev) => !prev)}
          className="text-gray-300 hover:text-white text-xs bg-gray-800 px-2 py-1 rounded-md transition"
        >
          {panelCollapsed ? "Show" : "Hide"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!panelCollapsed && (
          <motion.div
            key="requests-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="p-3"
          >
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex justify-between gap-1 items-center bg-gray-800 px-3 py-2 rounded-xl"
                >
                  <span className="text-xs font-medium text-gray-100 truncate">
                    {req.name || "Guest"}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        req.allow();
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded-md"
                    >
                      Admit
                    </button>
                    <button
                      onClick={() => {
                        req.deny();
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-md"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RequestsPanel;
