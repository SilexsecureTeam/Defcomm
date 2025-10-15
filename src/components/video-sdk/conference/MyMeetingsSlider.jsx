import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";
import { FaVideo } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { formatUtcToLocal } from "../../../utils/formmaters";

const MyMeetingsSlider = ({
  title,
  meetings,
  showCountdown = false,
  onMeetingClick,
  showSource = false,
  loading = false,
  onEditMeeting,
}) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const toggleDropdown = (id) => {
    setDropdownOpenId((prev) => (prev === id ? null : id));
  };

  const sliderId = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="relative w-full mb-8 text-white">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {loading ? (
        <div className="text-center py-8 text-gray-300">
          <div className="animate-pulse">Loading meetings...</div>
        </div>
      ) : meetings.length > 0 ? (
        <>
          <Swiper
            spaceBetween={15}
            navigation={{
              nextEl: `.next-btn-${sliderId}`,
              prevEl: `.prev-btn-${sliderId}`,
            }}
            modules={[Navigation]}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              750: { slidesPerView: 1 },
              900: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="p-3"
          >
            {meetings.map((meeting, index) => (
              <SwiperSlide
                key={meeting.id || meeting.meeting_id}
                className="w-full md:min-w-60"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => onMeetingClick(meeting)}
                  className="relative bg-oliveLight/50 hover:bg-oliveLight p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200"
                >
                  {/* Three-dot menu icon */}
                  {meeting._source !== "Invited" && (
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(meeting.id || meeting.meeting_id);
                        }}
                        className="p-1 hover:bg-white/10 rounded-full"
                      >
                        <BsThreeDotsVertical size={18} />
                      </button>
                      {/* Dropdown menu */}
                      {dropdownOpenId ===
                        (meeting.id || meeting.meeting_id) && (
                        <div className="absolute right-0 mt-2 w-36 bg-white text-black rounded-md shadow-lg z-20 font-medium text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditMeeting(meeting);
                              setDropdownOpenId(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
                          >
                            Update
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpenId(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {showSource && meeting._source && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs border font-bold border-oliveHover text-oliveHover">
                      {meeting._source}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-1 pr-2">
                    <FaVideo className="text-green-400 text-2xl" />
                    <p className="font-semibold text-lg line-clamp-1">
                      {meeting.title}
                    </p>
                  </div>

                  <p className="text-sm text-gray-400 mb-1 line-clamp-1">
                    {meeting.agenda}
                  </p>
                  <p className="text-sm text-white mb-1">
                    {formatUtcToLocal(meeting.startdatetime)}
                  </p>

                  {showCountdown && (
                    <CountdownTimer startTime={meeting.startdatetime} />
                  )}
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              className={`prev-btn-${sliderId} p-2 border border-white rounded-full transition-all duration-300 ${
                isBeginning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white hover:text-black"
              }`}
              disabled={isBeginning}
            >
              <AiOutlineLeft size={20} />
            </button>
            <button
              className={`next-btn-${sliderId} p-2 border border-white rounded-full transition-all duration-300 ${
                isEnd
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white hover:text-black"
              }`}
              disabled={isEnd}
            >
              <AiOutlineRight size={20} />
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-400 text-sm italic">
          No upcoming meetings found.
        </p>
      )}
    </div>
  );
};

export default MyMeetingsSlider;
