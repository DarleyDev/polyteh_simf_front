"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "./styles.css";

export default function SwiperInner() {
  const [slides, setSlides] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/slidesall/slides`);
        const data = await response.json();
        if (response.ok) {
          setSlides(data);
          setError("");
        } else {
          setError("Не удалось загрузить слайды");
        }
      } catch (err) {
        setError("Ошибка при загрузке слайдов");
        console.error("Fetch Slides Error:", err);
      }
    };

    fetchSlides();
  }, []);

  return (
    <>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : slides.length > 0 ? (
        <Swiper
          navigation={true}
          modules={[Navigation, Autoplay]}
          className="mySwiper"
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="slide-image-container">
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}${slide.imagelink}`}
                  alt={`Slide ${index + 1}`}
                  className="slide-image"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-gray-500 text-center">Загрузка слайдов...</p>
      )}
    </>
  );
}