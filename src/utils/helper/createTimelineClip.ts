import type { TimelineClip } from "../types";

interface CreateClipProps {
    assetId: string;
  start: number;
  duration: number;
  type: TimelineClip["type"];
  groupId?: string;
}


export function createTimelineClip({
  assetId,
  start,
  duration,
  type,
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

    x: 50,
    y: 50,
    width: 200,
    height: 200,

    fadeIn: type === "audio" ? 1 : 0,
    fadeOut: type === "audio" ? 1 : 0,

    volumePoints: type === "audio" ? [] : undefined,
  };
}