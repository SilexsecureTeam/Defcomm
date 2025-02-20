import { RiAlertFill } from "react-icons/ri";

function EmergencyBanner() {
  return (
    <div className="bg-green-500 text-black p-4 rounded-lg h-full flex flex-col justify-between">
      <h2 className="text-lg font-bold flex items-center space-x-2">
        <RiAlertFill size={22} />
        <span>CDS Emergency Executive Meetings</span>
      </h2>
      <p className="text-sm">
        Enjoy various interesting features that you have never experienced before.
      </p>
      <button className="bg-black text-white px-4 py-2 rounded mt-4">
        Explore Now
      </button>
    </div>
  );
}

export default EmergencyBanner;
