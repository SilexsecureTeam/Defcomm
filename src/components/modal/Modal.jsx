import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";
const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null; // Ensure modal only renders when open

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="w-screen h-screen fixed inset-0 flex items-center justify-center bg-black/50 z-[1000000]">
        <div className="relative flex flex-col rounded-lg shadow-lg">
          <button onClick={closeModal} className="absolute top-2 right-2 text-red-500 hover:text-red-600 font-bold text-lg p-4 cursor-pointer"><MdClose size={30} /></button>
          <section className="overflow-y-auto">
            {children}
          </section>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
