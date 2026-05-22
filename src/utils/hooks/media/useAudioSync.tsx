import { useEffect } from "react";
import { useCurrentTime, usePreview } from "../../../context";
import type { TimelineClip } from "../../types";
import { applyAudioFade } from "../../helper";

export function useAudioSync(activeAudios: TimelineClip[]) {
  const { JUST_SEEKED, isPlay } = usePreview();
  const { currentTime } = useCurrentTime();

  useEffect(() => {
    activeAudios.forEach((clip) => {
      const audio = document.querySelector(
        `audio[data-id="${clip.id}"]`,
      ) as HTMLAudioElement | null;

      if (!audio) return;

      const local = currentTime - clip.start;

      // вне диапазона → стоп
      if (local < 0 || local > clip.duration) {
        audio.pause();
        return;
      }

      // SEEK
      if (!isPlay || JUST_SEEKED.current) {
        if (Math.abs(audio.currentTime - local) > 0.03) {
          audio.currentTime = local;
        }
      }

      applyAudioFade({ audio, clip, currentTime });

      if (isPlay) {
        if (audio.paused) {
          audio.muted = false;
          audio.volume = 1;

          const p = audio.play();

          if (p) {
            p.catch(() => {
              // fallback
              audio.muted = true;
              audio.play().catch(() => {});
              audio.muted = false;
            });
          }
        }
      }
    });
  }, [activeAudios, currentTime, isPlay, JUST_SEEKED]);
}
