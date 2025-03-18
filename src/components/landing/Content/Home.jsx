import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RxDoubleArrowDown } from "react-icons/rx";
import { LiaLongArrowAltDownSolid } from "react-icons/lia";
import PhoneIntro from "./PhoneIntro";
import LogoSlider from "./LogoSlider";
import deffcommhomeimage from "../../../assets/landing/phone1.png";
import RedBlack from "../../../assets/landing/Red&BlackLogo.png";
import privacy from "../../../assets/landing/privacy.png";
import RedBlackTwo from "../../../assets/landing/Red&BlackLogoTwo.png";
import RedBlackThree from "../../../assets/landing/Red&BlackLogoThree.png";
import NavyLogo from "../../../assets/landing/navylogo.png";
import SarsLogo from "../../../assets/landing/sarslogo.png";
import SvgOne from "../Pages/SvgOne";
import SvgTwo from "../Pages/SvgTwo";
import SvgThree from "../Pages/SvgThree";
import SvgFive from "../Pages/SvgFive";
import HeroSlider from "./HeroSlider";

function Home() {
  const targetRef = useRef(null);
  const { scrollY } = useScroll();

  // Darkening Effect: Changes overlay opacity as user scrolls
  const darkenOverlay = useTransform(scrollY, [0, 300], [0, 0.9]);

  // Rotation Effect for Icon
  const rotateScroll = useTransform(scrollY, [1, 200], ["0deg", "360deg"]);

  // Auto-slide images for LogoSlider
  const images = [NavyLogo, RedBlack, RedBlackTwo, RedBlackThree, SarsLogo];
  return (
    <>
      <div className="relative pt-[80px] bg-linear-gradient">
        {/* Darkening Overlay */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: darkenOverlay }}
        ></motion.div>

        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.9,
            stiffness: 120,
          }}
        >
          <div className="lg:hidden absolute pt-[180px]">
            <SvgFive />
          </div>
          <div className="relative mt-10 mb-5 text-white ml-[10%] lg:ml-[0px] h-96 lg:h-[500px]">
            <motion.img src={privacy} alt="" className="w-16 md:w-20 absolute right-[8%] top-[2%]"
              style={{ rotate: rotateScroll }}
            />
            <div className="w-full max-w-96 mx-auto">
            <HeroSlider />
            </div>

            {/* Animated Elements */}
            <motion.div className="hidden md:block absolute text-white bottom-[18%] left-[4%] lg:left-[12%] min-[1200px]:left-[20%] text-sm md:w-48 lg:w-60">
              <SvgOne width="100%" />
              <p className="pt-4">USB Detectors Automatic.</p>
              <p>Wipes With Foreign Elements</p>
            </motion.div>

            <motion.div className="hidden md:flex absolute lg:right-[10%] min-[1200px]:right-[20%] mt-[-200px] right-[5%] text-xs flex-col items-end md:w-48 lg:w-[200px]">
              <SvgTwo width="100%" />
              <p className="pt-2">Built-In TPM Chips Provide Secure Key Storage</p>
            </motion.div>

            <motion.div className="hidden md:block absolute lg:left-[12%] min-[1200px]:left-[20%] top-[-5%] text-sm md:w-48 lg:w-60">
              <p className="pb-4">Killer Switch</p>
              <SvgThree width="100%" />
            </motion.div>
          </div>


          {/* <div className="relative text-white ml-[10%] lg:ml-[0px] h-96 lg:h-[500px] lg:pl-[100px]">
            
            <div className="w-[90%] md:w-[500px] lg:w-[600px] mx-auto flex justify-center">
              <PhoneIntro />
            </div>

            <div className="hidden lg:flex absolute bottom-[2px] lg:left-[-1px]">
              <SvgFive />
            </div>

           
            <motion.div className="hidden md:block absolute text-white bottom-[9%] left-[4%] lg:left-[10%] text-sm md:w-48 lg:w-60">
              <SvgOne width="100%" />
              <p className="pt-4">USB Detectors Automatic.</p>
              <p>Wipes With Foreign Elements</p>
            </motion.div>

            <motion.div className="hidden lg:flex absolute lg:right-[4%] mt-[-200px] right-[10%] text-xs flex-col items-end md:w-48 lg:w-[200px]">
              <SvgTwo width="100%" />
              <p className="pt-2">Built-In TPM Chips Provide Secure Key Storage</p>
            </motion.div>

            <motion.div className="hidden md:block absolute lg:left-[15%] top-[4%] text-sm md:w-48 lg:w-60">
              <p className="pb-4">Killer Switch</p>
              <SvgThree width="100%" />
            </motion.div>

            <motion.div
              className="absolute -top-[15px] right-4 lg:top-6 lg:right-40 text-white"
              style={{ rotate: rotationYscroll }}
              ref={targetRef}
            >
              <div className="relative w-[70px] h-[70px] lg:w-[80px] lg:h-[80px] flex items-center justify-center bg-lime-800 text-white text-4xl rounded-full">
                <p className="bg-black p-1 rounded-full text-[18px]">
                  <LiaLongArrowAltDownSolid />
                </p>
                <svg className="absolute w-[60px] h-[60px]" viewBox="0 0 60 60">
                  <defs>
                    <path id="circlePath" d="M30,5 A25,25 0 1,1 29.99,5" fill="transparent" />
                  </defs>
                  <text className="text-[6px] lg:text-[8px] tracking-[6px] fill-white">
                    <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                      Absolute Privacy
                    </textPath>
                  </text>
                </svg>
              </div>
            </motion.div>
          </div> */}

          <div className="w-[90%] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-10 lg:items-center py-4 lg:pl-10">
            <div className="flex items-center gap-2 lg:gap-6">
              <p className="text-white p-2 lg:p-4 border rounded-[50%] lg:w-[50px]">
                <RxDoubleArrowDown />
              </p>
              <p className="text-white text-sm lg:text-xl w-[200px]">BRAND'S DIGITAL IDENTITY</p>
            </div>
            <LogoSlider images={images} />
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Home;
