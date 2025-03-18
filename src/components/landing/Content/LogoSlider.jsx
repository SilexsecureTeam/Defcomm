import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode, Autoplay } from "swiper/modules";

function LogoSlider({ images }) {
  return (
    <div className="flex-1 relative w-full overflow-auto">
      <div className="w-full border border-lime-400 rounded-lg shadow-lg p-2">
        <Swiper
          spaceBetween={20} // Spacing between images
          slidesPerView={4} // Ensures images spread dynamically
          loop={true}
          freeMode={false} // Prevents uncontrolled sliding
          autoplay={{
            delay: 2000, // Ensures one-by-one movement
            disableOnInteraction: false,
          }}
          speed={1000} // Smooth transition
          modules={[FreeMode, Autoplay]}
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} className="flex-1 flex justify-center">
              <img
                src={img}
                alt={`Logo ${i + 1}`}
                className="h-20 w-20 object-contain transition-transform duration-300 hover:scale-110"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default LogoSlider;
