import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const GroupChatDetails = ({ groupInfo, showGroupInfo, setShowGroupInfo }) => {
  const { authDetails } = useContext(AuthContext);
  const userId = authDetails?.user?.id;
  return (
    <AnimatePresence>
      {showGroupInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setShowGroupInfo(false)}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-2xl font-extrabold text-gray-800">
                {groupInfo?.group_meta?.name}
              </h2>
              <button
                onClick={() => setShowGroupInfo(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              {groupInfo?.group_meta?.decription}
            </p>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800">Members</h3>
              {groupInfo?.data?.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full capitalize bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                    {member.member_name.charAt(0)}
                  </div>
                  <p className="text-gray-800 font-medium">
                    {member.member_name}
                    {member.member_id === userId && (
                      <span className="text-xs text-gray-500 ml-2">(You)</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GroupChatDetails;
