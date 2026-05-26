import type { TimelineClip } from "../types";

interface Props {
  clip: TimelineClip;
  scale: number;
}

export function getAllVolumePoints({
  clip,
  scale,
}: Props) {
  const H = 20;

  const width = clip.duration * scale;

  const fadeIn =
    (clip.fadeIn ?? 0) * scale;

  const fadeOut =
    (clip.fadeOut ?? 0) * scale;

  return [
    { x: 0, y: H },

    { x: fadeIn, y: 2 },

    ...(clip.volumePoints ?? []).map(
      (point) => ({
        x: point.time * scale,

        y: H - point.value * H,
      }),
    ),

    {
      x: width - fadeOut,
      y: 2,
    },

    { x: width, y: H },
  ].sort((a, b) => a.x - b.x);
}