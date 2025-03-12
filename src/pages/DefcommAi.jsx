import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoIosArrowDown } from 'react-icons/io';
import voice_chat from '../assets/voice-chat-icon.png';
import chat_icon from '../assets/chat-icon.png';
import { useNavigate } from 'react-router-dom';

const DefcommAi = () => {
  const navigate = useNavigate();
  const [drop, setDrop] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-6"
    >
      <div className="flex w-full relative">
        {/* Left */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-4 py-10 min-h-28 flex flex-col gap-2 justify-center items-center"
          >
            <p className="font-semibold text-white text-2xl">Hello Defcomm!</p>
            <p className="text-sm text-oliveGreen">Ai assistance for iSurvive Protocol</p>
          </motion.section>

          <section className="grid grid-cols-responsive gap-4 mx-auto md:max-w-lg w-full">
            <motion.div
              onClick={() => navigate('/dashboard/isurvive/voice')}
              whileHover={{ scale: 1.05 }}
              className="bg-oliveGreen text-white flex items-center justify-center p-5 min-h-24 rounded-lg shadow-lg cursor-pointer"
            >
              <img src={voice_chat} alt="Voice Chat" className="w-16" />
            </motion.div>

            <motion.div
              onClick={() => navigate('/dashboard/isurvive/chat')}
              whileHover={{ scale: 1.05 }}
              className="bg-white flex items-center justify-center p-5 min-h-24 rounded-lg shadow-lg cursor-pointer"
            >
              <img src={chat_icon} alt="Chat Icon" className="w-16" />
            </motion.div>
          </section>
        </div>

        {/* Right */}
        <div className="absolute top-2 right-2 md:w-24 h-max md:relative flex flex-col gap-2 md:py-5 text-center text-black">
          <motion.figure
            onClick={() => setDrop(!drop)}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-md"
          >
            <IoIosArrowDown className={drop ? "transform rotate-180":"transform rotate-0"} />
          </motion.figure>

          {drop && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-1 right-0 p-2 rounded-md shadow-md text-black bg-white/50 cursor-pointer"
            >
              <p className="px-3 py-1 rounded-md my-2 bg-gray-300 hover:bg-gray-300/60">Igbo</p>
              <p className="px-3 py-1 rounded-md my-2 bg-gray-300 hover:bg-gray-300/60">Hausa</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DefcommAi;
