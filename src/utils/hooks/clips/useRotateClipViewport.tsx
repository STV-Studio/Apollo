import { useClips } from "../../../context";
import type { ClipWithTrack } from "../../types";

export function useRotateClipViewport() {
  const { updateClip } = useClips();

  const startRotate = (
    e: React.MouseEvent,
    clip: ClipWithTrack,
    trackId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    document.body.classList.add("rotating");

    const box = (e.currentTarget as HTMLElement).closest(
      ".transform_box",
    ) as HTMLDivElement | null;

    if (!box) return;

    const rect = box.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startRotation = clip.rotation ?? 0;

    const startAngle =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    const handleMove = (moveEvent: MouseEvent) => {
      const currentAngle =
        Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) *
        (180 / Math.PI);

      const deltaAngle = currentAngle - startAngle;

      updateClip(trackId, clip.id, {
        rotation: startRotation + deltaAngle,
      });
    };

    const handleUp = () => {
      document.body.classList.remove("rotating");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return { startRotate };
}
