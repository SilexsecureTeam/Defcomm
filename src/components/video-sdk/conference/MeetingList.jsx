import { useState } from "react";
import CountdownTime from "./CountdownTimer";
import { FaVideo } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const MeetingList = ({
  meetings = [],
  onMeetingClick,
  showCountdown = false,
  showSource = false,
  onEditMeeting
}) => {
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const toggleDropdown = (id) => {
    setDropdownOpenId(prev => (prev === id ? null : id));
  };
  if (!meetings.length) {
    return (
      <p className="text-center text-gray-400 italic py-6">
        No meetings available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => {
        const startDate = new Date(meeting.startdatetime);
        const formattedDate = startDate.toLocaleString();

        return (
          <div
            key={meeting?.id}
            onClick={() => onMeetingClick(meeting)}
            onMouseLeave={()=>setDropdownOpenId(null)}
            className="relative cursor-pointer bg-gray-800 hover:bg-gray-700 hover:scale-[1.01] transition-all duration-200 rounded-xl p-5 shadow-md"
          >
            {meeting?._source !== "Invited" && <div className="absolute top-1 right-2 z-[100]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(meeting?.id || meeting?.meeting_id);
                }}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <BsThreeDotsVertical size={18} />
              </button>
              {/* Dropdown menu */}
              {dropdownOpenId === (meeting?.id || meeting?.meeting_id) && (
                <div
                  onClick={(e) => { e.stopPropagation(); onEditMeeting(meeting); setDropdownOpenId(null) }}
                  className="absolute right-0 w-36 bg-white text-sm text-black rounded-md shadow-lg z-20"
                >
                  <button
                    onClick={() => {
                      setDropdownOpenId(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-200 rounded-md"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpenId(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-200 text-red-600 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1 flex gap-2 items-center">
                  <FaVideo className="text-green-400 text-2xl" /> {meeting?.title || "Untitled Meeting"}
                </h3>
                <p className="text-sm text-gray-400">
                  {formattedDate}
                  {showSource && meeting?._source && (
                    <span className="text-gray-500"> · {meeting?._source}</span>
                  )}
                </p>
              </div>
              {showCountdown && (
                <div className="text-green-400 text-sm mt-2 md:mt-0">
                  <CountdownTime startTime={startDate} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MeetingList;
