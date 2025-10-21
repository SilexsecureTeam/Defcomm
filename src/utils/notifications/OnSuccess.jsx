import { toast, Slide } from "react-toastify";
import { MdCheckCircle } from "react-icons/md";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Component wrapper prevents isPaused from leaking to DOM
// eslint-disable-next-line react-refresh/only-export-components
const SuccessToast = ({ message, success }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="flex items-center gap-4 p-4 min-w-[280px] bg-gradient-to-r from-green-200 to-green-50 shadow-2xl rounded-2xl border border-green-300 hover:shadow-green-400/40"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <MdCheckCircle className="text-green-600 text-3xl" />
    </motion.div>

    <div className="flex flex-col">
      <strong className="text-gray-900 font-semibold text-sm">{message}</strong>
      <p className="text-gray-600 text-xs mt-1">{success}</p>
    </div>
  </motion.div>
);

export const onSuccess = (success) => {
  toast(<SuccessToast message={success.message} success={success.success} />, {
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    transition: Slide,
    theme: "light",
  });
};
