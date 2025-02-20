import { RiPhoneFill } from "react-icons/ri";

const calls = [
  { title: "Opps. 14 - Weapon Tracking", time: "32:40" },
  { title: "Opps. 15 - Special Ops", time: "45:14" },
];

function RecentCalls() {
  return (
    <div className="bg-[#1a2b12] p-4 rounded-lg mt-4">
      <h2 className="text-lg font-semibold flex items-center space-x-2">
        <RiPhoneFill size={18} className="text-green-400" />
        <span>Recently</span>
      </h2>
      {calls.map((call, index) => (
        <div key={index} className="flex justify-between items-center mt-2">
          <span>{call.title}</span>
          <span className="text-gray-400">{call.time}</span>
        </div>
      ))}
    </div>
  );
}

export default RecentCalls;
