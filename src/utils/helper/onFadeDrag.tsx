import React, { useCallback } from "react";
import { useClips } from "../../context";

export function useFadeDrag(
  trackID: string,
  id: string,
  fadeIn: number,
  fadeOut: number,
  duration: number,
  scale: number,
) {
  const { updateClip } = useClips();

  const handleFadeDrag = useCallback(
    (e: React.MouseEvent, side: "left" | "right") => {
      e.stopPropagation();

      let prevX = e.clientX;
      const MIN_FADE = 0.2;

      let currentFadeIn = fadeIn;
      let currentFadeOut = fadeOut;

      const handleMove = (moveEvent: MouseEvent) => {
        const deltaPx = moveEvent.clientX - prevX;
        prevX = moveEvent.clientX;

        const deltaTime = deltaPx / scale;

        if (side === "left") {
          currentFadeIn += deltaTime;

          currentFadeIn = Math.max(0, currentFadeIn);
          currentFadeIn = Math.min(
            currentFadeIn,
            duration - currentFadeOut - MIN_FADE,
          );

          updateClip(trackID, id, {
            fadeIn: currentFadeIn,
          });
        }

        if (side === "right") {
          currentFadeOut -= deltaTime;

          currentFadeOut = Math.max(0, currentFadeOut);
          currentFadeOut = Math.min(
            currentFadeOut,
            duration - currentFadeIn - MIN_FADE,
          );

          updateClip(trackID, id, {
            fadeOut: currentFadeOut,
          });
        }
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [duration, fadeIn, fadeOut, id, scale, trackID, updateClip],
  );

  return handleFadeDrag;
}
