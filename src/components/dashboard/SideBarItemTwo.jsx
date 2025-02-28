import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext"; // Import Chat Context

function SideBarItemTwo({ data, setIsOpen }) {
    const navigate = useNavigate();
    const { setSelectedChatUser, selectedChatUser } = useContext(ChatContext); // Use context

    const navigateToChat = () => {
        setSelectedChatUser(data); // Save selected user to context
        setIsOpen(false);
    };

    return (
        <li
            key={data?.id}
            onClick={navigateToChat}
            className={`cursor-pointer flex gap-[10px] hover:bg-gray-800 ${selectedChatUser?.id === data?.id && "bg-gray-800"} group items-center p-3 font-medium`}
        >
            <Link className="flex items-center gap-3">
                <figure className="relative w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-black font-bold">
                    <img src={data?.image} alt={data?.contact_name?.split("")[0]} className="rounded-full" />
                    <span className={`${
                        data?.contact_status === "active" ? "bg-green-500" :
                        data?.contact_status === "pending" ? "bg-red-500" :
                        data?.contact_status === "busy" ? "bg-yellow" :
                        "bg-gray-400"
                    } w-3 h-3 absolute bottom-[-2%] right-[5%] rounded-full border-[2px] border-white`}></span>
                </figure>
                <div>
                    <p>{data?.contact_name}</p>
                    <small>{data?.contact_phone}</small>
                </div>
            </Link>
        </li>
    );
}

export default React.memo(SideBarItemTwo);
