import type { TimelineClip } from "../types";

 interface Props{
    clip: TimelineClip
    scale: number;
 }


 export function getCustomVolumePoints({clip, scale}: Props){
    const H = 40

    const points = (clip.volumePoints ?? []).map((point) => ({
        id: point.id,
        x: point.time * scale,
        y: H - point.value * H
    }))

    return points
 }