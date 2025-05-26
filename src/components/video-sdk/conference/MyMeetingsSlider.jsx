import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaVideo } from "react-icons/fa";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const MyMeetingsSlider = ({ meetings }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!meetings || meetings.length === 0) return null;

  return (
    <div className="relative w-full mt-10">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Recent Meetings</h2>
      <Swiper
        spaceBetween={15}
        navigation={{
          nextEl: ".my-next-btn",
          prevEl: ".my-prev-btn",
        }}
        modules={[Navigation]}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="p-3"
      >
        {meetings.map((meeting, index) => (
          <SwiperSlide key={meeting.id || meeting.meeting_id}>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FaVideo className="text-green-400 text-xl" />
                <h3 className="font-bold">{meeting.title || "Untitled Meeting"}</h3>
              </div>
              <p className="text-sm text-gray-300">{meeting.subject}</p>
              <p className="text-xs text-gray-400">{meeting.startdatetime}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          className={`my-prev-btn p-2 border border-white rounded-full transition-all duration-300 ${
            isBeginning ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:text-black"
          }`}
          disabled={isBeginning}
        >
          <AiOutlineLeft size={20} />
        </button>
        <button
          className={`my-next-btn p-2 border border-white rounded-full transition-all duration-300 ${
            isEnd ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:text-black"
          }`}
          disabled={isEnd}
        >
          <AiOutlineRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default MyMeetingsSlider;
