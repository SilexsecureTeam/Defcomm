import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md"; // Bolder avatar icon
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi"; 
import useAuth from "../../hooks/useAuth";

const ProfileDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();

    return (
        <div className="relative">
            {/* Profile */}
            <div
                className="flex items-center gap-2 ml-2 font-medium cursor-pointer"
                onClick={() => setIsOpen(!isOpen)} // Toggle dropdown
            >
                <p className="text-sm">Hello, {user?.name?.split(" ")[0] || "User"}</p>
                <div className="flex items-center rounded-full bg-gray-100/50 w-max p-1">
                    {/* Show user avatar if available, otherwise show MdAccountCircle icon */}
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <MdAccountCircle size={28} className="text-gray-600" /> {/* Bigger icon */}
                        </span>
                    )}

                    {/* Dropdown Icon */}
                    <span className="w-8 h-8 rounded-full flex items-center justify-center">
                        <IoIosArrowDown size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </span>
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-[1000] right-0 mt-2 w-44 bg-white font-medium border rounded-md shadow-md">
                    <ul className="py-2 text-sm text-gray-700">
                        <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                            <FiUser size={16} /> Profile
                        </li>
                        <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                            <FiSettings size={16} /> Settings
                        </li>
                        <li
                            className="px-4 py-2 flex items-center gap-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                            onClick={() => logout()} // Call logout function
                        >
                            <FiLogOut size={16} /> Logout
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
