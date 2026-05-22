import { useEffect } from "react";
import { useCurrentTime, usePreview } from "../../../context";
import type { TimelineClip } from "../../types";

export function usePlaybackEngine(
  activeVideo?: TimelineClip,
  activeAudios: TimelineClip[] = [],
) {
  const { VIDEO_REF, isPlay } = usePreview();
  const { setCurrentTime, currentTimeRef } = useCurrentTime();

  useEffect(() => {
    const video = VIDEO_REF.current;

    let raf: number;

    const loop = () => {
      if (!isPlay) {
        raf = requestAnimationFrame(loop);
        return;
      }

      let newTime: number | null = null;

      const videoReady =
        video && activeVideo && !video.paused && video.readyState >= 2;

      if (videoReady) {
        newTime = video.currentTime + activeVideo.start;
      } else if (activeAudios.length > 0) {
        const clip = activeAudios[0];

        const audio = document.querySelector(
          `audio[data-id="${clip.id}"]`,
        ) as HTMLAudioElement | null;

        if (audio && !audio.paused) {
          newTime = audio.currentTime + clip.start;
        }
      }

      if (newTime !== null) {
        currentTimeRef.current = newTime;
        setCurrentTime(newTime);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, [
    activeVideo,
    activeAudios,
    isPlay,
    VIDEO_REF,
    setCurrentTime,
    currentTimeRef,
  ]);
}
