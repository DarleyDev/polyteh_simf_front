"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

export default function EssentialLinks() {
  const [links, setLinks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newLinks, setNewLinks] = useState([]);
  const [newLink, setNewLink] = useState({ text: "", url: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = Cookies.get("token");
  const NEXT_SERVER = `${process.env.NEXT_PUBLIC_SERVER_URL}/essential`;

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${NEXT_SERVER}/essential-links`);
        const data = await response.json();
        if (response.ok) {
          setLinks(data);
          setNewLinks(data.map(link => ({ ...link })));
          setError("");
        } else {
          setError("Не удалось загрузить ссылки");
        }
      } catch (err) {
        setError("Ошибка при загрузке ссылок");
        console.error("Fetch Links Error:", err);
      }
    };

    fetchLinks();
  }, [NEXT_SERVER]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setNewLinks(links.map(link => ({ ...link })));
      setNewLink({ text: "", url: "" });
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedLinks = [...newLinks];
    updatedLinks[index][field] = value;
    setNewLinks(updatedLinks);
  };

  const handleNewLinkChange = (field, value) => {
    setNewLink(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLink = async () => {
    if (!token) {
      setError("Пожалуйста, авторизуйтесь для добавления");
      return;
    }
    if (!newLink.text || !newLink.url) {
      setError("Текст и URL обязательны");
      return;
    }

    try {
      const response = await fetch(`${NEXT_SERVER}/essential-links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newLink.text, url: newLink.url }),
      });
      const data = await response.json();
      if (response.ok) {
        setLinks(prev => [...prev, data.data]);
        setNewLink({ text: "", url: "" });
        setError("");
        window.alert("Пожалуйста, перезагрузите страницу для обновления изменений.");
      } else {
        setError(data.message || "Не удалось добавить ссылку");
      }
    } catch (err) {
      setError("Ошибка при добавлении ссылки");
      console.error("Add Link Error:", err);
    }
  };

  const handleSave = async (index) => {
    if (!token) {
      setError("Пожалуйста, авторизуйтесь для сохранения");
      return;
    }

    const linkToSave = newLinks[index];
    if (!linkToSave._id) {
      setError("Ссылка не найдена для сохранения");
      return;
    }

    try {
      const response = await fetch(`${NEXT_SERVER}/essential-links/${linkToSave._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(linkToSave),
      });
      const data = await response.json();
      if (response.ok) {
        setLinks(prev => prev.map(link => link._id === data.data._id ? data.data : link));
        setSuccess("Ссылка обновлена успешно");
        setError("");
      } else {
        setError(data.message || "Не удалось обновить ссылку");
      }
    } catch (err) {
      setError("Ошибка при обновлении ссылки");
      console.error("Save Link Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      setError("Пожалуйста, авторизуйтесь для удаления");
      return;
    }
    if (!window.confirm("Вы уверены, что хотите удалить эту ссылку?")) {
      return;
    }

    try {
      const response = await fetch(`${NEXT_SERVER}/essential-links/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setLinks(prev => prev.filter(link => link._id !== id));
        setNewLinks(prev => prev.filter(link => link._id !== id));
        setError("");
      } else {
        setError(data.message || "Не удалось удалить ссылку");
      }
    } catch (err) {
      setError("Ошибка при удалении ссылки");
      console.error("Delete Link Error:", err);
    }
  };

  return (
    <>
      <div className="border-t border-gray-300 my-4"></div>

      <nav className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-4">Основные ссылки</h2>
        {!editMode ? (
          <>
            <ul className="space-y-2">
              {links.map(({ text, url, _id }, index) => (
                <li key={index} className="text-blue-600 hover:text-blue-800">
                  <Link href={url}>{text}</Link>
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
              {newLinks.map((link, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={link.text}
                    onChange={(e) => handleInputChange(index, "text", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    placeholder="Текст ссылки"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleInputChange(index, "url", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    placeholder="URL"
                  />
                  <button
                    onClick={() => handleDelete(link._id)}
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
                value={newLink.text}
                onChange={(e) => handleNewLinkChange("text", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black"
                placeholder="Новый текст ссылки"
              />
              <input
                type="text"
                value={newLink.url}
                onChange={(e) => handleNewLinkChange("url", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black"
                placeholder="Новый URL"
              />
              <button
                onClick={handleAddLink}
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
      </nav>
    </>
  );
}