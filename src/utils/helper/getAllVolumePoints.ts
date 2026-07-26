import type { TimelineClip } from "../types";
import { getCustomVolumePoints } from "./getCustomVolumePoints";

// getAllVolumePoints.ts
export function getAllVolumePoints({
  clip,
  scale,
  paddingX = 6, 
}: {
  clip: TimelineClip;
  scale: number;
  paddingX?: number;
}) {
  const width = clip.duration * scale;
  const fadeIn = clip.fadeIn ?? 0;
  const fadeOut = clip.fadeOut ?? 0;

  const points = [];


  if (fadeIn > 0) {
    points.push({ x: 0, y: 20 });
    // Затем идет к позиции ручки
    const fadeInX = Math.max(fadeIn * scale, paddingX + 5);
    points.push({ x: fadeInX, y: 5 });
  } else {
    points.push({ x: paddingX + 5, y: 5 });
  }

  // 2. КАСТОМНЫЕ ТОЧКИ ГРОМКОСТИ
  const customPoints = getCustomVolumePoints({ clip, scale });
  points.push(...customPoints);

  // 3. КОНЕЦ ЛИНИИ (Fade Out)
  if (fadeOut > 0) {
    const fadeOutX = Math.min(width - fadeOut * scale, width - paddingX - 5);
    points.push({ x: fadeOutX, y: 5 });
    // Линия уходит в самый нижний угол
    points.push({ x: width, y: 20 });
  } else {
    points.push({ x: width - paddingX - 5, y: 5 });
  }

  return points;
}