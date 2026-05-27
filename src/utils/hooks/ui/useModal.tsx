import { useState, useCallback } from "react";

/**
 *  **useModal**
 *
 * ### 🇷🇺 Описание (RU)
 * Кастомный хук для управления состоянием модальных окон, попапов или меню.
 * Предоставляет логический флаг видимости (`true`/`false`) и методы для его изменения.
 *
 * ### 🇬🇧 Description (EN)
 * A custom hook to manage the visibility state of modals, popups, or menus.
 * Provides a boolean visibility flag (`true`/`false`) and methods to control it.
 *
 * ---
 *
 * ###  API / Свойства возвращаемого объекта
 *
 * * 🔹 `isOpen` `(boolean)`
 *   * **RU:** Текущий статус видимости (`true` — открыто, `false` — закрыто).
 *   * **EN:** Current visibility state (`true` — open, `false` — closed).
 * * 🔹 `handleIsOpen` `(() => void)`
 *   * **RU:** Функция для **открытия** окна (устанавливает `true`).
 *   * **EN:** Function to **open** the modal (sets to `true`).
 * * 🔹 `handleClose` `(() => void)`
 *   * **RU:** Функция для **закрытия** окна (устанавливает `false`).
 *   * **EN:** Function to **close** the modal (sets to `false`).
 * * 🔹 `handleToggle` `(() => void)`
 *   * **RU:** Функция-переключатель (инвертирует текущее состояние).
 *   * **EN:** Toggle function (inverts the current state).
 *
 * ---
 *
 * ###  Пример использования / Usage Example
 *
 * ```jsx
 * import useModal from './useModal';
 *
 * function Component() {
 *   const { isOpen, handleIsOpen, handleClose } = useModal();
 *
 *   return (
 *     <>
 *       <button onClick={handleIsOpen}>Open Modal</button>
 *
 *       {isOpen && (
 *         <div className="modal">
 *           <p>Modal Content </p>
 *           <button onClick={handleClose}>Close</button>
 *         </div>
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * `src/utils/hooks/ui/useModal.tsx`
 */

export default function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return { handleIsOpen, handleClose, handleToggle, isOpen };
}
