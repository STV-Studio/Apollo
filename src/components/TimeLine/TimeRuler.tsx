import { memo, useRef, useMemo } from "react";
import type { RefObject } from "react";
import { useClips } from "../../context";

import { TickItem } from "./TickItem";
import { useScrollParent, useTimeFormat, useTimelineClick } from "../../utils";
import { useZoomEffect } from "../../context/ZoomContext/ZoomContext";

interface Props {
  containerRef: RefObject<HTMLDivElement | null>;
}

function TimeRuler({ containerRef }: Props) {
  const { tracks } = useClips();
  const { formatTime, NICE_STEPS } = useTimeFormat();
  const { scale, STEP } = useZoomEffect();
  const rulerRef = useRef<HTMLUListElement>(null);

  // функция обработки клика по таймлайну для перемещения playhead и синхронизации видео
  const { handleTimelineClick } = useTimelineClick({ scale, containerRef });

  // Кастомный хук слежки за скроллом
  const viewport = useScrollParent(rulerRef, scale);

  // Расчет максимального времени
  const MAX_TIME = useMemo(() => {
    const allClips = tracks.flatMap((track) => track.clips);

    if (allClips.length === 0) return 30;

    return Math.max(...allClips.map(({ start, duration }) => start + duration));
  }, [tracks]);

  // Расчет адаптивного шага
  const calculatedStep = useMemo(() => {
    const TARGET_PIXELS_BETWEEN_TICKS = 90;
    const targetTimeStep = TARGET_PIXELS_BETWEEN_TICKS / scale;

    const multiplier =
      NICE_STEPS.find((m) => STEP * m >= targetTimeStep) ||
      NICE_STEPS[NICE_STEPS.length - 1];

    return STEP * multiplier;
  }, [scale, STEP, NICE_STEPS]);

  // Расчет только ВИДИМЫХ индексов
  const visibleIndices = useMemo(() => {
    const itemWidth = calculatedStep * scale;
    const maxIndex = Math.floor(MAX_TIME / calculatedStep);

    const OVERSCAN = 2;
    const startIndex = Math.max(
      0,
      Math.floor(viewport.scrollLeft / itemWidth) - OVERSCAN,
    );

    const endIndex = Math.min(
      maxIndex + 1,
      Math.ceil((viewport.scrollLeft + viewport.clientWidth) / itemWidth) +
        OVERSCAN,
    );

    const indices: number[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      if (i * calculatedStep <= MAX_TIME) {
        indices.push(i);
      }
    }
    return indices;
  }, [calculatedStep, scale, MAX_TIME, viewport]);

  const totalWidth = MAX_TIME * scale;

  return (
    <nav
      ref={containerRef}
      onClick={handleTimelineClick}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "#18181b", // Цвет фона контейнера таймлайна, чтобы клипы не просвечивали
        width: "100%", // На всю ширину видимого экрана
      }}
    >
      <ul
        ref={rulerRef}
        className="ruler"
        style={{
          width: totalWidth,
          height: 30,
          position: "relative",
          margin: 0,
          padding: 0,
          listStyle: "none",
          borderBottom: "1px solid #333",
        }}
      >
        {visibleIndices.map((index) => (
          <TickItem
            key={index}
            index={index}
            scale={scale}
            calculatedStep={calculatedStep}
            formatTime={formatTime}
          />
        ))}
      </ul>
    </nav>
  );
}

export default memo(TimeRuler);
