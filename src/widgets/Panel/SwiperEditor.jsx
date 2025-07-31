"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import Cookies from "js-cookie";

export default function SwiperInner() {
  const [slides, setSlides] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = Cookies.get("token");
  const NEXT_SERVER = `${process.env.NEXT_PUBLIC_SERVER_URL}/slidesall`;
  const swiperRef = useRef(null);

  const fetchSlides = async () => {
    try {
      const response = await fetch(`${NEXT_SERVER}/slides`);
      const data = await response.json();
      if (response.ok) {
        setSlides(data);
        setError("");
      } else {
        setError(data.message || "Не удалось загрузить слайды");
      }
    } catch (err) {
      setError("Ошибка при загрузке слайдов");
      console.error("Fetch Slides Error:", err);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
    setError("");
    setSuccess("");
  };

  const handleAddSlides = async (e) => {
    e.preventDefault();
    if (!newImages.length) {
      setError("Пожалуйста, выберите изображения");
      return;
    }
    if (!token) {
      setError("Пожалуйста, авторизуйтесь для загрузки");
      return;
    }

    const formData = new FormData();
    newImages.forEach((image) => formData.append("images", image));

    try {
      const response = await fetch(`${NEXT_SERVER}/slides`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }
      if (response.ok) {
        setSuccess("Слайды добавлены успешно");
        setNewImages([]);
        fetchSlides(); // Refresh slides
        setError("");
      } else {
        setError(data.message || "Не удалось добавить слайды");
      }
    } catch (err) {
      setError("Ошибка при добавлении слайдов");
      console.error("Add Slides Error:", err);
    }
  };

  const handleDeleteSlide = async (path) => {
    console.log("Deleting path:", path);
    if (!token) {
      setError("Пожалуйста, авторизуйтесь для удаления");
      return;
    }

    // Add confirmation alert
    if (!window.confirm("Вы уверены, что хотите удалить этот слайд?")) {
      return; // Cancel deletion if user clicks "Cancel"
    }

    // Stop autoplay when delete is initiated
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
      console.log("Autoplay stopped during deletion");
    }

    try {
      const response = await fetch(`${NEXT_SERVER}/slides?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }
      if (response.ok) {
        setSuccess("Слайд удалён успешно");
        fetchSlides(); // Refresh slides
        setError("");
      } else {
        setError(data.message || "Не удалось удалить слайд");
      }
    } catch (err) {
      setError("Ошибка при удалении слайда");
      console.error("Delete Slide Error:", err);
    } finally {
      // Resume autoplay after deletion (successful or failed)
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.autoplay.start();
        console.log("Autoplay resumed");
      }
    }
  };

  useEffect(() => {
    console.log("slides", slides);
    if (slides.length > 0 && swiperRef.current) {
      swiperRef.current.swiper.update();
      console.log("Swiper navigation updated");
    }
  }, [slides]);

  useEffect(() => {
    console.log("slides", slides);
  }, [slides]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Слайд-шоу постера</h1>

      {slides.length > 0 && (
        <Swiper
          ref={swiperRef}
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
                {editMode && (
                  <button
                    onClick={() => handleDeleteSlide(slide.imagelink)}
                    className="mt-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Edit Panel */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        <button
          onClick={() => setEditMode(!editMode)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {editMode ? "Сохранить и выйти" : "Редактировать"}
        </button>
        {editMode && (
          <form onSubmit={handleAddSlides} className="space-y-4">
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
              Добавить изображения
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full mb-4 text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              title="Выберите изображения для добавления в слайд-шоу"
            />
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <button
              type="submit"
              disabled={!token}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400"
            >
              Добавить слайды
            </button>
          </form>
        )}
      </div>
    </div>
  );
}