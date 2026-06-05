import { useClips } from "../../../context";
import type { TimelineClip } from "../../types";

type ResizeDirection = "right" | "bottom" | "corner";

export function useResizeClipViewport() {
  const { updateClip } = useClips();

  const startResize = (
    e: React.MouseEvent,
    clip: TimelineClip,
    trackId: string,
    direction: ResizeDirection,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startWidth = clip.width ?? 200;
    const startHeight = clip.height ?? 200;

    const cinema = document.querySelector(".cinima") as HTMLDivElement | null;

    if (!cinema) return;

    const rect = cinema.getBoundingClientRect();

    const MAX_WIDTH = rect.width - (clip.x ?? 0);
    const MAX_HEIGHT = rect.height - (clip.y ?? 0);

    const handleMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;

      const MIN_WIDTH = 50;
      const MIN_HEIGHT = 50;

      const nextWidth = Math.max(
        MIN_WIDTH,
        Math.min(startWidth + deltaX, MAX_WIDTH),
      );
      const nextHeight = Math.max(
        MIN_HEIGHT,
        Math.min(startHeight + deltaY, MAX_HEIGHT),
      );

      switch (direction) {
        case "right":
          updateClip(trackId, clip.id, { width: nextWidth });
          break;

        case "bottom":
          updateClip(trackId, clip.id, { height: nextHeight });
          break;

        case "corner":
          updateClip(trackId, clip.id, {
            width: nextWidth,
            height: nextHeight,
          });
          break;
      }
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);

      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);

    window.addEventListener("mouseup", handleUp);
  };

  return { startResize };
}
