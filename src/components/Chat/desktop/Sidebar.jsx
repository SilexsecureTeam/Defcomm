import mainLogo from "../../../assets/logo-icon.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { RiGroup3Line } from "react-icons/ri";
import { AiOutlineVideoCamera } from "react-icons/ai";
import {
  IoCalendarClearOutline,
  IoCallOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { useContext, useState } from "react";
import { ChatContext } from "../../../context/ChatContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const [active, setActive] = useState("msg");
  const { setShowSettings, setShowCall, setCallType, setShowContactModal } =
    useContext(ChatContext);

  const location = useLocation();
  const chatUserData = location?.state;
  const handleClick = (id) => {
    // block call if not in a chat
    if (id === "video" || id === "call") {
      alert("You can only start a call from an active chat.");
      return;
    }

    setActive(id);

    switch (id) {
      case "group":
        setShowContactModal(true);
        break;
      case "video":
        setModalTitle("Place a Call");
        setShowCall(true);
        setCallType("video");
        break;
      case "call":
        setModalTitle("Place a Call");
        setShowCall(true);
        break;
      case "walkie":
        navigate("/dashboard/comm");
        break;
      case "settings":
        setShowSettings(true);
        break;
      default:
        break;
    }
  };

  const icons = [
    { id: "msg", icon: <BiSolidMessageSquareDetail size={20} /> },
    { id: "group", icon: <RiGroup3Line size={20} /> },
    {
      id: "video",
      icon: <AiOutlineVideoCamera size={20} />,
      disabled: !!chatUserData?.group_id,
    },
    {
      id: "call",
      icon: <IoCallOutline size={20} />,
      disabled: !!chatUserData?.group_id,
    },
    { id: "calendar", icon: <IoCalendarClearOutline size={20} /> },
    { id: "settings", icon: <IoSettingsOutline size={20} /> },
  ];

  return (
    <div className="w-20 bg-transparent flex flex-col items-center py-4 space-y-6">
      <Link to="/dashboard/home">
        <img src={mainLogo} alt="logo" className="w-14" />
      </Link>
      <div className="flex-1 flex flex-col justify-center items-center py-4 space-y-6">
        {icons.map(({ id, icon, disabled }) => (
          <p
            key={id}
            onClick={() => !disabled && handleClick(id)}
            className={`p-2 rounded-lg cursor-pointer transition-all ${
              disabled
                ? "opacity-50 cursor-not-allowed hidden"
                : active === id
                ? "bg-white text-olive"
                : "hover:bg-white hover:text-olive text-white"
            }`}
          >
            {icon}
          </p>
        ))}
      </div>
    </div>
  );
}
