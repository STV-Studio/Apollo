import type { TimelineClip, Track } from "../types";
import { CLIP_REGISTRY, type ClipType } from "./CLIP_REGISTRY";
import { createTimelineClip } from "./createTimelineClip";
import { getDefaultDuration } from "./getDefaultDuration";

export function createClipsFromRegistry({
  asset,
  type,
  start,
  targetTrack,
  nextTrack,
  addToTrack,
}: {
  asset: { id: string; duration: number };
  type: ClipType;
  start: number;
  targetTrack: Track;
  nextTrack?: Track;
  addToTrack: (trackId: string, clip: TimelineClip) => void;
}) {
  const config = CLIP_REGISTRY[type];
  const groupId = crypto.randomUUID();

  config.creates.forEach((clipType, index) => {
    const track = index === 0 ? targetTrack : nextTrack;
    if (!track) return;


    addToTrack(
      track.id,
      createTimelineClip({
        assetId: asset.id,
        start,
        duration: getDefaultDuration(type, asset),
        type: clipType,
        groupId,
      }),
    );
  });
}