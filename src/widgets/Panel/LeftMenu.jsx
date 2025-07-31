import React from "react";
import style from "./Panel.module.scss";

const LeftMenu = React.memo(function LeftMenu({
  setMainPanelType,
  mainPanelType,
}) {
  const panelItems = [
    { item: "Создание страницы", name: "create-page" },
    { item: "Редактирование страницы", name: "edit-page" },
    { item: "Удаление страницы", name: "delete-page" },
    { item: "Редактировать расписание", name: "edit-schedule" },
    { item: "Создать новый аккаунт", name: "create-account" },
    { item: "Редактирование навигации", name: "editor-page-editor" },
    { item: "Редактирование файлов", name: "editor-files-editor" },
    { item: "Редактирование ссылок на главной странице", name: "editor-link-main" },
    { item: "Редактирование плаката", name: "editor-poster" },
    {item: "Редактирование слайдера", name: "editor-swiper"},
    {item: "Редактирование основных ссылок", name: "editor-essential-links"}
  ];
  return (
    <section className={style.left__menu}>
      <ul>
        {panelItems.map(({ item, name }) => (
          <li key={name} onClick={() => setMainPanelType(name)}>
            <button
              style={
                name === mainPanelType
                  ? { background: "#d73636" }
                  : { opacity: 1 }
              }
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
});

export default LeftMenu;
