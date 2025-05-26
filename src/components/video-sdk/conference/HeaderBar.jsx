import { FaArrowLeft } from "react-icons/fa";

const HeaderBar = ({ onBack }) => (
  <div className="flex items-center mb-4">
    <button
      onClick={onBack}
      className="flex items-center text-white hover:text-gray-300"
    >
      <FaArrowLeft className="mr-2" />
      Back
    </button>
  </div>
);

export default HeaderBar;
