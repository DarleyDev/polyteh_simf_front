"use client";

import ButtonIcon from "../../shared/buttons/ButtonIcon/ButtonIcon";
import door from "@public/assets/icons/door.svg?url";
import logo from "@public/assets/icons/logo.svg?url";
import bubbles from "@public/assets/images/home/bubbles.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const FirstScreenEditor = () => {
  const [collegeName, setCollegeName] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [iconPath, setIconPath] = useState(door);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasData, setHasData] = useState(true);
  const token = Cookies.get("token");
  const NEXT_SERVER = `${process.env.NEXT_PUBLIC_SERVER_URL}/firstsmain`;

  useEffect(() => {
    const fetchFirstScreenData = async () => {
      try {
        const response = await fetch(`${NEXT_SERVER}/firstscreen`);
        const data = await response.json();
        if (response.ok) {
          setCollegeName(data.collegeName || "");
          setButtonLink(data.buttonLink || "");
          setIconPath(data.iconPath ? { src: data.iconPath } : door);
          setHasData(true);
        } else if (response.status === 404) {
          setHasData(false);
        } else {
          setError("Не удалось загрузить данные");
        }
      } catch (err) {
        setError("Ошибка при загрузке данных");
        console.error("Fetch FirstScreen Error:", err);
      }
    };
    fetchFirstScreenData();
  }, [NEXT_SERVER]);

  const handleSave = async () => {
    if (!token) {
      setError("Пожалуйста, авторизуйтесь для сохранения");
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        collegeName,
        buttonLink,
        iconPath: iconPath.src || door.src,
      }).toString();
      const method = hasData ? "PUT" : "POST";
      const response = await fetch(`${NEXT_SERVER}/firstscreen?${queryParams}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setEditMode(false);
        setHasData(true);
        setSuccess("Данные успешно " + (hasData ? "обновлены" : "созданы"));
        setError("");
      } else {
        setError(data.message || "Не удалось " + (hasData ? "обновить" : "создать") + " данные");
      }
    } catch (err) {
      setError("Ошибка при " + (hasData ? "обновлении" : "создании") + " данных");
      console.error("Save FirstScreen Error:", err);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 py-8 rounded-lg overflow-hidden">
      {!editMode && hasData ? (
        <h1 className="relative z-10 text-3xl font-bold text-white mb-6 flex items-center">
          <img className="w-52 h-auto mt-8" src={iconPath.src} alt="College logo" />
          <span className="ml-4">{collegeName}</span>
        </h1>
      ) : (
        <div className="relative z-10 mb-6">
          <input
            type="text"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
            placeholder="Название колледжа"
          />
        </div>
      )}
      {!editMode && hasData ? (
        <Link href={buttonLink} className="relative z-10">
           <ButtonIcon
              text="День открытых дверей"
              iconPath={door.src}
                class="font-medium text-base mt-10 relative left-1/2 -translate-x-1/2 
              md:w-[90%] md:text-center md:py-[15px] md:flex md:justify-center"
            />
        </Link>
      ) : (
        <div className="relative z-10 space-y-2">
          <input
            type="text"
            value={buttonLink}
            onChange={(e) => setButtonLink(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
            placeholder="Ссылка на кнопку"
          />
          <input
            type="text"
            value={iconPath.src || ""}
            onChange={(e) => setIconPath(e.target.value ? { src: e.target.value } : door)}
            className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
            placeholder="Путь к иконке"
          />
        </div>
      )}
     <div>
         {token && (
        <button
          onClick={editMode ? handleSave : handleEditToggle}
          className={`relative z-10 mt-4 px-4 py-2 rounded ${editMode ? "bg-green-500 hover:bg-green-600" : "bg-green-500 hover:bg-green-600"} text-white`}
        >
          {editMode ? (hasData ? "Сохранить" : "Создать") : "Редактировать"}
        </button>
      )}
     </div>
      {error && <p className="relative z-10 mt-2 text-red-500">{error}</p>}
      {success && <p className="relative z-10 mt-2 text-green-500">{success}</p>}
    </section>
  );
};

export default FirstScreenEditor;