import {  RiMessageFill, RiSignalWifiFill, RiFolderFill } from "react-icons/ri";
import { MdPhoneMissed } from "react-icons/md";

const categories = [
  { title: "Miss Calls", count: 120, icon: <MdPhoneMissed />, bg: "bg-green-600" },
  { title: "Messages", count: 96, icon: <RiMessageFill />, bg: "bg-gray-700" },
  { title: "Signal Comms", count: 88, icon: <RiSignalWifiFill />, bg: "bg-gray-700" },
  { title: "File Sharing", count: 96, icon: <RiFolderFill />, bg: "bg-gray-700" },
];

function Categories() {
  return (
    <div className="bg-[#1a2b12] p-4 rounded-lg mt-4">
      <h2 className="text-lg font-semibold">Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {categories.map((cat, index) => (
          <div key={index} className={`${cat.bg} p-4 rounded-lg flex items-center space-x-2`}>
            <span className="text-white text-xl">{cat.icon}</span>
            <div>
              <h3 className="text-lg font-bold">{cat.count}</h3>
              <p className="text-sm">{cat.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
