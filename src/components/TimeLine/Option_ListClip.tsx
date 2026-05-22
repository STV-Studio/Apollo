import { memo, useState, useRef } from "react";
import { createPortal } from "react-dom"; // <-- Импортируем портал
import { SlOptionsVertical } from "react-icons/sl";
import { useDataEdit } from "../../utils";

interface Props {
  id: string;
  isEdit: boolean;
  setIsEdit: () => void;
}

function Option_ListClip({ id, setIsEdit, isEdit }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null); // Ref для поиска координат кнопки

  const { handleDeleteTimeLineClip } = useDataEdit();

  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      // Получаем точные координаты кнопки на экране в момент клика
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        // Ставим меню прямо под кнопкой (с учетом прокрутки страницы, если она есть)
        top: rect.bottom + window.scrollY,
        // Выравниваем по правому краю кнопки (вычитаем ширину меню, например 120px)
        left: rect.right + window.scrollX - 120,
      });
    }
    setIsOpen((prev) => !prev);
  };

  const Delete = () => {
    handleDeleteTimeLineClip(id);
    setIsOpen(false);
  };

  const startEditing = () => {
    setIsEdit();
    setIsOpen(false);
  };

  const LIST =
    isOpen &&
    createPortal(
      <>
        <div
          onClick={() => setIsOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 9999 }}
        />

        <div
          className="MENU_OPTION"
          style={{
            position: "absolute",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: "120px",
            minWidth: "120px",
            boxSizing: "border-box",
            zIndex: 10000,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "5px" }}>
            <li style={{ color: "white" }} onClick={startEditing}>
              Edit
            </li>
            <li onClick={Delete}>Delete</li>
          </ul>
        </div>
      </>,
      document.body,
    );

  return (
    <div className="box_all">
      {!isEdit && (
        <button
          ref={buttonRef} // Привязываем ref к кнопке
          onClick={toggleMenu}
          className="btn_option"
        >
          <SlOptionsVertical
            title="option"
            style={{ cursor: "pointer", color: "white" }}
          />
        </button>
      )}
      {LIST}
    </div>
  );
}

export default memo(Option_ListClip);
