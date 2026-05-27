import { memo } from "react";

/**
 * Props interface for the HoverBlock component.
 */
interface Props {
  /**
   * RU: Дочерние элементы, отображаемые внутри блока.
   *
   * EN: React components or elements to be rendered inside the container.
   */
  children?: React.ReactNode;
}

/**
 * ### COMPONENT: HoverBlock
 * ---
 * ### RU: Описание
 * Компонент-контейнер для отображения всплывающей информации, подсказок или дополнительных элементов управления при наведении курсора мыши.
 * * Компонент обернут в `React.memo` для предотвращения избыточных перерендеров, когда родительский компонент обновляет свое состояние, но состав дочерних элементов `children` остается неизменным.
 *
 * * **Важно:** компонент спроектирован для постоянного нахождения в DOM-дереве.
 *
 *  Его скрытие и появление должны управляться исключительно через CSS с помощью псевдокласса `:hover`.
 *
 *  Не используйте условный рендер вида `isHovered ? <HoverBlock /> : null`, чтобы избежать лишних операций монтирования и демонтирования элементов.
 * * ---
 * ### EN: Description
 * A presentational container component designed to display contextual information, tooltips, or action overlays upon mouse hover.
 * * Wrapped in `React.memo` to optimize performance by avoiding redundant updates when the parent component re-renders but the `children` prop remains unchanged.
 *
 * * **Notice:** This component is designed to remain permanently in the DOM. Its visibility transitions should be handled purely via CSS using the `:hover` pseudo-class.
 *
 *  Avoid using conditional rendering like `isHovered ? <HoverBlock /> : null` to prevent unnecessary DOM mounting and unmounting overhead.
 *
 * * ---
 * ### CSS Integration
 *
 * Для корректного позиционирования и анимации настройте стили следующим образом:
 *
 * ```css
 * .parent-card {
 *      position: relative;
 *  }
 * .hover-block {
 *      position: absolute;
 *      top: 0;
 *      left: 0;
 *      opacity: 0;
 *      visibility: hidden;
 *      transition: opacity 0.2s ease, visibility 0.2s ease;
 *  }
 *  .parent-card:hover .hover-block {
 *      opacity: 1;
 *      visibility: visible;
 *  }
 * ```
 * * ---
 * ### Usage Example
 * Пример правильной декларативной разметки без использования React-состояния для отслеживания hover:
 * ```jsx
 * import HoverBlock from './HoverBlock';
 *
 *  function UserCard() {
 *      return (
 *          <div className="parent-card">
 *              <img src="avatar.png" alt="User Avatar" />
 *              <HoverBlock>
 *                  <button onClick={() => console.log('Edit')}>Edit Profile</button>
 *              </HoverBlock>
 *          </div>
 *      );
 *  }
 * ```
 *
 * ---
 * `Path: src/components/ui/HoverBlock.tsx`
 */

function HoverBlock({ children }: Props) {
  return <div className="hover-block">{children}</div>;
}
export default memo(HoverBlock);
