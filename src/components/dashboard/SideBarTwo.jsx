import React from "react";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import mainLogo from "../../assets/logo-icon.png";
import { MdKey } from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaBars, FaTimes } from "react-icons/fa";
import { dashboardTabs } from "../../utils/constants";

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
                    } md:!flex flex-col md:!translate-x-0 md:relative bg-transparent w-64 text-white h-full overflow-y-auto`} // ✅ Ensure sidebarTwo scrolls
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

                    <ul>{children[0]}</ul>
                    <ul className="mt-5">{children[1]}</ul>

                    <p className="min-h-32 font-medium flex gap-[10px] items-end p-3">
                        <AiOutlineQuestionCircle size={20} />
                        Supports
                    </p>
                </nav>
            </motion.aside>

        </>
    );
}

export default React.memo(SideBarTwo);
