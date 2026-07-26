import type { TimelineClip } from "../types";
import { getCustomVolumePoints } from "./getCustomVolumePoints";

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

  const points: { x: number; y: number }[] = [];

  // 1. СТАРТ (Fade In)
  if (fadeIn > 0) {
    points.push({ x: 0, y: 20 });
    const fadeInX = Math.max(fadeIn * scale, paddingX + 5);
    points.push({ x: fadeInX, y: 5 });
  } else {
    points.push({ x: paddingX + 5, y: 5 });
  }

  // 2. КАСТОМНЫЕ ТОЧКИ ГРОМКОСТИ
  const customPoints = getCustomVolumePoints({ clip, scale });

  // 💡 ВАЖНО: Сортируем кастомные точки по X, чтобы не было хаоса
  const sortedCustomPoints = [...customPoints].sort((a, b) => a.x - b.x);

  // Добавляем точки с подстраховкой по Y (чтобы не липли к границам)
  sortedCustomPoints.forEach((pt) => {
    // Ограничиваем X, чтобы не выходили за границы фейдов
    points.push({
      x: Math.max(paddingX + 5, Math.min(pt.x, width - paddingX - 5)),
      y: Math.max(3, Math.min(pt.y, 17)), // Не даем уйти в 0 или 20, чтобы кривая не срезалась
    });
  });

  // 3. КОНЕЦ ЛИНИИ (Fade Out)
  if (fadeOut > 0) {
    const fadeOutX = Math.min(width - fadeOut * scale, width - paddingX - 5);
    points.push({ x: fadeOutX, y: 5 });
    points.push({ x: width, y: 20 });
  } else {
    points.push({ x: width - paddingX - 5, y: 5 });
  }

  // 💡 ФИНАЛЬНЫЙ ЩИТ: Жестко сортируем ВСЕ точки (включая фейды) по возрастанию X!
  return points.sort((a, b) => a.x - b.x);
}