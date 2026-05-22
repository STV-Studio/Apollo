import { useClips, useCurrentTime, usePreview } from "../../../context";
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
  const { tracks } = useClips();

  const handleTimelineClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const videoElement = VIDEO_REF.current;
      const containerElement = containerRef.current;
      if (!containerElement) return;

      const rect = containerElement.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const timelineX = cursorX + containerElement.scrollLeft;
      const newTime = timelineX / scale;

      setCurrentTime(newTime);

      setJustSeeked(true);
      setIsPlay(false);

      // ⛔ стоп всего
      videoElement?.pause();

      document.querySelectorAll("audio").forEach((el) => {
        (el as HTMLAudioElement).pause();
      });

      const ALL_CLIPS = tracks.flatMap((track) => track.clips);

      requestAnimationFrame(() => {
        // 🎬 VIDEO
        if (videoElement) {
          const activeClip = ALL_CLIPS.find(
            (c) =>
              c.type === "video" &&
              newTime >= c.start &&
              newTime < c.start + c.duration,
          );

          if (activeClip) {
            const local = Math.max(0, newTime - activeClip.start);
            const SAFE_OFFSET = 0.02;

            videoElement.currentTime = Math.min(
              local,
              activeClip.duration - SAFE_OFFSET,
            );
          } else {
            videoElement.currentTime = 0;
          }
        }

        // 🔊 MULTI AUDIO
        const activeAudios = ALL_CLIPS.filter(
          (c) =>
            c.type === "audio" &&
            newTime >= c.start &&
            newTime < c.start + c.duration,
        );

        activeAudios.forEach((clip) => {
          const audio = document.querySelector(
            `audio[data-id="${clip.id}"]`,
          ) as HTMLAudioElement | null;

          if (!audio) return;

          const local = Math.max(0, newTime - clip.start);
          const SAFE_OFFSET = 0.02;

          audio.currentTime = Math.min(local, clip.duration - SAFE_OFFSET);
        });
      });
    },
    [
      setCurrentTime,
      scale,
      tracks,
      VIDEO_REF,
      containerRef,
      setJustSeeked,
      setIsPlay,
    ],
  );

  return { handleTimelineClick };
}
