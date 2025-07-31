'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import style from './EssentialLinks.module.scss';

export default function EssentialLinks() {
  const [links, setLinks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/essential/essential-links`);
        const data = await response.json();
        if (response.ok) {
          setLinks(data);
        } else {
          setError('Не удалось загрузить ссылки');
        }
      } catch (err) {
        console.error('Ошибка при загрузке ссылок:', err);
        setError('Ошибка при загрузке ссылок');
      }
    };

    fetchLinks();
  }, []);

  return (
    <>
      <div className={style.delimiter}></div>

      <nav className={style.links}>
        <h2 className={style.title}>Основные ссылки</h2>
        {error && <p className={style.error}>{error}</p>}
        <ul>
          {links.map(({ text, url, _id }, index) => (
            <li className={style.link} key={_id || index}>
              <Link href={url}>{text}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
