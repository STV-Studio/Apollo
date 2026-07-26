import { useCurrentTime, usePreview } from "../../../context";
import type { MouseEvent } from "react";
import { useCallback } from "react";

interface TimelineClickProps {
  scale: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

//! хук для обработки клика по таймлайну для перемещения playhead и синхронизации видео
export function useTimelineClick({ scale, containerRef }: TimelineClickProps) {
  const { VIDEO_REF, setIsPlay, setJustSeeked } = usePreview();
  const { setCurrentTime } = useCurrentTime();

  const handleTimelineClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const containerElement = containerRef.current;
      if (!containerElement) return;

      const rect = containerElement.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const timelineX = cursorX + containerElement.scrollLeft;
      const newTime = timelineX / scale;

      // 1. Ставим паузу
      setJustSeeked(true);
      setIsPlay(false);

      // 2. Стопаем проигрывание в DOM
      VIDEO_REF.current?.pause();
      document.querySelectorAll("audio").forEach((el) => {
        (el as HTMLAudioElement).pause();
      });

      // 3. Обновляем время — подписчики (Playhead, VideoSync, AudioSync)
      // мгновенно подхватят новый newTime и сами выставят нужный currentTime!
      setCurrentTime(newTime);
    },
    [scale, containerRef, setCurrentTime, setJustSeeked, setIsPlay, VIDEO_REF],
  );

  return { handleTimelineClick };
}
