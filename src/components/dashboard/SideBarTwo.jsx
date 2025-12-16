import React, { useContext, useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import mainLogo from "../../assets/logo-icon.png";
import {
  FaBars,
  FaTimes,
  FaUserPlus,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import useChat from "../../hooks/useChat";
import { useQuery } from "@tanstack/react-query";
import useGroups from "../../hooks/useGroup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";
import SideBarItemTwo from "./SideBarItemTwo";

function SideBarTwo({ toogleIsOpen, isMenuOpen }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setShowContactModal } = useContext(ChatContext);
  const isChatPage =
    pathname.startsWith("/dashboard/user/") || pathname.endsWith("/chat");

  // Fetch Chat History
  const { useFetchLastChats, useFetchContacts } = useChat();
  const {
    data: lastChats,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useFetchLastChats();

  const unreadMap = useMemo(() => {
    if (!lastChats) return {};
    const map = {};
    lastChats.forEach((chat) => {
      map[chat.chat_user_to_id] = chat.unread; // or chat.unread_count
    });
    return map;
  }, [lastChats]);

  // Fetch Contacts
  const {
    data: contacts,
    isLoading: isContactsLoading,
    isError: isContactsError,
  } = useFetchContacts();

  // Fetch Groups
  const { useFetchGroups } = useGroups();
  const {
    data: groups,
    isLoading: isGroupsLoading,
    isError: isGroupsError,
  } = useFetchGroups();

  // Expand/Collapse state
  const [openSections, setOpenSections] = useState({
    users: true,
    groups: true,
  });

  // Search
  const [search, setSearch] = useState("");

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Order contacts (recent chats first, no duplicates)
  const orderedContacts = useMemo(() => {
    if (!contacts) return [];
    if (!lastChats) return contacts;

    // backend already ordered: latest FIRST
    const historyIds = lastChats.map((c) => c.chat_user_to_id);
    const uniqueHistoryIds = [...new Set(historyIds)];

    const inHistory = uniqueHistoryIds
      .map((id) => contacts.find((c) => c.contact_id_encrypt === id))
      .filter(Boolean);

    const inHistoryIds = new Set(inHistory.map((c) => c.contact_id_encrypt));
    const others = contacts.filter(
      (c) => !inHistoryIds.has(c.contact_id_encrypt)
    );

    return [...inHistory, ...others]; // chat with latest message stays TOP
  }, [contacts, lastChats]);

  // Filter by search
  const filteredContacts = useMemo(() => {
    return orderedContacts.filter((c) =>
      c.contact_name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [orderedContacts, search]);

  const filteredGroups = useMemo(() => {
    return groups?.filter((g) =>
      g.group_name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [groups, search]);

  // Auto-expand section if search has results
  useEffect(() => {
    if (search.trim() !== "") {
      if (filteredContacts.length > 0) {
        setOpenSections((prev) => ({ ...prev, users: true }));
      }
      if (filteredGroups?.length > 0) {
        setOpenSections((prev) => ({ ...prev, groups: true }));
      }
    }
  }, [search, filteredContacts, filteredGroups]);

  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: isMenuOpen ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`
        ${
          isMenuOpen
            ? "!bg-[#2c3b03] fixed left-0 top-0 bottom-0 z-[100000]"
            : "hidden"
        }
        ${isChatPage ? "lg:!hidden" : "lg:flex"}
        md:!flex flex-col md:!translate-x-0 md:relative 
        bg-transparent w-72 text-white h-full overflow-y-auto
      `}
    >
      {/* Header */}
      <div className="relative p-4 text-xl font-bold flex flex-col items-center min-h-28">
        <div
          onClick={toogleIsOpen}
          className="absolute top-8 left-8 cursor-pointer text-white block md:hidden"
        >
          {!isMenuOpen ? <FaBars size={24} /> : <FaTimes size={24} />}
        </div>
        <Link to={"/dashboard/home"}>
          <img src={mainLogo} alt="logo" className="w-14" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="bg-transparent flex-1 p-4">
        <p className="mt-4 mb-2 font-medium text-xl text-center">
          Secure Contact
        </p>

        {/* Add Contact Button */}
        <button
          onClick={() => setShowContactModal(true)}
          className="w-full mb-3 flex items-center gap-2 px-4 py-2 bg-oliveHover text-black rounded-lg hover:bg-oliveGreen transition"
        >
          <FaUserPlus />
          <span>Add Contact</span>
        </button>

        {/* Search Box */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users or groups..."
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-oliveGreen"
        />

        {/* Users Section */}
        <div>
          <button
            onClick={() => toggleSection("users")}
            className="flex sticky top-0 justify-between items-center w-full px-2 py-2 bg-oliveDark rounded-md"
          >
            <span className="font-semibold">Users</span>
            {openSections.users ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openSections.users && (
            <ul className="mt-2 space-y-2">
              {isContactsLoading || isHistoryLoading ? (
                <p className="text-gray-400 text-sm px-2">Loading users...</p>
              ) : isContactsError || isHistoryError ? (
                <p className="text-red-400 text-sm px-2">
                  Failed to load users
                </p>
              ) : filteredContacts?.length ? (
                filteredContacts.map((contact) => (
                  <SideBarItemTwo
                    key={contact.contact_id}
                    data={contact}
                    setIsOpen={toogleIsOpen}
                    unread={unreadMap[contact?.contact_id_encrypt] || 0}
                  />
                ))
              ) : (
                <p className="text-gray-400 text-sm px-2">No users found</p>
              )}
            </ul>
          )}
        </div>

        {/* Groups Section */}
        <div className="mt-4">
          <button
            onClick={() => toggleSection("groups")}
            className="flex sticky top-0 justify-between items-center w-full px-2 py-2 bg-oliveDark rounded-md"
          >
            <span className="font-semibold">Groups</span>
            {openSections.groups ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openSections.groups && (
            <ul className="mt-2 space-y-2">
              {isGroupsLoading ? (
                <p className="text-gray-400 text-sm px-2">Loading groups...</p>
              ) : isGroupsError ? (
                <p className="text-red-400 text-sm px-2">
                  Failed to load groups
                </p>
              ) : filteredGroups?.length ? (
                filteredGroups.map((group) => (
                  <li
                    onClick={() =>
                      navigate(`/dashboard/group/${group?.group_id}/chat`)
                    }
                    key={group.group_id}
                    className="cursor-pointer flex gap-3 items-center p-2 rounded-lg hover:bg-gray-800"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-full bg-oliveGreen flex items-center justify-center font-bold">
                      {group?.group_name.charAt(0)}
                    </div>
                    <p className="line-clamp-2">{group?.group_name}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-sm px-2">No groups found</p>
              )}
            </ul>
          )}
        </div>
      </nav>
    </motion.aside>
  );
}

export default SideBarTwo;
