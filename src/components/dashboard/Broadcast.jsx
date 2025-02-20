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
                <MdMoreVert size={20} className="text-gray-400 cursor-pointer ml-auto" />
            </div>

            {/* Broadcast List */}
            {broadcasts.map((item, index) => (
                <div key={index} className="mb-4 bg-gray-200 text-gray-800 font-medium flex min-h-28">
                    <div className="bg-blue-600 w-12 min-h-full flex flex-col justify-between items-center">
                        <span>h</span>
                        <span>h</span>
                    </div>
                    <div className="flex justify-between p-3">
                        <span>{item.title}</span>
                    </div>

                </div>
            ))}
        </div>
    );
}

export default Broadcast;
