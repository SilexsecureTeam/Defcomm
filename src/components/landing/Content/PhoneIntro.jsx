import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { EffectFade, Autoplay } from "swiper/modules";
import phoneBack from "../../../assets/landing/phone1.png";
import phoneFront from "../../../assets/landing/phone2.png";
// import phoneRight from "../../../assets/landing/phone3.png";
// import phoneBack from "../../../assets/landing/phone4.png";

const phoneImages = [phoneBack, phoneFront];

const PhoneIntro = () => {
  return (
    <div className="relative flex justify-center items-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bg-white opacity-10 rounded-full blur-3xl"></div>

      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        speed={1500} // Smooth transitions
        lazyPreloadPrevNext={1}
        preloadImages={true}
        className="w-full flex justify-center"
      >
        {phoneImages.map((src, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <img
              src={src}
              alt="Premium Phone Display"
              className="h-96 lg:h-[500px] drop-shadow-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PhoneIntro;
