import { RiLockFill } from "react-icons/ri";

function SecureGroup() {
  return (
    <div className="bg-[#1a2b12] p-4 rounded-lg mt-4 flex flex-col space-y-4 justify-center">
      <h2 className="text-lg font-semibold flex items-center space-x-2">
        <RiLockFill size={20} className="text-green-400" />
        <span>Secure Group</span>
      </h2>
      <div className="flex space-x-2 overflow-x-auto">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="w-12 h-12 bg-gray-700 rounded-full"></div>
        ))}
      </div>
    </div>
  );
}

export default SecureGroup;
