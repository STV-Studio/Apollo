import { useCallback, type MouseEvent as ReactMouseEvent } from "react";
import { useClips } from "../../../context";
import type { TimelineClip } from "../../types";
interface StartDragProps {
  e: ReactMouseEvent;
  clip: TimelineClip;
  trackId: string;
}
export default function useMoveClip() {
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

        const nextX = startX + deltaX;
        const nextY = startY + deltaY;

        if (nextX === clip.x && nextY === clip.y) {
          return;
        }

        updateClip(trackId, clip.id, {
          x: startX + deltaX,
          y: startY + deltaY,
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
