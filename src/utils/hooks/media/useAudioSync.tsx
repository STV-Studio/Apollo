import { useEffect } from "react";
import { useCurrentTime, usePreview } from "../../../context";
import type { TimelineClip } from "../../types";
import { applyAudioFade } from "../../helper";

export function useAudioSync(activeAudios: TimelineClip[]) {
  const { JUST_SEEKED, isPlay } = usePreview();
  const { currentTimeRef, subscribeTime } = useCurrentTime();

  useEffect(() => {
    const syncAudioTime = (time: number) => {
      activeAudios.forEach((clip) => {
        const audio = document.querySelector(
          `audio[data-id="${clip.id}"]`,
        ) as HTMLAudioElement | null;

        if (!audio) return;

        const local = time - clip.start;

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

        applyAudioFade({ audio, clip, currentTime: time });

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
    };

    syncAudioTime(currentTimeRef.current);

    const unsubscribe = subscribeTime((newTime) => {
      syncAudioTime(newTime);
    });

    return unsubscribe;
  }, [activeAudios, isPlay, JUST_SEEKED, subscribeTime, currentTimeRef]);
}
