import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import icon1 from "../../../assets/landing/icon1.png"
import icon2 from "../../../assets/landing/icon2.png"

function CoreValue() {
  const textVariants = {
    hidden: {
      y: 100,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.9,
      },
    },
  };

  const imgtwoVariants = {
    slidehidden: {
      x: 0,
      opacity: 0,
    },
    slidevisible: {
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 1,
      },
    },
  };

  return (
    <div className='flex flex-col lg:flex-row justify-between gap-8 font-[poppins] bg-linear-gradientone min-h-full py-20 px-4 lg:px-10'>
      <motion.div
        className='lg:w-1/2 flex flex-col justify-center lg:justify-start lg:border-l-2 border-lime-600'
        variants={textVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
      >
        <div className='border-l-2 border-lime-600 p-6 lg:p-10 rounded-md text-white'>
          <h1 className='text-gray-400 font-bolder text-3xl lg:text-4xl'>Why Choose Us?</h1>
          <br />
          <p className='text-xs lg:text-base mt-4 leading-6'>
            Defcomm is a leading provider of secure communication solutions
            tailored for defense organizations. We specialize in end-to-end encryption technologies designed to protect sensitive military and
            governmental communications from cyber threats,interception, Andunauthorized access. With years of expertise in cybersecurity and
            defense technology, we ensure that critical data remains secure in an increasingly complex digital landscape.
          </p>
          <div className='group py-3 px-6 w-max rounded-[100px] flex items-center gap-2 text-center my-8 text-lime-400 border border-lime-400 hover:bg-lime-600 cursor-pointer hover:border-lime-300 hover:text-white hover:scale-105 transition duration-200'>
            <span className="group-hover:pr-2 transition duration-200">Learn More</span> <FaArrowRight />
          </div>
        </div>
      </motion.div>

      <motion.div
        className='lg:w-1/2 rounded-lg flex flex-col items-center gap-2'

      >
        {/* Image or other content goes here */}
        <div className='flex flex-col gap-3 bg-oliveLight text-white p-8 min-h-24 w-[90%]'>
          <img src={icon1} alt="" className="w-10" />
          <h2 className="text-xl font-medium">Innovation</h2>
          <p className="text-sm">Harness cutting edge technologies tostay ahead in rapidly evolving cybersecurity landscape.</p>
        </div>

        <div className='flex flex-col gap-3 bg-black text-white p-8 min-h-24 w-[90%]'>
          <img src={icon2} alt="" className="w-10" />
          <h2 className="text-xl font-medium">Simplicity</h2>
          <p className="text-sm">Simplify complex processes with intuitive interfaces and streamlined workflows.</p>
        </div>
      </motion.div>
    </div>
  );
}

export default CoreValue;
