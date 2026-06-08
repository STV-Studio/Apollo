import type { TimelineClip } from "../types";

interface CreateClipProps {
  assetId: string;
  start: number;
  duration: number;
  type: TimelineClip["type"];
  groupId?: string;

  x?: number;
  y?: number;
  width?: number;
  height?: number;
}


export function createTimelineClip({
  assetId,
  start,
  duration,
  type,
  x,
  y,
  width,
  height,
  groupId,
}: CreateClipProps): TimelineClip {
  return {
    id: crypto.randomUUID(),
    assetId,
    start,
    duration,
    type,

    name: "unknown",

    groupId,

    sourceOffset: 0,

    x: x ?? 50,
    y: y ?? 50,
    width: width ?? 200,
    height: height ?? 200,

    fadeIn: type === "audio" ? 1 : 0,
    fadeOut: type === "audio" ? 1 : 0,

    volumePoints: type === "audio" ? [] : undefined,

    rotation: 0,
    fontSize: 24
  };
}