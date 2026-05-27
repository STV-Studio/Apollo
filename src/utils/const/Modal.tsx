import { memo } from "react";

/**
 * ИнтерфейсProps для компонента Modal.
 * Описывает типы и назначение всех входящих параметров.
 */
interface Props {
  /**
   * RU: Флаг отображения модального окна. Если true — окно отображается.
   *
   * EN: Visibility flag. If true, the modal window is rendered.
   */
  isOpen: boolean;

  /**
   * RU: Функция обратного вызова для закрытия модального окна.
   *
   * EN: Callback function to close the modal window.
   */
  handleClose: () => void;

  /**
   * RU: Функция обратного вызова для переключения состояния видимости.
   *
   * EN: Callback function to toggle the visibility state.
   */
  handleToggle: () => void;

  /**
   * RU: Дочерние элементы, отображаемые внутри контентной области модального окна.
   *
   * EN: React components or elements to be rendered inside the modal content area.
   */
  children?: React.ReactNode;
}

/**
 * ## RU:
 * ### COMPONENT: Modal
 *
 * Компонент базового модального окна с управлением видимостью через пропсы.
 * Обернут в `React.memo` для предотвращения избыточных перерендеров при неизменных ссылках на функции управления.
 *
 * ---
 *
 * ### ОСОБЕННОСТИ РАБОТЫ (IMPORTANT NOTICE)
 *
 * Компонент использует обработчик `handleToggle` на корневом контейнере (overlay).
 * Во избежание закрытия окна при клике на внутренний контент, для контейнера `.modal-content`
 * добавлена остановка всплытия события через `e.stopPropagation()`.
 *
 * ---
 *
 * ### ПРИМЕР ИСПОЛЬЗОВАНИЯ (USAGE EXAMPLE)
 *
 * ```jsx
 * import useModal from '@/hooks/ui/useModal';
 * import Modal from '@/components/ui/Modal';
 *
 * function Page() {
 *   const { isOpen, handleClose, handleToggle, handleIsOpen } = useModal();
 *
 *   return (
 *     <>
 *       <button onClick={handleIsOpen}>Открыть окно</button>
 *
 *       <Modal * handleClose="{handleClose}" handleToggle="{handleToggle}" isOpen="{isOpen}">
 *         <h2>Заголовок</h2>
 *         <p>Контент модального окна.</p>
 *       </Modal>
 *     </>
 *   );
 * }
 *
 * ```
 * ## EN:
 * ### COMPONENT: Modal
 *
 *  A basic modal window component with visibility controlled via props.
 *
 *  Wrapped in `React.memo` to prevent unnecessary re-renders when the control function references remain unchanged.
 *
 * ---
 * ### IMPORTANT NOTICE
 *
 * The component uses the `handleToggle` handler on the root container (overlay).
 *
 * To prevent the modal from closing when clicking on the inner content, `e.stopPropagation()` is
 *
 * added to the `.modal-content` container to stop event bubbling.
 *
 * ---
 * ### USAGE EXAMPLE
 *
 * ```jsx
 * import useModal from '@/hooks/ui/useModal';
 * import Modal from '@/components/ui/Modal';
 * function Page() {
 *  const { isOpen, handleClose, handleToggle, handleIsOpen } = useModal();
 *   return (
 *     <>
 *       <button onClick={handleIsOpen}>Открыть окно</button>
 *
 *       <Modal * handleClose="{handleClose}" handleToggle="{handleToggle}" isOpen="{isOpen}">
 *         <h2>Заголовок</h2>
 *         <p>Контент модального окна.</p>
 *       </Modal>
 *     </>
 *  );
 * }
 *
 */

function Modal({ isOpen, handleClose, handleToggle, children }: Props) {
  return (
    <div
      className={`modal-overlay ${isOpen ? "active" : ""}`}
      onClick={handleToggle}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal ${isOpen ? "active" : "not_active"}`}
      >
        {children}
      </div>
      <button className="modal-close" onClick={handleClose}>
        X
      </button>
    </div>
  );
}
export default memo(Modal);
