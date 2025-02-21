import { FaUserGroup } from "react-icons/fa6";
import { motion } from "framer-motion";
import mainLogo from "../../assets/logo-icon.png";

const members = [
  { name: "John Doe", image: mainLogo },
  { name: "Jane Smith", image: mainLogo },
  { name: "Mike Johnson", image: mainLogo },
  { name: "Emily Davis", image: mainLogo },
  { name: "Chris Brown", image: mainLogo },
  { name: "Sophia Wilson", image: mainLogo },
  { name: "Daniel Lee", image: mainLogo },
];

function SecureGroup() {
  return (
    <div className="p-4 mt-4 flex flex-col space-y-4 justify-center">
      {/* Group Title */}
      <h2 className="text-lg font-semibold flex items-center space-x-2">
        <FaUserGroup size={20} className="text-green-400" />
        <span>Secure Group</span>
      </h2>

      {/* Member List */}
      <div className="flex overflow-x-auto gap-3 md:gap-6">
        {members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center justify-center"
          >
            <figure className="w-12 h-12 bg-white rounded-full overflow-hidden">
              <img src={member.image} alt={member?.name?.split(" ")[0]} className="w-full h-full object-cover" />
            </figure>
            <p className="text-xs text-center mt-1">{member?.name?.split(" ")[0]}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default SecureGroup;
