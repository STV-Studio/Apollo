import type { TimelineClip } from "../../utils/types/types";
import type { GostClip } from "../../utils/hooks/timeline/useTimeLineDrop";

interface Props {
  clip?: TimelineClip | GostClip;
  ghostClip?: GostClip[];
  scale: number;
  start?: number;
  duration?: number;
  offsetY?: number;
}

export default function GhostClip({
  clip,
  ghostClip,
  scale,
  start,
  duration,
  offsetY = 0,
}: Props) {
  const targetClip = clip || (ghostClip && ghostClip[0]);

  if (!targetClip) return null;

  const clipId = "id" in targetClip ? targetClip.id : undefined;

  // 💡 Приоритет отдаем динамическому start из ghostState!
  const clipStart = start ?? targetClip.start ?? 0;
  const clipDuration = duration ?? targetClip.duration ?? 0;

  const widthPx = clipDuration * scale;
  const posX = clipStart * scale; // 💡 Пересчитываем позицию на каждый кадр

  return (
    <div
      data-ghost-id={clipId}
      className="ghost_clip"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${widthPx}px`,
        height: 60,
        // 💡 Используем текущие posX и offsetY из React-стейта
        transform: `translate3d(${posX}px, ${offsetY}px, 0)`,
        pointerEvents: "none",
        zIndex: 9999,
        boxSizing: "border-box",
      }}
    />
  );
}
