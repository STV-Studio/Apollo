export function getSmoothVolumePath(
  points: { x: number; y: number }[],
) {
  if (points.length < 2) return "";

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    const midX = (prev.x + curr.x) / 2;

    d += `
      Q ${midX} ${prev.y},
      ${curr.x} ${curr.y}
    `;
  }

  return d;
}