import { useState, useRef } from "react";
import CountdownTime from "./CountdownTimer";
import { FaVideo, FaUsers, FaShareAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdContentCopy, MdCheck, MdLink } from "react-icons/md";
import { HiClock } from "react-icons/hi";
import Modal from "../../modal/Modal";
import AddUsersToMeeting from "../../dashboard/AddUsersToMeeting";
import { formatUtcToLocal } from "../../../utils/formmaters";
import Dropdown from "./Dropdown";
import { createPortal } from "react-dom";
import { onSuccess } from "../../../utils/notifications/OnSuccess";

const MeetingList = ({
  meetings = [],
  onMeetingClick,
  showCountdown = false,
  showSource = false,
  onEditMeeting,
  loading = false,
}) => {
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const buttonRefs = useRef({});

  const toggleDropdown = (id) =>
    setDropdownOpenId((prev) => (prev === id ? null : id));

  const handleAddUsers = (e, meeting) => {
    e.stopPropagation();
    setSelectedMeeting(meeting);
    setShowModal(true);
    setDropdownOpenId(null);
  };

  const handleCopyLink = (e, meeting) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${meeting.meeting_link}/${meeting.id}`);
    setCopiedId(meeting.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareMeeting = async (e, meeting) => {
    e.stopPropagation();

    const meetingId = meeting?.meeting_id || meeting?.id;
    const shareUrl = `https://meet.defcomm.ng?meetingId=${meetingId}`;
    const formattedDate = formatUtcToLocal(meeting.startdatetime);

    const shareText = `𝐘𝐨𝐮 𝐚𝐫𝐞 𝐢𝐧𝐯𝐢𝐭𝐞𝐝 𝐭𝐨 𝐣𝐨𝐢𝐧 𝐚 𝐃𝐞𝐟𝐂𝐨𝐦𝐦 𝐦𝐞𝐞𝐭𝐢𝐧𝐠.

𝐒𝐮𝐛𝐣𝐞𝐜𝐭: ${meeting?.title || "Meeting"}
𝐃𝐚𝐭𝐞 & 𝐓𝐢𝐦𝐞: ${formattedDate}
𝐌𝐞𝐞𝐭𝐢𝐧𝐠 𝐈𝐃: ${meetingId}

𝐉𝐨𝐢𝐧 𝐌𝐞𝐞𝐭𝐢𝐧𝐠:
${shareUrl}
`;

    try {
      if (navigator.share) {
        // ✅ Use only text so platforms are forced to include it.
        await navigator.share({
          title: meeting?.title || "DefComm Meeting",
          text: shareText,
          // no `url` here – it's already inside text
        });
      } else {
        // 🔁 Fallback: copy full invite text
        await navigator.clipboard.writeText(shareText);
        onSuccess({
          message: "Invitation Copied",
          success: "You can now paste the invite into any app.",
        });
      }
    } catch (err) {
      // user cancelled or environment doesn't support share properly
      console.error("Share action cancelled or failed:", err);
    }
  };

  const getMeetingStatus = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const timeUntilStart = start - now;

    if (timeUntilStart > 24 * 60 * 60 * 1000) return "upcoming";
    if (timeUntilStart > 0) return "starting-soon";
    return "live";
  };

  const StatusBadge = ({ startTime, source, compact = false }) => {
    const status = getMeetingStatus(startTime);
    const statusConfig = {
      upcoming: { color: "bg-blue-500", text: "Upcoming" },
      "starting-soon": { color: "bg-amber-500", text: "Soon" },
      live: { color: "bg-green-500", text: "Live" },
    };

    const { color, text } = statusConfig[status];

    return (
      <div className={`flex items-center gap-1 ${compact ? "text-xs" : ""}`}>
        <span
          className={`${color} text-white text-xs font-medium px-2 py-1 rounded-full`}
        >
          {compact && text === "Starting Soon" ? "Soon" : text}
        </span>
        {showSource && source && (
          <span className="bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded-full border border-gray-500">
            {source}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium">
            Loading meetings...
          </p>
        </div>
      </div>
    );
  }

  if (!meetings.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
          <FaVideo className="text-gray-400 text-xl" />
        </div>
        <p className="text-gray-400 font-medium mb-1">No meetings scheduled</p>
        <p className="text-gray-500 text-sm">Meetings will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => {
        const formattedDate = formatUtcToLocal(meeting.startdatetime);
        const isMyMeeting = meeting?._source !== "Invited";
        const id = meeting?.id || meeting?.meeting_id;
        const status = getMeetingStatus(meeting.startdatetime);

        return (
          <div
            key={id}
            onClick={() => onMeetingClick(meeting)}
            onMouseLeave={() => setDropdownOpenId(null)}
            className={`relative group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
              status === "live"
                ? "border-green-500/20 bg-gray-900/50 hover:bg-gray-800/50"
                : status === "starting-soon"
                ? "border-amber-500/20 bg-gray-900/50 hover:bg-gray-800/50"
                : "border-gray-600 bg-gray-900/30 hover:bg-gray-800/30"
            } cursor-pointer`}
          >
            {/* Status Indicator & Icon Combined */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                className={`w-2 h-2 rounded-full ${
                  status === "live"
                    ? "bg-green-500 animate-pulse"
                    : status === "starting-soon"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
              />
              <div
                className={`p-2 rounded-lg ${
                  status === "live"
                    ? "bg-green-500/20"
                    : status === "starting-soon"
                    ? "bg-amber-500/20"
                    : "bg-blue-500/20"
                }`}
              >
                <FaVideo
                  className={`text-sm ${
                    status === "live"
                      ? "text-green-400"
                      : status === "starting-soon"
                      ? "text-amber-400"
                      : "text-blue-400"
                  }`}
                />
              </div>
            </div>

            {/* Meeting Details - Compact */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate leading-tight">
                    {meeting?.title || "Untitled Meeting"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <HiClock size={12} />
                      <span>{formattedDate}</span>
                    </div>
                    {meeting.duration && (
                      <span className="text-gray-500 text-xs">
                        • {meeting.duration}m
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => handleCopyLink(e, meeting)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      copiedId === meeting.id
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-700/50 text-gray-400 hover:bg-gray-600 hover:text-white"
                    }`}
                    title={copiedId === meeting.id ? "Copied!" : "Copy link"}
                  >
                    {copiedId === meeting.id ? (
                      <MdCheck size={16} />
                    ) : (
                      <MdLink size={16} />
                    )}
                  </button>
                  <button
                    title="Share with other users"
                    onClick={(e) => handleShareMeeting(e, meeting)}
                    className="p-1.5 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-600 hover:text-white transition-colors"
                  >
                    <FaShareAlt size={16} />
                  </button>
                  {isMyMeeting && (
                    <button
                      ref={(el) => (buttonRefs.current[id] = el)}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(id);
                      }}
                      className="p-1.5 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      <BsThreeDotsVertical size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Metadata Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge
                    startTime={meeting.startdatetime}
                    source={showSource ? meeting?._source : null}
                    compact
                  />
                  {meeting.participants && (
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <FaUsers size={10} />
                      <span>{meeting.participants}</span>
                    </div>
                  )}
                </div>

                {/* Countdown - Mobile Optimized */}
                {showCountdown && (
                  <div className="text-xs">
                    <CountdownTime startTime={meeting?.startdatetime} compact />
                  </div>
                )}
              </div>
            </div>

            {/* Dropdown Portal */}
            {isMyMeeting &&
              dropdownOpenId === id &&
              createPortal(
                <Dropdown
                  parentRef={buttonRefs.current[id]}
                  meeting={meeting}
                  onEditMeeting={onEditMeeting}
                  handleAddUsers={handleAddUsers}
                  close={() => setDropdownOpenId(null)}
                />,
                document.body
              )}
          </div>
        );
      })}

      {/* Add Users Modal */}
      {showModal && (
        <Modal isOpen={showModal} closeModal={() => setShowModal(false)}>
          <AddUsersToMeeting selectedMeeting={selectedMeeting} />
        </Modal>
      )}
    </div>
  );
};

export default MeetingList;
