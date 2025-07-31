"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import useMediaQuery from "@app/hooks/useMediaQuery";
import Image from "next/image"; // For optimized image handling

export default function Ministries() {
  const [ministries, setMinistries] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newMinistries, setNewMinistries] = useState([]);
  const [newMinistry, setNewMinistry] = useState({ url: "", text: "", sourceImage: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = Cookies.get("token");
  const NEXT_SERVER = `${process.env.NEXT_PUBLIC_SERVER_URL}/minmain`;

  const isMobile = useMediaQuery("(max-width: 550px)");

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await fetch(`${NEXT_SERVER}/ministries`);
        const data = await response.json();
        if (response.ok) {
          setMinistries(data);
          setNewMinistries(data.map(ministry => ({ ...ministry })));
          setError("");
        } else {
          setError("Не удалось загрузить данные");
        }
      } catch (err) {
        setError("Ошибка при загрузке данных");
        console.error("Fetch Ministries Error:", err);
      }
    };
    fetchMinistries();
  }, [NEXT_SERVER]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setNewMinistries(ministries.map(ministry => ({ ...ministry })));
      setNewMinistry({ url: "", text: "", sourceImage: "" });
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedMinistries = [...newMinistries];
    updatedMinistries[index][field] = value;
    setNewMinistries(updatedMinistries);
  };

  const handleNewMinistryChange = (field, value) => {
    setNewMinistry(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMinistry = async () => {
    if (!token) {
      setError("Пожалуйста, авторизуйтесь для добавления");
      return;
    }
    if (!newMinistry.url || !newMinistry.text || !newMinistry.sourceImage) {
      setError("URL, текст и путь к изображению обязательны");
      return;
    }

    try {
      const response = await fetch(`${NEXT_SERVER}/ministries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMinistry),
      });
      const data = await response.json();
      if (response.ok) {
        setMinistries(prev => [...prev, data.data]);
        setNewMinistry({ url: "", text: "", sourceImage: "" });
        setError("");
        window.alert("Пожалуйста, перезагрузите страницу для обновления изменений.");
      } else {
        setError(data.message || "Не удалось добавить министерство");
      }
    } catch (err) {
      setError("Ошибка при добавлении министерства");
      console.error("Add Ministry Error:", err);
    }
  };

const handleSave = async (index) => {
    if (!token) {
      setError("Пожалуйста, авторизуйтесь для сохранения");
      return;
    }

    const ministryToSave = newMinistries[index];
    if (!ministryToSave._id) {
      setError("Министерство не найдено для сохранения");
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        id: ministryToSave._id,
        url: ministryToSave.url,
        text: ministryToSave.text,
        sourceImage: ministryToSave.sourceImage,
      }).toString();
      const response = await fetch(`${NEXT_SERVER}/ministries?${queryParams}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMinistries(prev => prev.map(ministry => ministry._id === data.data._id ? data.data : ministry));
        setSuccess("Министерство обновлено успешно");
        setError("");
      } else {
        setError(data.message || "Не удалось обновить министерство");
      }
    } catch (err) {
      setError("Ошибка при обновлении министерства");
      console.error("Save Ministry Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      setError("Пожалуйста, авторизуйтесь для удаления");
      return;
    }
    if (!window.confirm("Вы уверены, что хотите удалить это министерство?")) {
      return;
    }

    try {
      const response = await fetch(`${NEXT_SERVER}/ministries?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMinistries(prev => prev.filter(ministry => ministry._id !== id));
        setNewMinistries(prev => prev.filter(ministry => ministry._id !== id));
        setError("");
      } else {
        setError(data.message || "Не удалось удалить министерство");
      }
    } catch (err) {
      setError("Ошибка при удалении министерства");
      console.error("Delete Ministry Error:", err);
    }
  };

  return (
    <>
      <div className="border-t border-gray-300 my-4"></div>

      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-4">Министерства и партнеры</h2>
        {!editMode ? (
          <>
            <ul className="space-y-4">
              {ministries.map(({ url, text, sourceImage, _id }, index) => (
                <li key={index} className="flex items-center space-x-4 p-2 bg-gray-100 rounded">
                  <img
                    src={sourceImage}

                    className="object-contain"
                  />
                  <Link target="_blank" href={url} className="text-blue-600 hover:text-blue-800">
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
            {token && (
              <button
                onClick={handleEditToggle}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Редактировать
              </button>
            )}
          </>
        ) : (
          <>
            <ul className="space-y-4">
              {newMinistries.map((ministry, index) => (
                <li key={index} className="flex items-center space-x-4 p-2 bg-gray-100 rounded">
                  <input
                    type="text"
                    value={ministry.url}
                    onChange={(e) => handleInputChange(index, "url", e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded text-black"
                    placeholder="URL"
                  />
                  <input
                    type="text"
                    value={ministry.text}
                    onChange={(e) => handleInputChange(index, "text", e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded text-black"
                    placeholder="Текст"
                  />
                  <input
                    type="text"
                    value={ministry.sourceImage}
                    onChange={(e) => handleInputChange(index, "sourceImage", e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded text-black"
                    placeholder="Путь к изображению"
                  />
                  <button
                    onClick={() => handleDelete(ministry._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Удалить
                  </button>
                  <button
                    onClick={() => handleSave(index)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Сохранить
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2">
              <input
                type="text"
                value={newMinistry.url}
                onChange={(e) => handleNewMinistryChange("url", e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded text-black"
                placeholder="Новый URL"
              />
              <input
                type="text"
                value={newMinistry.text}
                onChange={(e) => handleNewMinistryChange("text", e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded text-black"
                placeholder="Новый текст"
              />
              <input
                type="text"
                value={newMinistry.sourceImage}
                onChange={(e) => handleNewMinistryChange("sourceImage", e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded text-black"
                placeholder="Новый путь к изображению"
              />
              <button
                onClick={handleAddMinistry}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Добавить
              </button>
            </div>
            <div className="mt-4 space-x-2">
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Отмена
              </button>
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
            {success && <p className="mt-2 text-green-500">{success}</p>}
          </>
        )}
      </section>
    </>
  );
}