import { useClips, usePreview } from "../../../context";
import { pauseAllMedia } from "../../helper";

interface Props {
  id: string;
  trackID: string;
  start: number;
  duration: number;
  assetId: string;
  sourceOffset: number;
}

export function useResizeClip({
  id,
  trackID,
  start,
  duration,
  assetId,
  sourceOffset,
}: Props) {
  const { updateClip, selectedClipId, clips } = useClips();
  const { VIDEO_REF, setIsPlay } = usePreview();

  const onResizeStart = (e: React.MouseEvent, side: "left" | "right") => {
    e.stopPropagation();
    if (selectedClipId !== id) return;

    pauseAllMedia(VIDEO_REF.current);
    setIsPlay(false);

    // 💣 безопасный asset
    const asset = clips.find((el) => el.id === assetId);
    if (!asset || !("duration" in asset)) return;

    const startX = e.clientX;

    let prevX = startX;
    let currentStart = start;
    let currentDuration = duration;
    let currentOffset = sourceOffset;

    const MIN_DURATION = 0.05;

    const handleMove = (moveEvent: MouseEvent) => {
      const deltaPx = moveEvent.clientX - prevX;
      prevX = moveEvent.clientX;

      const SPEED = 0.01;
      const delta = deltaPx * SPEED;

      // 👉 RIGHT (растягиваем вправо)
      if (side === "right") {
        const maxDuration = asset.duration - currentOffset;

        let newDuration = currentDuration + delta;

        newDuration = Math.max(MIN_DURATION, newDuration);
        newDuration = Math.min(newDuration, maxDuration);

        currentDuration = newDuration;

        updateClip(trackID, id, {
          duration: newDuration,
        });
      }

      // 👉 LEFT (тянем влево)
      if (side === "left") {
        let newStart = currentStart + delta;
        let newDuration = currentDuration - delta;
        let newOffset = currentOffset + delta;

        // ❗ нельзя уйти в минус
        if (newOffset < 0) {
          newOffset = 0;
          newStart = currentStart + currentOffset;
        }

        // ❗ нельзя выйти за конец
        if (newOffset + newDuration > asset.duration) {
          newDuration = asset.duration - newOffset;
        }

        // ❗ минимальная длина
        if (newDuration < MIN_DURATION) {
          newDuration = MIN_DURATION;
        }

        currentStart = newStart;
        currentDuration = newDuration;
        currentOffset = newOffset;

        updateClip(trackID, id, {
          start: newStart,
          duration: newDuration,
          sourceOffset: newOffset,
        });
      }
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return { onResizeStart };
}
