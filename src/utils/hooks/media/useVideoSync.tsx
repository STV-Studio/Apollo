import { useCallback, useEffect } from "react";
import { useCurrentTime, usePreview } from "../../../context";
import type { TimelineClip } from "../../types";

export function useVideoSync(activeVideo?: TimelineClip) {
  const { VIDEO_REF, isPlay } = usePreview();
  const { currentTime } = useCurrentTime();

  const syncVideoTime = useCallback(
    (video: HTMLVideoElement, localTime: number) => {
      if (!isPlay) {
        if (Math.abs(video.currentTime - localTime) > 0.03) {
          video.currentTime = localTime;
        }
      }
    },
    [isPlay],
  );

  useEffect(() => {
    const video = VIDEO_REF.current;
    if (!video || !activeVideo) return;

    let localTime = currentTime - activeVideo.start;

    if (localTime < 0 || localTime > activeVideo.duration) {
      video.pause();
      return;
    }

    const SAFE_OFFSET = 0.03;
    localTime = Math.min(localTime, activeVideo.duration - SAFE_OFFSET);

    syncVideoTime(video, localTime);
  }, [currentTime, activeVideo, VIDEO_REF, syncVideoTime]);

  useEffect(() => {
    const video = VIDEO_REF.current;
    if (!video) return;

    if (isPlay) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlay, VIDEO_REF]);
}
