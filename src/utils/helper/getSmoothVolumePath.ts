// getSmoothVolumePath.ts
export function getSmoothVolumePath(points: { x: number; y: number }[]): string {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  // Начинаем с первой точки
  let path = `M ${points[0].x} ${points[0].y}`;

  // Если точек всего 2 (нет фейдов и кастомных точек), строим прямую линию без Безье!
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  // Для сглаживания нескольких точек ограничиваем clamping x
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    // Вычисляем контрольные точки для Catmull-Rom / Bezier
    const cp1x = Math.max(p1.x, p1.x + (p2.x - p0.x) / 6);
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = Math.min(p2.x, p2.x - (p3.x - p1.x) / 6);
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}