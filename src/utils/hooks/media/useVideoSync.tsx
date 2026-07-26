import { useCallback, useEffect } from "react";
import { useCurrentTime, usePreview } from "../../../context";
import type { TimelineClip } from "../../types";

export function useVideoSync(activeVideo?: TimelineClip) {
  const { VIDEO_REF, isPlay } = usePreview();
  const { currentTimeRef, subscribeTime } = useCurrentTime();

  const syncVideoTime = useCallback(
    (video: HTMLVideoElement, time: number) => {
      if (!activeVideo) return;

      let localTime = time - activeVideo.start;

      if (localTime < 0 || localTime > activeVideo.duration) {
        video.pause();
        return;
      }

      const SAFE_OFFSET = 0.03;
      localTime = Math.min(localTime, activeVideo.duration - SAFE_OFFSET);

      if (!isPlay) {
        if (Math.abs(video.currentTime - localTime) > 0.03) {
          video.currentTime = localTime;
        }
      }
    },
    [activeVideo, isPlay],
  );

  useEffect(() => {
    const video = VIDEO_REF.current;
    if (!video || !activeVideo) return;

    syncVideoTime(video, currentTimeRef.current);

    const unsubscribe = subscribeTime((newTime) => {
      syncVideoTime(video, newTime);
    });

    return unsubscribe;
  }, [activeVideo, syncVideoTime, subscribeTime, currentTimeRef, VIDEO_REF]);

  useEffect(() => {
    const video = VIDEO_REF.current;
    if (!video) return;

    if (isPlay && activeVideo) {
      let isCancelled = false;

      const playVideo = () => {
        if (isCancelled) return;

        const targetTime = Math.max(
          0,
          currentTimeRef.current - activeVideo.start,
        );

        if (Math.abs(video.currentTime - targetTime) > 0.1) {
          video.currentTime = targetTime;
        }

        video.play().catch(() => {});
      };

      if (video.readyState < 2) {
        const handleCanPlay = () => {
          playVideo();
          video.removeEventListener("canplay", handleCanPlay);
        };

        video.addEventListener("canplay", handleCanPlay);

        return () => {
          isCancelled = true;
          video.removeEventListener("canplay", handleCanPlay);
        };
      } else {
        // Если видео уже готовы проигрывать — запускаем через RAF
        const frameId = requestAnimationFrame(playVideo);
        return () => {
          isCancelled = true;
          cancelAnimationFrame(frameId);
        };
      }
    } else {
      video.pause();
    }
  }, [isPlay, activeVideo, currentTimeRef, VIDEO_REF]);
}
