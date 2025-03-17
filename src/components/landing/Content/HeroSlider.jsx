import React, { useContext, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {Autoplay } from "swiper/modules";
import { RxDoubleArrowDown } from "react-icons/rx";
import { motion, useScroll, useTransform } from "framer-motion";
import { LiaLongArrowAltDownSolid } from "react-icons/lia";
import PhoneIntro from "./PhoneIntro";
import deffcommhomeimage from "../../../assets/landing/phone1.png";
import SvgOne from "../Pages/SvgOne.jsx";
import SvgTwo from "../Pages/SvgTwo.jsx";
import SvgThree from "../Pages/SvgThree.jsx";
import SvgFive from "../Pages/SvgFive.jsx";
import phone4 from "../../../assets/landing/phone4.png";
import phone5 from "../../../assets/landing/phone5.png";

const slides = [
  {
    image: phone4,
    illustration1:{
      title: "USB Detectors Automatic.",
      content:"Wipes With Foreign Elements"
    },
    illustration2:{
      title: "Built-In TPM Chips Provide Secure Key Storage"
    },
    illustration3:{
      title: "Killer Switch"
    },
  },
  {
    image: phone5,
    illustration1:{
      title: "USB Detectors Automatic.",
      content:"Wipes With Foreign Elements"
    },
    illustration2:{
      title: "Built-In TPM Chips Provide harware-based cryptographic functions, secure key storage."
    },
    illustration3:{
      title: "Killer Switch"
    },
  },
];

const HeroSlider = () => {
  const targetRef = useRef(null);
    const { scrollY } = useScroll();
   // Rotation Effect for Icon
   
  return (
    <Swiper
      navigation={true}
      modules={[Autoplay]}
      loop={true} // Enables infinite looping
      autoplay={{ delay: 3000}}
      className="relative"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <img
              src={slide?.image}
              alt="Premium Phone Display"
              className="h-96 lg:h-[500px] drop-shadow-2xl mx-auto"
            />
            
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;


            {/* Animated Elements
            <motion.div className="hidden md:block absolute text-white bottom-[9%] left-[4%] lg:left-[10%] text-sm md:w-48 lg:w-60">
              <SvgOne width="100%" />
              <p className="pt-4 capitalize">{slide?.illustration1?.title}</p>
              <p>{slide?.illustration1?.content}</p>
            </motion.div>

            <motion.div className="hidden lg:flex absolute lg:right-[4%] mt-[-200px] right-[10%] text-xs flex-col items-end md:w-48 lg:w-[200px]">
              <SvgTwo width="100%" />
              <p className="pt-4 capitalize">{slide?.illustration2?.title}</p>
            </motion.div>

            <motion.div className="hidden md:block absolute lg:left-[15%] top-[4%] text-sm md:w-48 lg:w-60">
            <p className="pt-4 capitalize">{slide?.illustration3?.title}</p>
              <SvgThree width="100%" />
            </motion.div> */}
        