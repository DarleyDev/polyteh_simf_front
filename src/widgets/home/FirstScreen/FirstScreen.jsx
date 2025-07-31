"use client";

import ButtonIcon from '@/shared/buttons/ButtonIcon/ButtonIcon'
import door from "@public/assets/icons/door.svg?url";
import logo from "@public/assets/icons/logo.svg?url";
import bubbles from "@public/assets/images/home/bubbles.png";
import Link from "next/link";
import style from "./Firstscreen.module.scss";
import { useState, useEffect } from "react";

const FirstScreen = () => {
  const [collegeName, setCollegeName] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [iconPath, setIconPath] = useState(door);
  const [error, setError] = useState("");
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

  return (
    <section className={style.firstScreen}>
      <img className={style.bubbles} src={bubbles.src} />
      {error ? (
        <p className={style.error}>{error}</p>
      ) : (
        <>
         <h1 className={style.title} data-img={bubbles.src}>
  <img
    style={{ width: "13rem", height: "auto", marginTop: "2rem" }}
    src={iconPath.src}
  />
  {collegeName == "ГБПОУ РК «Симферопольский политехнический колледж»" 
    ? <span dangerouslySetInnerHTML={{ __html: "ГБПОУ РК <br /> «Симферопольский политехнический колледж»" }} />
    : collegeName}
</h1>
          <Link href={buttonLink}>
            <ButtonIcon
              text="День открытых дверей"
              iconPath={door.src}
              className={style.button}
            />
          </Link>
        </>
      )}
    </section>
  );
};

export default FirstScreen;