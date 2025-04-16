import { useContext } from "react"
import { FaPhoneAlt, FaVideo } from "react-icons/fa";
import { ChatContext } from "../../../context/ChatContext";
import logoIcon from "../../../assets/logo-icon.png";
export default function ChatHeader() {
    const { selectedChatUser, setSelectedChatUser } = useContext(ChatContext);
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {selectedChatUser ? 
            <div className="flex items-center space-x-4">
                <figure className="relative w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-black font-bold">
                    <img src={selectedChatUser?.image ? `${import.meta.env.VITE_BASE_URL}${selectedChatUser?.image}` : logoIcon} alt={selectedChatUser?.contact_name?.split("")[0]} className="rounded-full" />
                    <span className={`${selectedChatUser?.contact_status === "active" ? "bg-green-500" :
                        selectedChatUser?.contact_status === "pending" ? "bg-red-500" :
                            selectedChatUser?.contact_status === "busy" ? "bg-yellow" :
                                "bg-gray-400"
                        } w-3 h-3 absolute bottom-[-2%] right-[5%] rounded-full border-[2px] border-white`}></span>
                </figure>
                <div>
                    <div className="font-semibold">{selectedChatUser?.contact_name}</div>
                    <div className="text-green-400 text-sm">Typing...</div>
                </div>
            </div>:
            <p className="font-bold text-lg">Chat</p>}
            <div className="flex space-x-4 text-green-400">
                <FaPhoneAlt />
                <FaVideo />
            </div>
        </div>
    );
}
