import React from "react";
import { FaSpinner } from "react-icons/fa";

const Spinner = ({ size = "text-lg", color = "text-[#A7C957]" }) => {
  return <FaSpinner className={`animate-spin ${size} ${color}`} />;
};

export default Spinner;
