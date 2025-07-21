import React, { useContext, useMemo, useState } from "react";
import { motion } from "framer-motion";
import SEOHelmet from "../engine/SEOHelmet";
import { FiSearch, FiPhone, FiVideo, FiTrash2 } from "react-icons/fi";
import { IoFilter } from "react-icons/io5";
import { MdMoreHoriz, MdCallMissed, MdCallMade } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import defIcon from "../assets/logo-icon.png";
import useChat from "../hooks/useChat";
import { useQuery } from "@tanstack/react-query";
import Modal from "../components/modal/Modal";
import AddContactInterface from "../components/dashboard/AddContactInterface";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import CallHistory from "../components/CallHistory";
import useGroups from "../hooks/useGroup";

const ContactList = () => {
  const { authDetails } = useContext(AuthContext);
  const { setSelectedChatUser, setShowCall, setCallType, setShowContactModal } =
    useContext(ChatContext);

  const [selectedContactForLogs, setSelectedContactForLogs] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [deletingContactId, setDeletingContactId] = useState(null);

  const { fetchContacts, getCallLogs } = useChat();
  const { removeContactMutation } = useGroups();

  // Fetch Call Logs using React Query
  const { data: callLogs } = getCallLogs;

  // Fetch Contacts using React Query
  const {
    data: contacts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    staleTime: 0,
  });

  const handleCall = (user, call) => {
    setSelectedChatUser({
      ...user,
      chat_meta: {
        chat_user_type: user?.contact_type || "user",
        chat_user_id: user.contact_id,
        chat_id: "null",
      },
    });
    setShowCall(true);
    setCallType(call);
  };
  const handleDeleteContact = async (contactId) => {
    setDeletingContactId(contactId);
    try {
      await removeContactMutation.mutateAsync(contactId);
    } finally {
      setDeletingContactId(null);
    }
  };

  function maskContactInfo(contactInfo) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(contactInfo)
      ? contactInfo.replace(/^(.{8}).*?@/g, "$1xxxx@xxx.")
      : contactInfo.slice(0, -8) + "X".repeat(8);
  }

  const filteredContacts = Array.isArray(contacts)
    ? contacts.filter(
        (contact) =>
          contact?.contact_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          contact?.contact_email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          contact?.contact_phone
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : [];

  const callStats = useMemo(() => {
    const statsMap = {};
    if (!Array.isArray(callLogs)) return statsMap;

    callLogs.forEach((log) => {
      const userEmail =
        log?.recieve_user_email === authDetails?.user?.email
          ? log?.send_user_email
          : log?.recieve_user_email;

      if (!userEmail) return;

      if (!statsMap[userEmail]) statsMap[userEmail] = { missed: 0, picked: 0 };

      if (log.call_state === "miss") statsMap[userEmail].missed += 1;
      if (log.call_state === "pick") statsMap[userEmail].picked += 1;
    });

    return statsMap;
  }, [callLogs, authDetails?.user?.email]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-6"
    >
      <SEOHelmet title="Contacts" />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#DDF2AB]">
          Contacts
        </h2>

        <section className="flex items-center gap-2 font-medium">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-1 relative max-w-60 text-gray-800"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="text-sm p-2 rounded-lg focus:outline-none w-full pl-10 border border-gray-300 focus:ring-2 focus:ring-oliveHover"
            />
            <FiSearch className="absolute left-3 top-0 bottom-0 my-auto text-gray-400" />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex gap-2 items-center text-gray-600 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
          >
            <IoFilter />
            <span className="hidden md:block">Filter</span>
          </motion.button>

          <motion.button
            onClick={() => setShowContactModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex gap-2 items-center text-black px-4 py-2 bg-oliveHover rounded-lg text-sm hover:bg-oliveGreen"
          >
            <FaPlus /> <span className="hidden md:block">Add Contact</span>
          </motion.button>
        </section>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 font-medium py-4">
          ❌ Failed to load contacts. Please try again.
        </div>
      )}

      {!isLoading && !error && filteredContacts?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full bg-white text-black border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts?.map((contact, index) => {
                const stats = callStats[contact?.contact_email] || {
                  missed: 0,
                  picked: 0,
                };

                return (
                  <tr
                    key={index}
                    className="border-b transition-all duration-300 hover:bg-gray-100"
                  >
                    <td className="p-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 bg-oliveLight rounded-full shadow">
                        <img src={defIcon} alt="icon" className="w-6 h-6" />
                      </span>
                      <div className="flex gap-2">
                        <div className="font-medium">
                          {contact?.contact_name}
                        </div>
                        <div className="flex gap-2 text-xs mt-1">
                          {stats.missed > 0 && (
                            <span
                              className="text-red-500 flex items-center gap-1"
                              title={`${stats.missed} missed calls`}
                            >
                              <MdCallMissed />
                              {stats.missed}
                            </span>
                          )}
                          {stats.picked > 0 && (
                            <span
                              className="text-green-600 flex items-center gap-1"
                              title={`${stats.picked} picked calls`}
                            >
                              <MdCallMade />
                              {stats.picked}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {maskContactInfo(contact?.contact_phone)}
                    </td>
                    <td className="p-3">
                      {maskContactInfo(contact?.contact_email)}
                    </td>
                    <td className="p-3 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Call"
                        className="p-2 rounded-full bg-gray-100 hover:bg-oliveLight/80 hover:text-white text-gray-700"
                        onClick={() => handleCall(contact, "audio")}
                      >
                        <FiPhone />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Video Call"
                        className="p-2 rounded-full bg-gray-100 hover:bg-oliveLight/80 hover:text-white text-gray-700"
                        onClick={() => handleCall(contact, "video")}
                      >
                        <FiVideo />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Call Logs"
                        className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-blue-700"
                        onClick={() => setSelectedContactForLogs(contact)}
                      >
                        <MdMoreHoriz />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Delete Contact"
                        disabled={deletingContactId === contact.id}
                        className={`p-2 rounded-full transition-all ${
                          deletingContactId === contact.id
                            ? "bg-red-200 text-red-400 cursor-not-allowed"
                            : "bg-red-100 hover:bg-red-200 text-red-600"
                        }`}
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        {deletingContactId === contact.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <FiTrash2 />
                        )}
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !error && filteredContacts?.length === 0 && (
        <div className="text-center text-white py-6">No contacts found.</div>
      )}

      {selectedContactForLogs && (
        <Modal isOpen={true} closeModal={() => setSelectedContactForLogs(null)}>
          <CallHistory contact={selectedContactForLogs} logs={callLogs} />
        </Modal>
      )}
    </motion.div>
  );
};

export default ContactList;
