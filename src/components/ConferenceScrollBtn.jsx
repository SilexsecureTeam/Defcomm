import React, { useState, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ConferenceScrollBtn = ({ scrollRef }) => {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const scrollEl = scrollRef?.current || window;

    const handleScroll = () => {
      const scrollTop = scrollRef?.current
        ? scrollRef.current.scrollTop
        : window.scrollY;
      setVisible(scrollTop > 200); // Show after some scroll
    };

    scrollEl.addEventListener("scroll", handleScroll);
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  const scrollToTop = () => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            duration: 0.2,
          }}
          className="fixed bottom-20 right-6 z-[9999]"
        >
          <motion.button
            onClick={scrollToTop}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(101,163,13,0.95)",
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-10 h-10 flex items-center justify-center
                       bg-olive/90 text-white rounded-lg
                       shadow-md hover:shadow-lg backdrop-blur-sm
                       border border-white/20 transition-all duration-200
                       focus:outline-none focus:ring-1 focus:ring-olive focus:ring-offset-1 focus:ring-offset-gray-900"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            {/* Subtle glow on hover */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-olive/20 blur-md -z-10"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Icon */}
            <motion.div
              animate={{ y: isHovered ? -1 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <FaChevronUp
                size={14}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </motion.div>

            {/* Tooltip */}
            <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-1 hidden group-hover:block">
              <div className="bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md backdrop-blur-sm border border-gray-700">
                Scroll to top
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConferenceScrollBtn;
