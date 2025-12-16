import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext"; // Import Chat Context
import logoIcon from "../../assets/logo-icon.png";
import { MdDelete } from "react-icons/md";
import useGroups from "../../hooks/useGroup";
import { FaSpinner } from "react-icons/fa";
import { maskPhone } from "../../utils/formmaters";
import { handleOpenChat } from "../../utils/chat/messageUtils";
function SideBarItemTwo({ data, setIsOpen, unread }) {
  const navigate = useNavigate();
  const location = useLocation();
  const chatUserData = location?.state;
  const { setSelectedChatUser, typingUsers } = useContext(ChatContext);

  const navigateToChat = () => {
    setIsOpen(false);
    handleOpenChat(data?.contact_id_encrypt);
    navigate(`/dashboard/user/${data?.contact_id_encrypt}/chat`, {
      state: data,
    });
  };
  const { removeContactMutation } = useGroups();
  const [loadingStates, setLoadingStates] = useState({});

  const handleRemoveContact = async (event) => {
    event.stopPropagation();
    setLoadingStates((prev) => ({ ...prev, [data?.id]: "removing" }));
    try {
      const res = await removeContactMutation.mutateAsync(data?.id);
      if (res) {
        if (chatUserData?.contact_id_encrypt === data?.contact_id) {
          setSelectedChatUser(null);
        }
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [data?.id]: null }));
    }
  };

  return (
    <li
      key={data?.id}
      onClick={navigateToChat}
      className={`cursor-pointer flex gap-[10px] hover:bg-gray-800 ${
        chatUserData?.contact_id_encrypt === data?.contact_id_encrypt &&
        "bg-gray-800"
      } group items-center p-3 font-medium relative`}
    >
      <figure className="relative w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-black font-bold">
        <img
          src={
            data?.image
              ? `${import.meta.env.VITE_BASE_URL}${data?.image}`
              : logoIcon
          }
          alt={data?.contact_name?.split("")[0]}
          className="rounded-full"
        />
        <span
          className={`${
            data?.contact_status === "active"
              ? "bg-green-500"
              : data?.contact_status === "pending"
              ? "bg-red-500"
              : data?.contact_status === "busy"
              ? "bg-yellow"
              : "bg-gray-400"
          } w-3 h-3 absolute bottom-[-2%] right-[5%] rounded-full border-[2px] border-white`}
        ></span>
      </figure>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{data?.contact_name}</p>
        <small className="text-xs text-gray-400 truncate">
          {maskPhone(data?.contact_phone)}
        </small>
        {typingUsers[Number(data?.contact_id)] && (
          <div className="text-green-400 text-[10px]">Typing...</div>
        )}
      </div>

      {/* Unread badge at extreme end */}
      {unread > 0 && (
        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full transition-all duration-300 group-hover:translate-x-0">
          {unread}
        </span>
      )}

      <div className="flex items-center">
        {/* Delete button that appears on hover and pushes the unread badge */}
        <button
          onClick={handleRemoveContact}
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform group-hover:scale-100 scale-90 w-0 group-hover:w-max group-hover:mr-2 overflow-hidden"
          disabled={loadingStates[data?.id] === "removing"}
          title="Remove contact"
        >
          {loadingStates[data?.id] === "removing" ? (
            <FaSpinner className="animate-spin text-white text-sm" />
          ) : (
            <MdDelete className="text-gray-400 hover:text-red-500 transition-colors duration-200" />
          )}
        </button>
      </div>
    </li>
  );
}

export default React.memo(SideBarItemTwo);
