import { TfiArrowTopRight } from "react-icons/tfi";
import { ImFacebook } from "react-icons/im";
import { GrInstagram } from "react-icons/gr";
import { IoLogoYoutube } from "react-icons/io";
import { LiaLongArrowAltUpSolid } from "react-icons/lia";
import Logo from "../../../assets/logo.png";
import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { useRef } from "react";

function Footer() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll();


  const rotationYscroll = useTransform(scrollYProgress, [0, 1], ["0deg", "360deg"]);

  const btnVariants = {
    hover: {
      y: [-10, 0, -10, 0],
      boxShadow: "0px 0px 8px rgb(164, 245, 24)",
      transition: { duration: 2, repeat: Infinity },
    },
  };

  return (
    <div className="bg-linear-gradient font-[poppins] text-white w-full">
      <div className="mx-auto px-4">
        <h1 className="font-bold pt-4 text-[28px] md:text-[40px] text-center">
          Request More Information
        </h1>
        <p className="text-xs md:text-lg mt-2 md:mt-4 text-white text-center leading-6 max-w-[600px] mx-auto">
         The Defcomm Platform stands as the epitome of secure connectivity for defense operational communication.
        </p>

        <motion.div
          className="flex items-center justify-center gap-2 mx-auto mt-6 md:mt-10 py-2 px-4 rounded-full w-max text-center bg-lime-400 border border-lime-400 cursor-pointer text-black"
          variants={btnVariants}
          whileHover="hover"
        >
          Contact Us <TfiArrowTopRight />
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-center mt-8 mb-8">
          <ul className="flex flex-wrap gap-6 md:gap-10 justify-center items-center text-center">
            <li className="underline underline-offset-4">PRODUCT</li>
            <li className="underline underline-offset-4">SUPPORT</li>
            <li className="underline underline-offset-4">COOPERATION</li>
            <li className="underline underline-offset-4">COMMUNITY</li>
          </ul>

          
        </div>

        <hr className="border-stone-900 w-full md:w-[90%] mx-auto" />

        <div className="flex flex-col md:flex-row justify-between items-center text-center py-6 md:py-10 w-full">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <img src={Logo} alt="Defcomm Logo" className="w-48" />
          </div>

          <p className="text-xs text-gray-400 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Defcomm, All Rights Reserved
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <p className="p-3 border border-stone-800 rounded-full"><ImFacebook /></p>
            <p className="p-3 border border-stone-800 rounded-full"><GrInstagram /></p>
            <p className="p-3 border border-stone-800 rounded-full"><IoLogoYoutube /></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
