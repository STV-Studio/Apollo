import { useCallback, type MouseEvent as ReactMouseEvent } from "react";
import { useClips } from "../../../context";
import type { TimelineClip } from "../../types";
interface StartDragProps {
  e: ReactMouseEvent;
  clip: TimelineClip;
  trackId: string;
}
export function useMoveClip() {
  const { updateClip } = useClips();

  const startDrag = useCallback(
    ({ e, clip, trackId }: StartDragProps) => {
      e.preventDefault();
      e.stopPropagation();

      const startMouseX = e.clientX;
      const startMouseY = e.clientY;

      const startX = clip.x ?? 0;
      const startY = clip.y ?? 0;

      const handleMove = (moveEvent: globalThis.MouseEvent) => {
        const deltaX = moveEvent.clientX - startMouseX;
        const deltaY = moveEvent.clientY - startMouseY;

        const cinema = document.querySelector(
          ".cinima",
        ) as HTMLDivElement | null;
        if (!cinema) return;

        const rect = cinema.getBoundingClientRect();

        const clipWidth = clip.width ?? 200;
        const clipHeight = clip.height ?? 200;

        const nextX = Math.max(
          0,
          Math.min(startX + deltaX, rect.width - clipWidth),
        );

        const nextY = Math.max(
          0,
          Math.min(startY + deltaY, rect.height - clipHeight),
        );

        if (nextX === clip.x && nextY === clip.y) {
          return;
        }

        updateClip(trackId, clip.id, {
          x: nextX,
          y: nextY,
        });
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);

        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);

      window.addEventListener("mouseup", handleUp);
    },
    [updateClip],
  );

  return { startDrag };
}
