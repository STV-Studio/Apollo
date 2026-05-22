import { useCallback, useEffect, useMemo, useRef, useState } from "react";

//! хук для управления эффектом масштабирования таймлайна при прокрутке колесика мыши с удерживанием клавиши Ctrl, а также для сохранения позиции прокрутки относительно курсора мыши при масштабировании
export function useZoomEffect() {
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
