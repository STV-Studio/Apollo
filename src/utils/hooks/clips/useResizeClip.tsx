import { useClips, usePreview } from "../../../context";
import { useSelected } from "../../../context/SelectionContext";
import { pauseAllMedia } from "../../helper";

interface Props {
  id: string;
  trackID: string;
  start: number;
  duration: number;
  assetId: string;
  sourceOffset: number;
  scale?: number;
}

export function useResizeClip({
  id,
  trackID,
  start,
  duration,
  assetId,
  sourceOffset,
  scale = 50,
}: Props) {
  const { updateClip, clips } = useClips();
  const { selectedClipId } = useSelected();
  const { VIDEO_REF, setIsPlay } = usePreview();

  const onResizeStart = (e: React.MouseEvent, side: "left" | "right") => {
    e.stopPropagation();
    if (selectedClipId !== id) return;

    pauseAllMedia(VIDEO_REF.current);
    setIsPlay(false);

    const asset = clips.find((el) => el.id === assetId);
    if (!asset || !("duration" in asset)) return;

    const startMouseX = e.clientX;

    // Начальные параметры клипа перед стартом ресайза
    const initialStart = start;
    const initialDuration = duration;
    const initialOffset = sourceOffset;

    let finalStart = initialStart;
    let finalDuration = initialDuration;
    let finalOffset = initialOffset;

    const MIN_DURATION = 0.05;

    // 💡 Ищем DOM-элемент клипа по data-clip-id
    const clipElement = document.querySelector(
      `[data-clip-id="${id}"]`,
    ) as HTMLElement | null;

    const handleMove = (moveEvent: MouseEvent) => {
      const deltaPx = moveEvent.clientX - startMouseX;
      const deltaSec = deltaPx / scale;

      if (side === "right") {
        const maxDuration = asset.duration - initialOffset;
        let newDuration = initialDuration + deltaSec;

        newDuration = Math.max(
          MIN_DURATION,
          Math.min(newDuration, maxDuration),
        );

        finalDuration = newDuration;

        if (clipElement) {
          clipElement.style.width = `${newDuration * scale}px`;
        }
      }

      if (side === "left") {
        let newStart = initialStart + deltaSec;
        let newDuration = initialDuration - deltaSec;
        let newOffset = initialOffset + deltaSec;

        if (newOffset < 0) {
          newOffset = 0;
          newStart = initialStart - initialOffset; // Исправлен знак!
          newDuration = initialDuration + initialOffset;
        }

        if (newDuration < MIN_DURATION) {
          newDuration = MIN_DURATION;
          newStart = initialStart + (initialDuration - MIN_DURATION);
          newOffset = initialOffset + (initialDuration - MIN_DURATION);
        }

        finalStart = newStart;
        finalDuration = newDuration;
        finalOffset = newOffset;

        if (clipElement) {
          clipElement.style.left = `${newStart * scale}px`;
          clipElement.style.width = `${newDuration * scale}px`;
        }
      }
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);

      updateClip(trackID, id, {
        start: finalStart,
        duration: finalDuration,
        sourceOffset: finalOffset,
      });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return { onResizeStart };
}
