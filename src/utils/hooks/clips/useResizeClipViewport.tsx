import { useClips } from "../../../context";
import type { TimelineClip } from "../../types";

const MIN_WIDTH = 50;
const MIN_HEIGHT = 50;
const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 200;

type ResizeDirection =
  | "right"
  | "left"
  | "top"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

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

    const startX = clip.x ?? 0;
    const startY = clip.y ?? 0;
    const startWidth = clip.width ?? DEFAULT_WIDTH;
    const startHeight = clip.height ?? DEFAULT_HEIGHT;

    const cinema = document.querySelector(".cinima") as HTMLDivElement | null;
    if (!cinema) return;

    const rect = cinema.getBoundingClientRect();

    const handleMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;

      const isShift = moveEvent.shiftKey;
      const ratio = startHeight / startWidth;

      let x = startX;
      let y = startY;
      let width = startWidth;
      let height = startHeight;

      const canResizeLeft = direction.includes("left");
      const canResizeRight = direction.includes("right");
      const canResizeTop = direction.includes("top");
      const canResizeBottom = direction.includes("bottom");

      if (canResizeRight) {
        width = clamp(startWidth + deltaX, MIN_WIDTH, rect.width - startX);
      }

      if (canResizeLeft) {
        width = clamp(startWidth - deltaX, MIN_WIDTH, startX + startWidth);
        x = startX + (startWidth - width);
      }

      if (canResizeBottom) {
        height = clamp(startHeight + deltaY, MIN_HEIGHT, rect.height - startY);
      }

      if (canResizeTop) {
        height = clamp(startHeight - deltaY, MIN_HEIGHT, startY + startHeight);
        y = startY + (startHeight - height);
      }

      if (isShift) {
        const isHorizontal = canResizeLeft || canResizeRight;

        if (isHorizontal) {
          height = width * ratio;

          if (canResizeTop) {
            y = startY + (startHeight - height);
          }
        } else {
          width = height / ratio;

          if (canResizeLeft) {
            x = startX + (startWidth - width);
          }
        }

        width = clamp(width, MIN_WIDTH, rect.width - x);
        height = clamp(height, MIN_HEIGHT, rect.height - y);
      }

      updateClip(trackId, clip.id, { x, y, width, height });
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
