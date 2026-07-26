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

      // Заминаем стартовые позиции
      const startX = clip.x ?? 0;
      const startY = clip.y ?? 0;

      let lastNextX = startX;
      let lastNextY = startY;

      // Находим элемент, который мы перетаскиваем (по data-id клипа)
      const targetElement = e.currentTarget as HTMLElement | null;

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

        // Считаем строго от НАЧАЛЬНЫХ startX/startY + дельта мыши!
        const nextX = Math.max(
          0,
          Math.min(startX + deltaX, rect.width - clipWidth),
        );

        const nextY = Math.max(
          0,
          Math.min(startY + deltaY, rect.height - clipHeight),
        );

        lastNextX = nextX;
        lastNextY = nextY;

        if (targetElement) {
          targetElement.style.left = `${nextX}px`;
          targetElement.style.top = `${nextY}px`;
        }
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);

        if (lastNextX !== clip.x || lastNextY !== clip.y) {
          updateClip(trackId, clip.id, {
            x: lastNextX,
            y: lastNextY,
          });
        }
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [updateClip],
  );

  return { startDrag };
}
