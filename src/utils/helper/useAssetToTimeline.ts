import { useCallback } from "react";
import { useClips } from "../../context";
import type { Asset, Track } from "../types";
import { CLIP_REGISTRY, type ClipType } from "./CLIP_REGISTRY";
import { createClipsFromRegistry } from "./createClipsFromRegistry";
import { canDropFromViewport } from "./helperTypeClip";

export function useAddAssetToTimeline() {
  const { tracks, addToTrack, setTracks } = useClips();

  return useCallback(
    (asset: Asset, start: number, targetTrack: Track, trackIndex: number) => {
      const type = asset.type as ClipType;

      if (!canDropFromViewport(type)) return;

      const config = CLIP_REGISTRY[type];

      let nextTrack = tracks[trackIndex + 1];

      const needsNextTrack = config.creates.length > 1;

      if (needsNextTrack && !nextTrack) {
        nextTrack = {
          id: crypto.randomUUID(),
          name: `Track ${tracks.length + 1}`,
          clips: [],
        };

        setTracks((prev) => [...prev, nextTrack!]);
      }

      createClipsFromRegistry({
        asset,
        type,
        start,
        targetTrack,
        nextTrack,
        addToTrack,
      });
    },
    [tracks, addToTrack, setTracks],
  );
}