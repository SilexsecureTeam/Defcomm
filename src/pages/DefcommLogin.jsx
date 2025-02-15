import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import logo from "../assets/logo.png";
import logoIcon from "../assets/logo-icon.png";
import intro1 from "../assets/intro1.png";
import intro3 from "../assets/intro3.png";
import grid from "../assets/bg-grid.png";
import call from "../assets/call.png";
import scroll from "../assets/scroll.png";
import mail from "../assets/mail-secure.png";
import secure from "../assets/secure.png";
import talkie from "../assets/walkie-talkie.png";
import LoginForm from "../components/LoginForm";
import BackToTopButton from "../components/BackToTopButton";

const DefcommLogin = () => {
  const { scrollYProgress } = useScroll();
  const moveDown = useTransform(scrollYProgress, [0, 1], [-40, 200]); // Moves intro1 up and down
  const moveUp = useTransform(scrollYProgress, [0, 1], [60, -60]); // Moves intro1 up and down
  const rotateScroll = useTransform(scrollYProgress, [0, 1], [0, 360]); // Rotates scroll image

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
      className="relative max-w-peak min-h-screen bg-gradient-to-b from-black to-green-900 flex flex-col items-center justify-center text-white p-6"
      style={{
        background: `linear-gradient(to bottom, #101500 10%, #000000 40%, #1E270D 90%)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full sticky top-0 z-50 flex justify-between items-center bg-[#101500]/50 backdrop:blur-lg"
      >
        <img src={logoIcon} alt="Defcomm Icon" className="w-20" />
        <button className="bg-white text-gray-700 px-6 py-2 rounded-full shadow-md font-medium">Login</button>
      </motion.div>

      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ background: `url(${grid})`, backgroundPosition: "center left", backgroundRepeat: "no-repeat" }}
        className="relative w-full flex flex-col items-center"
      >
        <motion.img src={scroll} alt="" className="w-16 absolute right-[8%] top-[1%]"
          style={{ rotate: rotateScroll }}
        />
        <motion.img src={intro1} alt="" className="hidden md:block w-48 absolute translate-y-[0%] translate-x-[10%]"
          style={{ y: moveDown, x:"-40%" }}
        />
        <motion.img src={intro3} alt="" className="hidden min-[1200px]:block w-48 absolute right-0 bottom-0 translate-y-[-60%] translate-x-[-5%]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ y: moveUp }}
        />
        <LoginForm />
      </motion.section>

      {/* Footer Section */}
      <motion.div className="my-6 md:mt-20 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">360 Degree Protection</h3>
        <p className="text-sm mt-2 max-w-[370px] text-gray-400 font-medium">
          Dronerly.Inc is a company producing the highest quality VR Drones with the latest technology.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.ul className="flex gap-2 item-center w-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        {[{ img: mail, bg: "#000000" }, { img: call, bg: "#FFFFFF" }, { img: secure, bg: "#000000" }, { img: talkie, bg: "#000000" }]?.map((item, idx) => (
          <motion.li key={idx} className="p-3 rounded-xl bg-opacity-50" style={{ backgroundColor: item.bg }} whileHover={{ scale: 1.1 }}>
            <img src={item?.img} alt="img" className="w-5 h-5" />
          </motion.li>
        ))}
      </motion.ul>

      {/* Footer Links */}
      <motion.section className="mt-6 border-t border-gray-400 pt-4 flex flex-wrap items-center justify-center lg:justify-between gqp-y-2 gap-x-6 w-[95%] md:max-w-[1400px] mx-auto text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          borderImageSource: "linear-gradient(to left, rgba(60, 60, 60, 0.05), #dddddd, rgba(60, 60, 60, 0.05))",
          borderImageSlice: "1 0 1 0",
          borderImageRepeat: "stretch",
          borderTop: "2px solid",
        }}
      >
        <img src={logo} alt="Defcomm Logo" className="w-40" />
        <div className="flex gap-2 md:gap-6 text-sm">
          <a href="#" className="underline">PRODUCT</a>
          <a href="#" className="underline">SUPPORT</a>
          <a href="#" className="underline">COOPERATION</a>
        </div>
        <div className="text-xs opacity-75">© Copyright Defcomm, All Rights Reserved.</div>
      </motion.section>
      <BackToTopButton />
    </motion.div>
  );
};

export default DefcommLogin;
