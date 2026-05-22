import { useClips, useCurrentTime } from "../../../context";
import type { ClipWithTrack } from "../../types";

export function useActiveLayers() {
  const { tracks } = useClips();
  const { currentTime } = useCurrentTime();

  let topVideo: ClipWithTrack | null = null;
  const layers: ClipWithTrack[] = [];

  tracks.forEach((track, trackIndex) => {
    track.clips.forEach((clip) => {
      const isActive =
        currentTime >= clip.start && currentTime <= clip.start + clip.duration;

      if (!isActive) return;

      // 🎬 VIDEO
      if (clip.type === "video") {
        const videoWithTrack: ClipWithTrack = {
          ...clip,
          trackIndex,
        };

        if (!topVideo) {
          topVideo = videoWithTrack;
        } else if (trackIndex > topVideo.trackIndex) {
          topVideo = videoWithTrack;
        }
        return;
      }

      // 🎨 LAYERS (не audio / не video)
      if (clip.type !== "audio") {
        const layerWithTrack: ClipWithTrack = {
          ...clip,
          trackIndex,
        };

        layers.push(layerWithTrack);
      }
    });
  });

  const videoTrackIndex = (topVideo as ClipWithTrack | null)?.trackIndex ?? -1;

  const activeLayers = layers.filter(
    (layer) => layer.trackIndex < videoTrackIndex,
  );

  return { activeLayers };
}
