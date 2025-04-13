import React, { useState } from "react";
import { motion } from "framer-motion";
import SEOHelmet from "../engine/SEOHelmet";
import { FiSearch, FiPhone, FiVideo } from "react-icons/fi";
import { IoFilter } from "react-icons/io5";
import defIcon from "../assets/logo-icon.png";
import useChat from "../hooks/useChat";
import { MdMoreHoriz } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import AddContactInterface from "../components/dashboard/AddContactInterface";
import Modal from "../components/modal/Modal";

const ContactList = () => {
    // State for modal and selected group
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { fetchContacts } = useChat();
    // Fetch contacts
    // Fetch Contacts using React Query
    const { data: contacts, isLoading, error } = useQuery({
        queryKey: ["contacts"],
        queryFn: fetchContacts,
        staleTime: 0,
    });

    function maskContactInfo(contactInfo) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(contactInfo) ? contactInfo.replace(/^(.{8}).*?@/g, '$1xxxx@xxx.') : contactInfo.slice(0, -8) + 'X'.repeat(8);
    }

    const filteredContacts = Array.isArray(contacts)
        ? contacts.filter(contact =>
            contact?.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact?.contact_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact?.contact_phone?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-6"
        >
            <SEOHelmet title="Contacts" />

            {/* Header Section */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                <h2 className="text-2xl md:text-3xl font-semibold w-full md:w-max text-[#DDF2AB]">
                    Contacts
                </h2>

                <section className="flex items-center gap-2 font-medium">
                    {/* Search Input */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex-1 relative max-w-60 text-gray-800"
                    >
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="text-sm p-2 rounded-lg focus:outline-none w-full pl-10 transition-all duration-300 border border-gray-300 focus:ring-2 focus:ring-oliveHover"
                        />
                        <FiSearch className="absolute left-3 top-0 bottom-0 my-auto text-gray-400" />
                    </motion.div>

                    {/* Filter Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex gap-2 items-center text-gray-600 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm transition-all duration-300 hover:bg-gray-100"
                    >
                        <IoFilter />
                        <span className="hidden md:block">Filter</span>
                    </motion.button>

                    {/* Add Contact Button */}
                    <motion.button
                        onClick={() => setIsModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex gap-2 items-center text-black px-4 py-2 bg-oliveHover rounded-lg text-sm transition-all duration-300 hover:bg-oliveGreen"
                    >
                        <FaPlus /> <span className="hidden md:block">Add Contact</span>
                    </motion.button>
                </section>
            </div>

            {/* Loader */}
            {isLoading && (
                <motion.div
                    className="flex justify-center items-center py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                </motion.div>
            )}

            {/* Error Handling */}
            {error && (
                <motion.div
                    className="text-center text-red-600 font-medium py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
                >
                    ❌ Failed to load contacts. Please try again.
                </motion.div>
            )}

            {/* Contacts Table */}
            {!isLoading && !error && filteredContacts?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-x-auto"
                >
                    <table className="min-w-[700px] w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="p-3">Name</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">Email</th>
                                {/* <th className="p-3">Last Login</th> */}
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts?.map((contact, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b transition-all duration-300 hover:bg-gray-100"
                                >
                                    <td className="p-3 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-8 h-8 bg-oliveLight rounded-full shadow">
                                            <img src={defIcon} alt="icon" className="w-6 h-6" />
                                        </span>
                                        {contact?.contact_name}
                                    </td>
                                    <td className="p-3">{maskContactInfo(contact?.contact_phone)}</td>
                                    <td className="p-3">{maskContactInfo(contact?.contact_email)}</td>
                                    {/* <td className="p-3">{contact?.lastLogin || "16 Mar 2022"}</td> */}
                                    <td className="p-3 flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            title="Call"
                                            className="p-2 rounded-full bg-gray-100 hover:bg-oliveLight/80 hover:text-white text-gray-700 transition"
                                            onClick={() => console.log("Call", contact)}
                                        >
                                            <FiPhone />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            title="Video Call"
                                            className="p-2 rounded-full bg-gray-100 hover:bg-oliveLight/80 hover:text-white text-gray-700 transition"
                                            onClick={() => console.log("Video Call", contact)}
                                        >
                                            <FiVideo />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}

            {/* No Contacts Found */}
            {!isLoading && !error && filteredContacts?.length === 0 && (
                <motion.div
                    className="text-center text-white py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    No contacts found.
                </motion.div>
            )}

            {isModalOpen && (
                <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
                    <AddContactInterface />
                </Modal>
            )}
        </motion.div>
    );
};

export default ContactList;
