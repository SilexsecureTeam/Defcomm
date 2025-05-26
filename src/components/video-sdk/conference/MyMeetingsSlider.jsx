// components/conference/MyMeetingsSlider.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FaVideo } from "react-icons/fa";

const MyMeetingsSlider = ({ meetings }) => {
  if (!meetings || meetings.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Your Recent Meetings</h2>
      <Swiper
        spaceBetween={16}
        slidesPerView={1.2}
        navigation
        modules={[Navigation]}
        className="w-full"
      >
        {meetings.map((meeting) => (
          <SwiperSlide key={meeting.id}>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center gap-4">
              <FaVideo className="text-green-400 text-2xl" />
              <div>
                <p className="font-semibold">{meeting.title || "Untitled"}</p>
                <p className="text-sm text-gray-300">{meeting.subject}</p>
                <p className="text-xs text-gray-400">{meeting.startdatetime}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MyMeetingsSlider;
