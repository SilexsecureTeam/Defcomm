import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';

const MyMeetingsSlider = ({ title, meetings, showCountdown = false, onMeetingClick }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const sliderId = title.toLowerCase().replace(/\s+/g, '-'); // e.g., "upcoming-meetings"

  return (
    <div className="relative w-full mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

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
          1024: { slidesPerView: 3 },
        }}
        className="p-3"
      >
        {meetings.map((meeting, index) => (
          <SwiperSlide key={meeting.id} className="w-full md:min-w-60">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onMeetingClick?.(meeting)}
              className="bg-oliveLight/50 hover:bg-oliveLight p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200"
            >
              <p className="font-semibold text-lg mb-1">{meeting.title}</p>
              <p className="text-sm text-gray-400 mb-1">{meeting.agenda}</p>
              <p className="text-sm text-white mb-1">
                {new Date(meeting.startdatetime).toLocaleString()}
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
            isBeginning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'
          }`}
          disabled={isBeginning}
        >
          <AiOutlineLeft size={20} />
        </button>
        <button
          className={`next-btn-${sliderId} p-2 border border-white rounded-full transition-all duration-300 ${
            isEnd ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'
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
