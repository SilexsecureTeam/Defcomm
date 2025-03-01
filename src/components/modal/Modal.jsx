import { motion, AnimatePresence } from "framer-motion";
const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null; // Ensure modal only renders when open

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="w-screen h-screen fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="relative bg-white flex flex-col rounded-lg shadow-lg w-max">
          <button onClick={closeModal} className="absolute top-3 right-3 text-red-500 font-bold text-lg float-right p-5">✖</button>
          <section className="overflow-y-auto">
            {children}
          </section>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
