import type { TimelineClip } from "../types";

 interface Props{
    clip: TimelineClip
    scale: number;
 }


 export function getCustomVolumePoints({clip, scale}: Props){
    const H = 20

    const TOP_PADDING = 2;
    const BOTTOM_PADDING = 2;

    const MIN_Y = TOP_PADDING;
    const MAX_Y = H - BOTTOM_PADDING;

    const points = (clip.volumePoints ?? []).map((point) => {
        
      const rawY =
        H - point.value * H;

      const y = Math.max(
        MIN_Y,
        Math.min(rawY, MAX_Y),
      );

      return {
        id: point.id,
        x: point.time * scale,
        y,
      }
    })

    return points
 }