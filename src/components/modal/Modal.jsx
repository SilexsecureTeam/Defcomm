const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null; // Ensure modal only renders when open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative bg-white flex flex-col rounded-lg shadow-lg w-max h-max max-h-[90%] ">
        <button onClick={closeModal} className="absolute top-3 right-3 text-red-500 font-bold text-lg float-right p-5">✖</button>
        <section className="overflow-y-auto  p-5 ">
          {children}
        </section>

      </div>
    </div>
  );
};

export default Modal;
