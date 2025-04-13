import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";
const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null; // Ensure modal only renders when open

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="w-screen h-screen fixed inset-0 flex items-center justify-center bg-black/50 z-[1000000]">
        <div className="relative flex items-center justify-center h-max max-w-[95vw] max-h-[90%] flex-col rounded-lg shadow-lg">
        <button
            onClick={closeModal}
            className=" ml-auto sticky top-0 translate-y-1/2 translate-x-[30%] z-10 p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
            aria-label="Close Modal"
          >
            <MdClose className="text-gray-200 hover:text-gray-100" size={24} />
          </button>
          <section className="overflow-y-auto">
            {children}
          </section>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
