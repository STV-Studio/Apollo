export function getSmoothVolumePath(points: { x: number; y: number }[]): string {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    // Вычисляем контрольные точки
    let cp1x = p1.x + (p2.x - p0.x) / 6;
    let cp1y = p1.y + (p2.y - p0.y) / 6;

    let cp2x = p2.x - (p3.x - p1.x) / 6;
    let cp2y = p2.y - (p3.y - p1.y) / 6;

    // 💡 ЗАЩИТА ОТ ПЕТЕЛЬ: Контрольные точки НЕ должны выходить за пределы интервала [p1.x, p2.x]
    cp1x = Math.max(p1.x, Math.min(cp1x, p2.x));
    cp2x = Math.max(p1.x, Math.min(cp2x, p2.x));

    // 💡 ЗАЩИТА ОТ ВЫЛЕТОВ ПО Y: Ограничиваем Y в пределах контейнера (0..20)
    cp1y = Math.max(0, Math.min(cp1y, 20));
    cp2y = Math.max(0, Math.min(cp2y, 20));

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}