import { useState } from "react";
import CountdownTime from "./CountdownTimer";
import { FaVideo } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import Modal from "../../modal/Modal";
import AddUsersToMeeting from "../../dashboard/AddUsersToMeeting";

const MeetingList = ({
  meetings = [],
  onMeetingClick,
  showCountdown = false,
  showSource = false,
  onEditMeeting,
  loading = false, // ← Add this prop
}) => {
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const toggleDropdown = (id) => {
    setDropdownOpenId((prev) => (prev === id ? null : id));
  };

  const handleAddUsers = (e, meeting) => {
    e.stopPropagation();
    setSelectedMeeting(meeting);
    setShowModal(true);
    setDropdownOpenId(null);
  };

  // Show loader if loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show empty state if not loading and no meetings
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
        const isMyMeeting = meeting?._source !== "Invited";
        const id = meeting?.id || meeting?.meeting_id;

        return (
          <div
            key={id}
            onClick={() => onMeetingClick(meeting)}
            onMouseLeave={() => setDropdownOpenId(null)}
            className="relative cursor-pointer bg-gray-800 min-h-28 hover:bg-gray-700 hover:scale-[1.01] transition-all duration-200 rounded-xl p-5 shadow-md overflow-visible z-10"
          >
            {isMyMeeting && (
              <div className="absolute top-1 right-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(id);
                  }}
                  className="p-1 hover:bg-white/10 rounded-full"
                >
                  <BsThreeDotsVertical size={18} />
                </button>

                {dropdownOpenId === id && (
                  <div className="absolute right-0 mt-1 w-36 bg-white text-sm text-black rounded-md shadow-lg z-[50000]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditMeeting(meeting);
                        setDropdownOpenId(null);
                      }}
                      className="w-full px-4 py-1 text-left hover:bg-gray-200 rounded-md"
                    >
                      Update
                    </button>
                    <button
                      onClick={(e) => handleAddUsers(e, meeting)}
                      className="w-full px-4 py-1 text-left hover:bg-gray-200 text-green-600 rounded-md"
                    >
                      Add Users
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpenId(null);
                      }}
                      className="w-full px-4 py-1 text-left hover:bg-gray-200 text-red-600 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1 flex gap-2 items-center">
                  <FaVideo className="text-green-400 text-2xl" />
                  {meeting?.title || "Untitled Meeting"}
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

      {showModal && (
        <Modal isOpen={showModal} closeModal={() => setShowModal(false)}>
          <AddUsersToMeeting selectedMeeting={selectedMeeting} />
        </Modal>
      )}
    </div>
  );
};

export default MeetingList;
