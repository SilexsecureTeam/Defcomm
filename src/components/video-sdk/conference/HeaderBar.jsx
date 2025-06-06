import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeaderBar = ({ onBack }) => {
  const navigate = useNavigate();
  const handleBack=()=>{
    if(onBack){
      onBack();
    }else{
      navigate(-1)
    }
  }
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full sticky top-0 z-50 flex justify-between items-center mb-auto bg-transparent backdrop-blur-lg p-2"
    >
      <button
        onClick={handleBack}
        className="flex items-center text-lg text-white hover:text-gray-300"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
    </motion.div>
  )
};

export default HeaderBar;
