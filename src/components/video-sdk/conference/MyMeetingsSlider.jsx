import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import CountdownTimer from './CountdownTimer';

const MyMeetingsSlider = ({ title, meetings, showCountdown = false }) => {
  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Swiper
        spaceBetween={15}
        navigation={true}
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="p-3"
      >
        {meetings.map((meeting) => (
          <SwiperSlide key={meeting.id} className="w-full md:min-w-60">
            <div className="bg-oliveLight p-4 rounded-md shadow-md hover:bg-oliveLight/90 cursor-pointer transition-all duration-200">
              <p className="font-semibold text-lg mb-1">{meeting.title}</p>
              <p className="text-gray-400 text-sm mb-1">{meeting.agenda}</p>
              <p className="text-sm text-white mb-1">
                {new Date(meeting.startdatetime).toLocaleString()}
              </p>
              {showCountdown && (
                <CountdownTimer startTime={meeting.startdatetime} />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MyMeetingsSlider;
