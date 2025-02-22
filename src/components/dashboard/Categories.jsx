import { RiMessageFill, RiSignalWifiFill, RiFolderFill } from "react-icons/ri";
import { MdPhoneMissed } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { IoIosChatboxes } from "react-icons/io";
import { FaWalkieTalkie } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
const categories = [
  { title: "Miss Calls", count: 120, icon: <MdPhoneMissed />, bg: "bg-green-600" },
  { title: "Messages", count: 96, icon: <IoIosChatboxes />, bg: "bg-gray-700" },
  { title: "Signal Comms", count: 88, icon: <FaWalkieTalkie />, bg: "bg-gray-700" },
  { title: "File Sharing", count: 96, icon: <FaFileAlt />, bg: "bg-gray-700" },
];

function Categories() {
  return (
    <div className="p-4 rounded-lg mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <BiSolidCategory size={20} className="text-green-400" />
          <h1 className="text-lg font-semibold">Categories</h1>
        </div>
        <span className="text-gray-400 cursor-pointer ml-auto underline text-sm" >Show All</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {categories.map((cat, index) => (
          <div key={index} className={`${index > 0 ? "bg-[#1a2b12]":"bg-green-600"} hover:bg-green-600/60 cursor-pointer px-4 py-2 flex flex-col items-center justify-center gap-2 text-center`}>
            <span className="text-white text-xl rounded-full">{cat.icon}</span>
            <div>
              <p className="text-sm">{cat.title}</p>
              <h3 className="text-sm">{cat.count}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
