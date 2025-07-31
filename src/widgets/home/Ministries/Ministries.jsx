"use client";

import style from "./Ministries.module.scss";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./Navigation.scss";
import ArrowLeft from "@public/assets/icons/arrow_left.svg";
import ArrowRight from "@public/assets/icons/arrow_right.svg";
import useMediaQuery from "@app/hooks/useMediaQuery";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

function Ministries() {
  const [ministries, setMinistries] = useState([]);
  const sliderNavigationLeft = useRef(null);
  const sliderNavigationRight = useRef(null);

  const isMobile = useMediaQuery("(max-width: 550px)");
  const isSmallDevice = useMediaQuery("(max-width: 768px)");
  const slidesPerView = (isMobile && 1) || (isSmallDevice && 2) || 4;
  const NEXT_SERVER = `${process.env.NEXT_PUBLIC_SERVER_URL}/minmain`;

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await fetch(`${NEXT_SERVER}/ministries`);
        const data = await response.json();
        if (response.ok) {
          setMinistries(data);
        } else {
          console.error("Failed to fetch ministries:", data.message);
        }
      } catch (err) {
        console.error("Error fetching ministries:", err);
      }
    };
    fetchMinistries();
  }, [NEXT_SERVER]);

  const slides = () => {
    return ministries.map(({ url, text, sourceImage }, index) => (
      <SwiperSlide
        key={index}
        onMouseEnter={(e) => {
          const element = e.currentTarget;
          const popup = element.querySelector(`.${style.popupCard}`);
          if (popup) popup.classList.add(style.popupCardActive);
        }}
        onMouseLeave={(e) => {
          const element = e.currentTarget;
          const popup = element.querySelector(`.${style.popupCard}`);
          if (popup && !popup.classList.contains(style.popupCard)) return;
          popup.classList.remove(style.popupCardActive);
        }}
        className={style.slide}
      >
        <img
          className={style.popupImage}
          src={sourceImage}
          alt="Логотип"
          placeholder="blur"
        />
        <Link target="_blank" href={url}>
          <div className={style.popupCard}>
            <div className={style.popupText}>{text}</div>
          </div>
        </Link>
      </SwiperSlide>
    ));
  };

  return (
    <>
      <div className={style.delimiter}></div>
      <section className={style.ministries}>
        <ArrowLeft className={style.sliderLeft} ref={sliderNavigationLeft} />
        <Swiper
          className={style.slider}
          navigation={{
            prevEl: `.${style.sliderLeft}`,
            nextEl: `.${style.sliderRight}`,
          }}
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={slidesPerView}
        >
          {slides()}
        </Swiper>
        <ArrowRight className={style.sliderRight} ref={sliderNavigationRight} />
      </section>
    </>
  );
}

export default Ministries;