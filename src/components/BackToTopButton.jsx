import React, { useState, useEffect } from "react";
import top from "../assets/top.png";

const BackToTopButton = ({ scrollRef }) => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const scrollElement = scrollRef?.current || window;

    const handleScroll = () => {
      const scrollTop = scrollRef?.current
        ? scrollRef.current.scrollTop
        : window.scrollY;

      setIsAtTop(scrollTop < 50);
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  const scrollToTop = () => {
    const scrollElement = scrollRef?.current || window;

    if (scrollRef?.current) {
      scrollRef.current.scrollTo({
        top: isAtTop ? scrollRef.current.scrollHeight : 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: isAtTop ? document.body.scrollHeight : 0,
        behavior: "smooth",
      });
    }

    setIsAtTop(!isAtTop);
  };

  return (
    <p
      onClick={scrollToTop}
      className="fixed bottom-[10%] right-[10%] cursor-pointer z-50"
    >
      <img
        src={top}
        alt="Back_to_top"
        className={`w-16 rounded-full transition-transform duration-500 ${
          !isAtTop ? "rotate-0" : "rotate-180"
        } hover:scale-110`}
      />
    </p>
  );
};

export default BackToTopButton;
