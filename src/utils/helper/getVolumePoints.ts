import type { TimelineClip } from "../types";

interface Props{
    clip: TimelineClip
    scale: number
}

export function getVolumePoints({clip, scale}: Props) {
  const width = clip.duration * scale;

  const fadeIn = (clip.fadeIn ?? 0) * scale;
  const fadeOut = (clip.fadeOut ?? 0) * scale;

  const h = 40;

  return `
    0,${h}
    ${fadeIn},0
    ${width - fadeOut},0
    ${width},${h}
  `;
}