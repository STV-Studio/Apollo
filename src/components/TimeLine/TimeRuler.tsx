import { memo, useRef, useMemo } from "react";
import { useClips } from "../../context";

import { TickItem } from "./TickItem";
import { useScrollParent, useTimeFormat } from "../../utils";

interface Props {
  scale: number;
  STEP: number;
}

function TimeRuler({ scale, STEP }: Props) {
  const { tracks } = useClips();
  const { formatTime, NICE_STEPS } = useTimeFormat();
  const rulerRef = useRef<HTMLUListElement>(null);

  // Кастомный хук слежки за скроллом
  const viewport = useScrollParent(rulerRef, scale);

  // Расчет максимального времени
  const MAX_TIME = useMemo(() => {
    const allClips = tracks.flatMap((track) => track.clips);

    if (allClips.length === 0) return 30;

    return Math.max(...allClips.map(({ start, duration }) => start + duration));
  }, [tracks]);

  // Расчет адаптивного шага с использованием NICE_STEPS из твоего хука
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
  );
}

export default memo(TimeRuler);
