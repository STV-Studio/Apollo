import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * **RU:** Интерфейс возвращаемых значений хука `useZoomEffect`.
 * **EN:** Return interface for the `useZoomEffect` hook.
 */
interface UseZoomEffectResult {
  /**
   * **RU:** Текущий уровень масштаба (от `10` до `300`).
   * Значение по умолчанию: `50`. Используйте эту переменную для динамического расчета ширины треков или шага сетки таймлайна.
   * * **EN:** Current zoom scale level (`10` to `300`).
   * Default value is `50`. Use this variable to dynamically calculate track widths or timeline grid steps.
   */
  scale: number;

  /**
   * **RU:** Динамический шаг изменения масштаба.
   * Автоматически уменьшается при большом приближении для обеспечения ультра-плавного зума, и увеличивается на мелком масштабе.
   * * **EN:** Dynamic scale step for zoom transitions.
   * Automatically decreases at high zoom levels for ultra-smooth rendering, and increases at low zoom levels.
   */
  STEP: number;

  /**
   * **RU:** Ссылка (`ref`), которую **ОБЯЗАТЕЛЬНО** нужно повесить на самый верхний контейнер (обёртку) таймлайна с прокруткой (`overflow-x: auto`).
   * Без этого рефа хук не сможет вычислять координаты мыши и управлять скроллом контента!
   * * **EN:** React `ref` that **MUST** be attached to the top-level scrollable timeline container (`overflow-x: auto`).
   * Without this ref, the hook won't be able to track mouse coordinates or adjust scrolling!
   */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * **RU:** Кастомный хук для умного масштабирования (Zoom) таймлайна колесиком мыши с зажатым **Ctrl**.
 * * **Особенность для чайников:** Хук не просто зумит, он удерживает позицию таймлайна ровно под курсором мыши (как в Figma, Premiere Pro или After Effects), чтобы экран не «улетал» в сторону при масштабировании.
 * * **EN:** Custom hook for smart timeline zooming via mouse wheel while holding **Ctrl**.
 * Keeps the timeline content pinned right under the mouse cursor (Figma/Premiere Pro style).
 *
 * ---
 * @returns Объект управления масштабом (`scale`, `STEP`, `containerRef`).
 *
 * ---
 * @example
 * ```tsx
 * // RU: Пример использования в компоненте таймлайна:
 * // EN: Timeline component usage example:
 * * function Timeline() {
 * const { scale, STEP, containerRef } = useZoomEffect();
 * * return (
 * // 🔥 Обязательно вешаем ref на контейнер с прокруткой!
 * <div ref={containerRef} style={{ overflowX: 'auto', width: '100%' }}>
 * <div style={{ width: `${scale * 10}px` }}>
 * Текущий шаг зума: {STEP}
 * </div>
 * </div>
 * );
 * }
 * ```
 */

//! хук для управления эффектом масштабирования таймлайна при прокрутке колесика мыши с удерживанием клавиши Ctrl, а также для сохранения позиции прокрутки относительно курсора мыши при масштабировании
export function useZoomEffect(): UseZoomEffectResult {
  const [scale, setScale] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);

  //* вычисление шага масштабирования в зависимости от текущего масштаба для обеспечения более плавного и удобного масштабирования при различных уровнях масштаба
  const STEP = useMemo(() => {
    if (scale > 150) return 1;
    if (scale > 80) return 2;
    if (scale > 40) return 5;
    return 10;
  }, [scale]);

  /* 
    функция обработки события колесика мыши для изменения масштаба
    таймлайна при удерживании клавиши Ctrl и прокрутке колесика мыши, 
    а также для сохранения позиции прокрутки относительно курсора мыши при масштабировании
   */
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!e.ctrlKey) return;

    const container = containerRef.current;

    if (!container) return;
    const rect = container.getBoundingClientRect();

    const cursorX = e.clientX - rect.left;

    // 🔥 фикс — сохраняем ДО setState
    const scrollLeft = container.scrollLeft;

    const timelineX = cursorX + scrollLeft;

    setScale((prev) => {
      const timeBeforeZoom = timelineX / prev;

      const next = Math.min(Math.max(prev - e.deltaY * 0.1, 10), 300);

      const newScroll = timeBeforeZoom * next - cursorX;

      requestAnimationFrame(() => {
        container.scrollLeft = newScroll;
      });

      return next;
    });
  }, []);

  /* 
    использование эффекта для добавления и удаления обработчика события
    колесика мыши на контейнере таймлайна для обеспечения возможности масштабирования таймлайна при прокрутке колесика мыши с удерживанием клавиши Ctrl,
    а также для предотвращения дефолтного поведения прокрутки страницы при масштабировании таймлайна
  */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wheelHandler = (e: WheelEvent) => {
      if (!e.ctrlKey) return;

      e.preventDefault();
      handleWheel(e);
    };

    el.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      el.removeEventListener("wheel", wheelHandler);
    };
  }, [handleWheel]);

  return { scale, STEP, containerRef };
}
