import React, { useState, } from "react";
import { motion } from "framer-motion";
import mainLogo from "../../assets/logo-icon.png";
import { FaBars, FaCheck, FaSpinner, FaTimes, FaUserPlus } from "react-icons/fa";
import { dashboardTabs } from "../../utils/constants";
import useChat from "../../hooks/useChat";
import { useQuery } from "@tanstack/react-query";
import useGroups from "../../hooks/useGroup";
import Modal from "../modal/Modal";
import GroupSlide from "../GroupSlide";

function SideBarTwo({ children, state, toogleIsOpen, isMenuOpen, contacts }) {
    const { fetchChatHistory } = useChat();
    // State for modal and selected group
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Fetch Chat History using React Query
    const { data: chatHistory, isLoading } = useQuery({
        queryKey: ["chat-history"],
        queryFn: fetchChatHistory,
        //  refetchInterval: 5000,
        staleTime: 0
    });
   const { useFetchGroups, useFetchGroupMembers, addContactMutation } = useGroups();

    //add member to contact
    const { data: groups } = useFetchGroups();

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [loadingStates, setLoadingStates] = useState({});
    // Fetch group members when a group is selected
    const { data: groupMembers, isLoading: isGroupMembersLoading } = useFetchGroupMembers(selectedGroup?.group_id);

    const handleAddContact = async (member) => {
        setLoadingStates((prev) => ({ ...prev, [member?.id]: "adding" }));
      
        try {
          await addContactMutation.mutateAsync(member?.member_id_encrpt);
        }finally {
          setLoadingStates((prev) => ({ ...prev, [member?.id]: null })); // ✅ Stops loader in all cases
        }
      };
      
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
                                    className="bg-oliveDark/70 cursor-pointer p-3 rounded-xl shadow-md flex items-center justify-center !text-black font-bold transition-all"
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
                    {children?.length &&
                        <div className="relative">
                            {/* Add Contact Button */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                <FaUserPlus />
                                <span className="hidden md:block">Add Contact</span>
                            </button>
                            <ul className="overflow-y-auto h-80">{children[0] ? children[0] : (
                                <div className="flex flex-col items-center justify-center h-60 text-gray-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-16 h-16 text-gray-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 10.5V8.25a6.75 6.75 0 10-13.5 0V10.5M12 15v2.25m-3.75-3h7.5"
                                        />
                                    </svg>
                                    <p className="text-lg mt-2">No contacts available</p>
                                    <p className="text-sm text-gray-400 text-center">Start a conversation by adding new contacts.</p>
                                </div>
                            )}</ul>
                            <ul className="flex flex-col gap-[10px] mt-20">
                                {chatHistory?.slice(-2)?.reverse()?.map((chat) => (
                                    <li
                                        key={chat?.id}
                                        className={`cursor-pointer flex gap-[10px] hover:bg-gray-800 group items-center p-3 font-medium bg-none`}
                                    >
                                        <section className="flex items-center gap-3">
                                            <figure className="flex-shrink-0 relative w-12 h-12 bg-gray-300 rounded-full">
                                                <img src={chat?.image} alt={chat?.chat_user_to_name?.split("")[0]} className="rounded-full" />

                                            </figure>
                                            <div className="mr-auto">
                                                <p className="font-bold text-sm">{chat?.chat_user_to_name}</p>
                                                <span className="text-oliveGreen text-xs ">{chat?.last_message?.length > 15 ? `${chat?.last_message?.slice(0, 15)}...` : chat?.last_message}</span>
                                            </div>
                                            <div className="ml-auto flex flex-col items-end text-[10px]">
                                                <span className="text-gray-200">Yesterday</span>
                                                <span className="w-max font-medium px-2 py-1 bg-red-700 rounded-lg tet-center">12</span>
                                            </div>

                                        </section>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }

                </nav>
            </motion.aside>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
                    <div className="p-5 w-[80vw] md:w-[600px] min-h-32 max-h-[80vh] py-14 bg-oliveDark text-white">
                        {groups?.length ?
                            (<GroupSlide groups={groups} setSelectedGroup={setSelectedGroup} forceSingleView={true} />) : (
                                <div>No groups available </div>
                            )}

                        {/* Show group members when a group is selected */}
                        {selectedGroup && (
                            <div className="mt-3">
                                {isGroupMembersLoading ?
                                    <div className="flex justify-center">
                                        <FaSpinner className="animate-spin text-white text-2xl" />
                                    </div>
                                    : <>
                                        <h3 className="text-lg font-bold"><strong>{selectedGroup?.group_name} -</strong> Members:</h3>
                                        <ul className="mt-2 space-y-2">
                                            {groupMembers?.map((member) => {
                                                if(!member?.member_name) return null
                                                const isAlreadyAdded = contacts?.some((c) => c.contact_id === member?.member_id);
                                                return (
                                                    <li
                                                        key={member?.id}
                                                        onClick={() => handleAddContact(member)}
                                                        className="bg-gray-700 p-3 rounded-md flex items-center justify-between gap-2 cursor-pointer"
                                                        disabled={loadingStates[member?.id] === "adding"}
                                                    >
                                                        {member?.member_name || "Anonymous"}
                                                        {isAlreadyAdded ? (
                                                            <FaCheck className="text-green-400" />
                                                        ) : loadingStates[member?.id] === "adding" ? (
                                                            <FaSpinner className="animate-spin text-white" />
                                                        ) : null}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </>}

                            </div>
                        )}
                    </div>
                </Modal>
            )}

        </>
    );
}

export default SideBarTwo;
