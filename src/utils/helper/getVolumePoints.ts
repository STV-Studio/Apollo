import type { TimelineClip } from "../types";

interface Props{
    clip: TimelineClip
    scale: number
}

export function getVolumePoints({clip, scale}: Props) {
  const width = clip.duration * scale;

  const fadeIn = (clip.fadeIn ?? 0) * scale;
  const fadeOut = (clip.fadeOut ?? 0) * scale;

  const h = 20;

  const points = [
    { x: 0, y: h },
    { x: fadeIn, y: 0 },

    ...(clip.volumePoints ?? []).map((p) => ({
      x: p.time * scale,
      y: h - p.value * h,
    })),

    { x: width - fadeOut, y: 0 },
    { x: width, y: h },
  ];

  return points
    .sort((a, b) => a.x - b.x)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");
}