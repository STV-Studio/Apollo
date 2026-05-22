import { useAudioSync } from "./useAudioSync";
import { useVideoSync } from "./useVideoSync";
import { useActiveMedia } from "./useActiveMedia";
import { usePlaybackEngine } from "./usePlaybackEngine";
import { usePreview } from "../../../context";
import { useEffect } from "react";

export function useMediaSync() {
  const media = useActiveMedia();
  const { VIDEO_REF, isPlay } = usePreview();

  useEffect(() => {
    const video = VIDEO_REF.current;

    if (video) {
      if (isPlay) video.play().catch(() => {});
      else video.pause();
    }

    // 🔊 ВСЕ audio
    document.querySelectorAll("audio").forEach((el) => {
      const audio = el as HTMLAudioElement;

      if (isPlay) audio.play().catch(() => {});
      else audio.pause();
    });
  }, [isPlay, VIDEO_REF]);

  useVideoSync(media.activeVideo);
  useAudioSync(media.activeAudios);
  usePlaybackEngine(media.activeVideo, media.activeAudios);

  return media;
}
