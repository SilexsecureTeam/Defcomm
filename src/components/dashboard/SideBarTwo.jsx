import React from "react";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import mainLogo from "../../assets/logo-icon.png";
import { MdKey } from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaBars, FaTimes } from "react-icons/fa";
import { chatUtilOptions, dashboardTabs } from "../../utils/constants";
import { Link } from "react-router-dom";

function SideBarTwo({ children, state, toogleIsOpen, isMenuOpen }) {
    const navigateToPage = () => {
        dispatch({ ...state });
        navigate(state.route);
        toogleIsOpen();
    };
    const Component = state?.icon; // Extract the icon component

    return (
        <>
            {/* SidebarTwo */}
            <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: isMenuOpen ? 0 : "-100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`${isMenuOpen ? "!bg-[#2c3b03] fixed left-0 top-0 bottom-0 z-[100000]" : "hidden"
                    } md:!flex flex-col md:!translate-x-0 md:relative bg-transparent w-72 text-white h-full overflow-y-auto`} // ✅ Ensure sidebarTwo scrolls
            >
                <div className="relative p-4 text-xl font-bold flex flex-col items-center min-h-28 bg-transparent">
                    <div
                        onClick={toogleIsOpen}
                        className="absolute top-8 left-8 cursor-pointer text-white block mr-2 md:hidden transition-all ease-in-out duration-300"
                    >
                        {!isMenuOpen ? <FaBars size={24} /> : <FaTimes size={24} />}
                    </div>
                    <img src={mainLogo} alt="logo" className="w-14" />
                </div>



                {/* ✅ Make sure this section also allows scrolling if needed */}
                <nav className="bg-transparent flex-1 p-4">
                    <div className="min-h-28 flex items-center">
                        {state?.type && (
                            <motion.section className="flex gap-2 item-center bg-gray-400/50 p-2 border-l-[5px] border-l-olive overflow-x-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <motion.figure
                                    className="bg-oliveDark/70 cursor-pointer p-3 rounded-xl shadow-md transition-all"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <img
                                        src={dashboardTabs.find((tab) => tab.type === state.type)?.img}
                                        alt="Dashboard Item"
                                        className="w-8 h-8 object-contain"
                                    />
                                </motion.figure>
                            </motion.section>
                        )}
                    </div>
                    <p className="mt-4 mb-2 font-medium text-xl text-center">Secure Contact</p>

                    <ul className="overflow-y-auto h-80">{children[0]}</ul>
                    

                    
                    <ul className="flex flex-col gap-[10px] mt-20">
                        {chatUtilOptions.map((currentOption, idx) => (
                            <li
                            key={idx}
                                onClick={navigateToPage}
                                className={`cursor-pointer flex gap-[10px] hover:bg-gray-800 group items-center p-3 font-medium ${state?.type === currentOption?.type ? "bg-black text-olive" : "bg-none"
                                    }`}
                            >
                                <Link className="flex items-center gap-3">
                                    <figure className="flex-shrink-0 relative w-12 h-12 bg-gray-300 rounded-full">
                                        <img src={currentOption?.image} alt={currentOption?.title} className="rounded-full" />
                                        <span className={`${currentOption?.status === "Online"
                                            ? "bg-green-500"
                                            : currentOption?.status === "Busy"
                                                ? "bg-red-500"
                                                : currentOption?.status === "Away"
                                                    ? "bg-yellow"
                                                    : "bg-gray-400"
                                            } w-3 h-3 absolute bottom-[-2%] right-[5%] rounded-full border-[2px] border-white`}></span>
                                    </figure>
                                    <div>
                                        <p className="font-bold text-sm">{currentOption?.name}</p>
                                        <span className="text-oliveGreen text-xs ">{currentOption?.message?.length >20 ? `${currentOption?.message?.slice(0,20)}...` : currentOption?.message}</span>
                                    </div>
                                    <div className="flex flex-col items-end text-[10px]">
                                        <span className="text-gray-200">Yesterday</span>
                                        <span className="w-max font-medium px-2 py-1 bg-red-700 rounded-lg tet-center">12</span>
                                    </div>

                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </motion.aside>

        </>
    );
}

export default React.memo(SideBarTwo);
