import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { Autoplay } from "swiper/modules";

function LogoSlider({ images }) {
  return (
    <div className="flex-1 relative w-full overflow-hidden">
      <div className="w-full border border-lime-400 rounded-lg shadow-lg p-2">
        <Swiper
          loop={true}
          loopFillGroupWithBlank={true} // ✅ Prevents empty spaces
          centeredSlides={false} // ✅ Ensures proper alignment
          slidesPerGroup={1} // ✅ Moves slides one by one
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          speed={1000}
          modules={[Autoplay]}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 15 },
            480: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 25 },
            1024: { slidesPerView: 5, spaceBetween: 30 },
          }}
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} className="flex justify-center">
              <img
                src={img}
                alt={`Logo ${i + 1}`}
                className="h-24 w-24 object-contain transition-transform duration-300 hover:scale-110"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default LogoSlider;
