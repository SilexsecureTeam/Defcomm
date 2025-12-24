import { FaWhatsapp, FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import { MdClose, MdContentCopy, MdCheck } from "react-icons/md";
import { useEffect, useState } from "react";

const ShareMeetingModal = ({ inviteText, onClose }) => {
  const [copied, setCopied] = useState(false);
  const encodedText = encodeURIComponent(inviteText);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const shareOptions = [
    {
      label: "WhatsApp",
      icon: <FaWhatsapp size={22} />,
      action: () => window.open(`https://wa.me/?text=${encodedText}`, "_blank"),
      bg: "bg-green-600/15",
      text: "text-green-400",
      ring: "ring-green-500/30",
    },
    {
      label: "Telegram",
      icon: <FaTelegramPlane size={22} />,
      action: () =>
        window.open(`https://t.me/share/url?text=${encodedText}`, "_blank"),
      bg: "bg-blue-600/15",
      text: "text-blue-400",
      ring: "ring-blue-500/30",
    },
    {
      label: "Email",
      icon: <FaEnvelope size={22} />,
      action: () =>
        window.open(
          `mailto:?subject=DefComm Meeting Invitation&body=${encodedText}`,
          "_blank"
        ),
      bg: "bg-gray-600/20",
      text: "text-gray-300",
      ring: "ring-gray-500/30",
    },
  ];

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative w-[90vw] max-w-lg rounded-2xl bg-oliveDark border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-semibold text-base">
              Share meeting
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Send invite via messaging or email
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Close"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* Share targets */}
          <div className="grid grid-cols-3 gap-4">
            {shareOptions.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`group flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition
                  ${item.bg} ${item.text} ring-1 ${item.ring}
                  hover:scale-[1.03] hover:ring-2`}
              >
                <div className="p-3 rounded-full bg-black/20 group-hover:bg-black/30 transition">
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="my-5 h-px bg-white/10" />

          {/* Copy invite */}
          <button
            onClick={copyInvite}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-white/5 text-gray-200 hover:bg-white/10 transition"
          >
            {copied ? (
              <>
                <MdCheck className="text-green-400" />
                Copied
              </>
            ) : (
              <>
                <MdContentCopy />
                Copy invite text
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareMeetingModal;
