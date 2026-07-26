import { useEffect, useRef, useState } from "react";
import { useClips, usePreview } from "../../../context";
import { pauseAllMedia } from "../../helper";
import { useSelected } from "../../../context/SelectionContext";

interface Props {
  id: string;
  trackID: string;
  start: number;
  scale: number; // 💡 Обязательно передаем актуальный scale из ClipItem!
}

export function useDragClip({ start, id, trackID, scale }: Props) {
  const { updateClip, moveClipToTrack, tracks } = useClips();
  const { setSelectedClipId } = useSelected();
  const { setIsPlay, VIDEO_REF } = usePreview();

  const [isDragging, setIsDragging] = useState(false);

  const currentTrackID = useRef(trackID);
  const startMouseX = useRef(0);
  const startMouseY = useRef(0);
  const startScrollLeft = useRef(0);
  const initialClipStartSec = useRef(start);
  const finalStartSec = useRef(start);
  const targetTrackID = useRef<string>(trackID);

  const rafId = useRef<number | null>(null);

  // 💡 Всегда имеем свежую ссылку на scale
  const scaleRef = useRef(scale);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    currentTrackID.current = trackID;
  }, [trackID]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    pauseAllMedia(VIDEO_REF.current);
    setIsPlay(false);
    setSelectedClipId(id);

    const clipElement = e.currentTarget as HTMLElement;
    const scrollContainer = clipElement.closest(
      ".timeline_scroll_viewport",
    ) as HTMLElement | null;

    startMouseX.current = e.clientX;
    startMouseY.current = e.clientY;
    startScrollLeft.current = scrollContainer ? scrollContainer.scrollLeft : 0;

    initialClipStartSec.current = start;
    finalStartSec.current = start;
    targetTrackID.current = trackID;

    setIsDragging(true);

    const rows = Array.from(document.querySelectorAll(".track_row"));

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (rafId.current !== null) return;

      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;

        const currentScale = scaleRef.current; // Используем АКТУАЛЬНЫЙ scale!
        const currentScrollLeft = scrollContainer
          ? scrollContainer.scrollLeft
          : 0;
        const scrollDelta = currentScrollLeft - startScrollLeft.current;

        // Физическое смещение мышкой с учетом скролла
        let mouseDeltaPx =
          moveEvent.clientX - startMouseX.current + scrollDelta;
        const mouseDeltaY = moveEvent.clientY - startMouseY.current;

        // Исходная позиция клипа при ТЕКУЩЕМ масштабе
        const startClipPx = initialClipStartSec.current * currentScale;

        // Ограничение левого края (0 секунд)
        if (startClipPx + mouseDeltaPx < 0) {
          mouseDeltaPx = -startClipPx;
        }

        const newStartSec = (startClipPx + mouseDeltaPx) / currentScale;
        finalStartSec.current = newStartSec;

        clipElement.style.transform = `translate3d(${mouseDeltaPx}px, ${mouseDeltaY}px, 0)`;
        clipElement.style.zIndex = "9999";

        // Детект дорожек
        let hoveredTrackID: string | null = null;
        rows.forEach((row, index) => {
          const rowRect = row.getBoundingClientRect();
          if (
            moveEvent.clientY >= rowRect.top &&
            moveEvent.clientY <= rowRect.bottom
          ) {
            hoveredTrackID = tracks[index]?.id || null;
          }
        });

        if (hoveredTrackID) {
          targetTrackID.current = hoveredTrackID;
        }
      });
    };

    const handleMouseUp = () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }

      clipElement.style.transform = "";
      clipElement.style.zIndex = "";

      setIsDragging(false);

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      const isSameTrack = targetTrackID.current === currentTrackID.current;

      if (isSameTrack) {
        updateClip(currentTrackID.current, id, {
          start: finalStartSec.current,
        });
      } else {
        moveClipToTrack(currentTrackID.current, targetTrackID.current, id);
        updateClip(targetTrackID.current, id, {
          start: finalStartSec.current,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return { onMouseDown, isDragging };
}
