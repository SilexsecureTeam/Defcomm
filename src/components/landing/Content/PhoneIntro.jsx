import {useRef, useEffect} from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { EffectFade, Autoplay } from "swiper/modules";
import phoneBack from "../../../assets/landing/phone1.png";
import phoneFront from "../../../assets/landing/phone2.png";
const phoneImages = [phoneBack, phoneFront];

const PhoneIntro = () => {

const swiperRef=useRef(null);
  
useEffect(()=>{
  const timer =setTimeout(()=>{
    if(swiperRef.current){
      swiperRef.current.swiper.slideNext(); //Manually move to the next slide
    }
  }, 500);

  return ()=>clearTimeout(timer);
},[])

  return (
    <div className="relative flex justify-center items-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bg-white opacity-10 rounded-full blur-3xl"></div>

      <Swiper
      ref={swiperRef}
        modules={[EffectFade, Autoplay]}
        effect="fade"
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop
        speed={1500} // Smooth transitions
        simulateTouch={true}
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
