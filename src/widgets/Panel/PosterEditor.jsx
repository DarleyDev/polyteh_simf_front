"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Ensure this is installed via npm install js-cookie

export default function PosterApp() {
  const [poster, setPoster] = useState(null);
  const [file, setFile] = useState(null);
  const [token, setToken] = useState(Cookies.get("token") || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch current poster on mount
  const mainurl = process.env.NEXT_PUBLIC_SERVER_URL
  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const response = await fetch(`${mainurl}/posterall/poster`);
        const data = await response.json();
        if (response.ok) {
          setPoster(data.imagelink);
          setError("");
        } else {
          setError(data.message || "Не удалось загрузить постер");
        }
      } catch (err) {
        setError("Ошибка при загрузке постера");
      }
    };
    fetchPoster();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setSuccess("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Пожалуйста, выберите файл изображения");
      return;
    }
    if (!token) {
      setError("Пожалуйста, авторизуйтесь для загрузки");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${mainurl}/posterall/poster`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Постер успешно загружен");
        setPoster(data.imagelink);
        setFile(null);
        setError("");
        e.target.reset(); // Reset form
      } else {
        setError(data.message || "Не удалось загрузить постер");
      }
    } catch (err) {
      setError("Ошибка при загрузке постера");
    }
  };

  return (
    <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Управление постером</h1>

      {/* Current Poster Display */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Текущий постер</h2>
        {poster ? (
          <img
            src={`${mainurl}/uploads/poster.jpg`}
            alt="Текущий постер"
            className="w-full h-auto rounded-md"
          />
        ) : (
          <p className="text-gray-500">Постер отсутствует</p>
        )}
      </div>

      {/* Upload Form */}
      <div className="mb-6">
        {!token && (
          <p className="text-red-500 mb-4">
            Пожалуйста, авторизуйтесь для загрузки постера
          </p>
        )}
        <form onSubmit={handleUpload}>
          <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-1">
            Выберите файл изображения
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full mb-4 text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            title="Выберите изображение для загрузки как постер"
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-500 mb-2">{success}</p>}
          <button
            type="submit"
            disabled={!token}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400"
          >
            Загрузить постер
          </button>
        </form>
      </div>
    </div>
  );
}