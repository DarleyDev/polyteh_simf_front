import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const LinksEditor = () => {
  const [content, setContent] = useState({ links: [] });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newLink, setNewLink] = useState({ text: '', href: '', isList: false });
  const [newSubLink, setNewSubLink] = useState({});
  const [editLink, setEditLink] = useState({});
  const [editSubLink, setEditSubLink] = useState({});

  const API_BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/linkglobal`;
  const token = Cookies.get('token')
  // Fetch content on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/content`, {
          headers: { Authorization: token }, // Replace with actual token
        });
        setContent(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Не удалось загрузить контент');
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Add new link with confirmation
  const handleAddLink = async () => {
    if (!newLink.text || !newLink.href) {
      setError('Требуется текст и ссылка для нового элемента');
      return;
    }
    if (!window.confirm('Вы уверены, что хотите добавить новую ссылку?')) {
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/links`, newLink, {
        headers: { Authorization: token },
      });
      setContent(response.data.content);
      setNewLink({ text: '', href: '', isList: false });
      setError(null);
    } catch (err) {
      setError('Не удалось добавить элемент');
    }
  };

  // Update link with confirmation
  const handleUpdateLink = async (linkId) => {
    const linkData = editLink[linkId];
    const currentLink = content.links.find((link) => link._id.toString() === linkId);

    // If no edits are made, use the current link data or do nothing
    if (!linkData) {
      if (!window.confirm('Вы уверены, что хотите сохранить текущие данные?')) {
        return;
      }
      try {
        const response = await axios.put(`${API_BASE_URL}/links?id=${linkId}`, currentLink, {
          headers: { Authorization: token },
        });
        setContent(response.data.data);
        setError(null);
      } catch (err) {
        setError('Не удалось сохранить текущие данные');
      }
      return;
    }

    // Validate if edits are made but no fields are provided
    if (!linkData.text && !linkData.href && linkData.isList === undefined) {
      setError('Должен быть указан хотя бы один параметр для обновления');
      return;
    }

    if (!window.confirm('Вы уверены, что хотите сохранить изменения?')) {
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/links?id=${linkId}`, linkData, {
        headers: { Authorization: token },
      });
      setContent(response.data.data);
      setEditLink((prev) => ({ ...prev, [linkId]: undefined }));
      setError(null);
    } catch (err) {
      setError('Не удалось обновить элемент');
    }
  };

  // Delete link with confirmation
  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту ссылку?')) {
      return;
    }
    try {
      const response = await axios.delete(`${API_BASE_URL}/links?id=${linkId}`, {
        headers: { Authorization: token },
      });
      setContent(response.data.data);
      setError(null);
    } catch (err) {
      setError('Не удалось удалить элемент');
    }
  };

  // Add sub-link with confirmation
  const handleAddSubLink = async (linkId) => {
    const subLinkData = newSubLink[linkId];
    if (!subLinkData || !subLinkData.text || !subLinkData.href) {
      setError('Требуется текст и ссылка для нового подэлемента');
      return;
    }
    if (!window.confirm('Вы уверены, что хотите добавить новый подэлемент?')) {
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/sublinks?linkId=${linkId}`, subLinkData, {
        headers: { Authorization: token },
      });
      setContent(response.data.data);
      setNewSubLink((prev) => ({ ...prev, [linkId]: undefined }));
      setError(null);
    } catch (err) {
      setError('Не удалось добавить подэлемент');
    }
  };

  // Update sub-link with confirmation
  const handleUpdateSubLink = async (linkId, subLinkId) => {
    const subLinkData = editSubLink[`${linkId}-${subLinkId}`];
    const currentSubLink = content.links
      .find((link) => link._id.toString() === linkId)
      ?.subLinks.find((subLink) => subLink._id.toString() === subLinkId);

    if (!subLinkData && !currentSubLink) {
      setError('Подэлемент не найден для обновления');
      return;
    }

    // Prepare data with current text if not updated
    const updateData = {
      ...(subLinkData?.text !== undefined ? { text: subLinkData.text } : { text: currentSubLink?.text }),
      ...(subLinkData?.href !== undefined ? { href: subLinkData.href } : { href: currentSubLink?.href }),
    };

    if (!updateData.text && !updateData.href) {
      setError('Должен быть указан хотя бы один параметр (текст или ссылка) для обновления подэлемента');
      return;
    }

    if (!window.confirm('Вы уверены, что хотите сохранить изменения?')) {
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/sublinks?linkId=${linkId}&subLinkId=${subLinkId}`,
        updateData,
        { headers: { Authorization: token } }
      );
      setContent(response.data.data);
      setEditSubLink((prev) => ({ ...prev, [`${linkId}-${subLinkId}`]: undefined }));
      setError(null);
    } catch (err) {
      setError('Не удалось обновить подэлемент');
    }
  };

  // Delete sub-link with confirmation
  const handleDeleteSubLink = async (linkId, subLinkId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот подэлемент?')) {
      return;
    }
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/sublinks?linkId=${linkId}&subLinkId=${subLinkId}`,
        { headers: { Authorization: token } }
      );
      setContent(response.data.data);
      setError(null);
    } catch (err) {
      setError('Не удалось удалить подэлемент');
    }
  };

  if (isLoading) return <div className="text-center mt-8 text-white">Загрузка...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Редактор Ссылок</h1>

      {/* Add New Link Form */}
      <div className="mb-6 p-4 border border-gray-700 rounded bg-gray-800">
        <h2 className="text-lg font-semibold mb-2">Добавить Новую Ссылку</h2>
        <input
          type="text"
          placeholder="Текст"
          value={newLink.text}
          onChange={(e) => setNewLink({ ...newLink, text: e.target.value })}
          className="border border-gray-600 p-2 mr-2 mb-2 w-full bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Ссылка"
          value={newLink.href}
          onChange={(e) => setNewLink({ ...newLink, href: e.target.value })}
          className="border border-gray-600 p-2 mr-2 mb-2 w-full bg-gray-700 text-white placeholder-gray-400"
        />
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={newLink.isList}
            onChange={(e) => setNewLink({ ...newLink, isList: e.target.checked })}
            className="mr-2"
          />
          Является Списком
        </label>
        <button
          onClick={handleAddLink}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Добавить Ссылку
        </button>
      </div>

      {/* Links List */}
      {content.links.map((link) => (
        <div key={link._id} className="mb-4 p-4 border border-gray-700 rounded bg-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <input
                type="text"
                value={editLink[link._id]?.text ?? link.text}
                onChange={(e) =>
                  setEditLink({ ...editLink, [link._id]: { ...editLink[link._id], text: e.target.value } })
                }
                className="border border-gray-600 p-2 mr-2 mb-2 bg-gray-700 text-white"
              />
              <input
                type="text"
                value={editLink[link._id]?.href ?? link.href}
                onChange={(e) =>
                  setEditLink({ ...editLink, [link._id]: { ...editLink[link._id], href: e.target.value } })
                }
                className="border border-gray-600 p-2 mr-2 mb-2 bg-gray-700 text-white"
              />
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={editLink[link._id]?.isList ?? link.isList}
                  onChange={(e) =>
                    setEditLink({
                      ...editLink,
                      [link._id]: { ...editLink[link._id], isList: e.target.checked },
                    })
                  }
                  className="mr-2"
                />
                Является Списком
              </label>
            </div>
            <div>
              <button
                onClick={() => handleUpdateLink(link._id)}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
              >
                Сохранить
              </button>
              <button
                onClick={() => handleDeleteLink(link._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Удалить
              </button>
            </div>
          </div>

          {/* Sub-links */}
          {link.isList && (
            <div className="ml-6 mt-4">
              <h3 className="text-md font-semibold mb-2 text-white">Подсвязи</h3>
              {link.subLinks.map((subLink) => (
                <div key={subLink._id} className="flex justify-between items-center mb-2">
                  <div>
                    <input
                      type="text"
                      value={editSubLink[`${link._id}-${subLink._id}`]?.text ?? subLink.text}
                      onChange={(e) =>
                        setEditSubLink({
                          ...editSubLink,
                          [`${link._id}-${subLink._id}`]: {
                            ...editSubLink[`${link._id}-${subLink._id}`],
                            text: e.target.value,
                          },
                        })
                      }
                      className="border border-gray-600 p-2 mr-2 bg-gray-700 text-white"
                    />
                    <input
                      type="text"
                      value={editSubLink[`${link._id}-${subLink._id}`]?.href ?? subLink.href}
                      onChange={(e) =>
                        setEditSubLink({
                          ...editSubLink,
                          [`${link._id}-${subLink._id}`]: {
                            ...editSubLink[`${link._id}-${subLink._id}`],
                            href: e.target.value,
                          },
                        })
                      }
                      className="border border-gray-600 p-2 mr-2 bg-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => handleUpdateSubLink(link._id, subLink._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => handleDeleteSubLink(link._id, subLink._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
              {/* Add Sub-link Form */}
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Текст Подсвязи"
                  value={newSubLink[link._id]?.text ?? ''}
                  onChange={(e) =>
                    setNewSubLink({
                      ...newSubLink,
                      [link._id]: { ...newSubLink[link._id], text: e.target.value },
                    })
                  }
                  className="border border-gray-600 p-2 mr-2 mb-2 bg-gray-700 text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="Ссылка Подсвязи"
                  value={newSubLink[link._id]?.href ?? ''}
                  onChange={(e) =>
                    setNewSubLink({
                      ...newSubLink,
                      [link._id]: { ...newSubLink[link._id], href: e.target.value },
                    })
                  }
                  className="border border-gray-600 p-2 mr-2 mb-2 bg-gray-700 text-white placeholder-gray-400"
                />
                <button
                  onClick={() => handleAddSubLink(link._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Добавить Подсвязь
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LinksEditor;
