import { toast } from "react-toastify";
import { FaCommentDots, FaPhoneAlt, FaUsers } from "react-icons/fa";

export const onNewNotificationToast = ({
  groupName,
  senderName,
  message,
  type = "message", // "message" | "call"
  onClick = () => {},
}) => {
  const isCall = type === "call";
  const isGroup = Boolean(groupName);

  const toastComponent = (
    <div
      className="flex items-start gap-3 cursor-pointer w-[380px] max-w-full p-4 rounded-lg shadow-lg bg-[#1b1f1b] border border-[#3a4a3a] hover:bg-[#232823] transition"
      onClick={onClick}
    >
      {/* Avatar / Icon section */}
      <div className="flex-shrink-0">
        {isCall ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-900 border border-green-600">
            <FaPhoneAlt className="text-green-400 text-lg" />
          </div>
        ) : isGroup ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-900 border border-green-600">
            <FaUsers className="text-green-400 text-lg" />
          </div>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-olive-900 border border-olive-600">
            <FaCommentDots className="text-olive-300 text-lg" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col leading-snug overflow-hidden">
        {/* Group name */}
        {isGroup && (
          <p className="text-[12px] uppercase tracking-wide font-bold text-gray-400 mb-1">
            {groupName}
          </p>
        )}

        {/* Sender + message */}
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-green-300">
            {senderName}
          </span>
          <span className="text-sm text-gray-200 break-words line-clamp-2">
            {isCall
              ? "📞 Incoming Secure Call"
              : message || "New encrypted message"}
          </span>
        </div>
      </div>
    </div>
  );

  toast(toastComponent, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    className: "bg-transparent shadow-none m-2",
  });
};
