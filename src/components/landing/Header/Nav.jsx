import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBarsStaggered } from "react-icons/fa6";
import { PiArrowBendDownRightThin } from "react-icons/pi";
import defcommlogo from "../../../assets/landing/Defcomm-03 1.png";
import { MdClose } from "react-icons/md";

function Nav() {
  const navigate = useNavigate();
  const [dropDown, setDropDown] = useState(false);

  const handleClick = () => setDropDown(!dropDown);

  const initialVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.5 } },
  };

  return (
    <motion.nav
      variants={initialVariant}
      initial="hidden"
      animate="visible"
      className="fixed z-20 w-full backdrop-blur-lg bg-transparent px-6 md:px-10 py-3 flex items-center justify-between"
    >
      {/* Logo */}
      <img src={defcommlogo} alt="DeffComm Logo" className="w-[150px] md:w-[250px]" />

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-6">
        {[
          "Home",
          "Service",
          "Technology",
          "Feature",
        ].map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.02, fontWeight: "bold", textShadow: "0px 0px 8px rgb(255,255,255)" }}
            className="text-white border-r py-2 px-3 border-stone-600 cursor-pointer"
          >
            {item === "Feature" ? (
              <div className="flex items-center gap-2">
                {item} <PiArrowBendDownRightThin />
              </div>
            ) : (
              item
            )}
          </motion.li>
        ))}
      </ul>

      {/* Login Button */}
      <motion.button
        onClick={() => { scrollTo(0, 0); navigate('/login'); }}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
        className="hidden md:block bg-white text-gray-700 px-6 py-2 rounded-full shadow-md font-medium"
      >
        Login
      </motion.button>

      {/* Mobile Menu Toggle */}
      <div onClick={handleClick} className="md:hidden cursor-pointer text-white">
        {dropDown ? null : <FaBarsStaggered size={24} />}
      </div>

      {/* Mobile Navigation */}
      <motion.ul
        initial={{ x: "100%" }}
        animate={{ x: dropDown ? 0 : "100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 right-0 h-screen w-[250px] bg-black bg-opacity-90 shadow-xl text-white flex flex-col items-start py-6 px-4 space-y-4 md:hidden"
      >
        <li onClick={handleClick} className=" cursor-pointer text-lg">
          <MdClose size={24} strokeWidth={2} className="text-red-500" />
        </li>
        {[
          "Home",
          "Service",
          "Technology",
          "Feature",
          "Careers",
          "Contact Us",
        ].map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.02, textShadow: "0px 0px 8px rgb(255,255,255)" }}
            className="w-full p-4 cursor-pointer hover:bg-lime-800 transition-all duration-200"
          >
            {item}
          </motion.li>
        ))}
        <motion.button
        onClick={() => { scrollTo(0, 0); navigate('/login'); }}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
        className="mx-4 bg-white text-gray-700 px-6 py-2 rounded-full shadow-md font-medium"
      >
        Login
      </motion.button>
      </motion.ul>
    </motion.nav>
  );
}

export default Nav;
