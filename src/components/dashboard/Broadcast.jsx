import { RiSignalTowerLine } from "react-icons/ri";
import { MdMoreVert } from "react-icons/md";

const broadcasts = [
  { title: "Intel Ops", color: "bg-green-500", progress: 70 },
  { title: "Weapon Tracking", color: "bg-red-500", progress: 50 },
  { title: "Special Operations", color: "bg-yellow-500", progress: 30 },
];

function Broadcast() {
  return (
    <div className="bg-[#1a2b12] p-4 rounded-lg">
      {/* Broadcast Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <RiSignalTowerLine size={20} className="text-green-400" />
          <h1 className="text-lg font-semibold">Secure Walkie Talkie Broadcast</h1>
        </div>
      </div>

      {/* Broadcast List */}
      {broadcasts.map((item, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between">
            <span>{item.title}</span>
            <MdMoreVert size={20} className="text-gray-400 cursor-pointer" />
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className={`${item.color} h-2 rounded-full`}
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Broadcast;
