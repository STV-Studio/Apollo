import { useClips, useCurrentTime } from "../../../context";
import type { ActiveLayers, ClipWithTrack } from "../../types";

/**
 * EN:
 * Finds currently visible visual layers for preview rendering.
 *
 * The hook:
 * - detects active clips at current playback time
 * - finds the top-most active video track
 * - collects visual layers above the video
 * - ignores audio clips
 *
 * Used by:
 * Preview renderer / canvas / overlay rendering.
 *
 * RU:
 * Находит активные визуальные слои для preview рендера.
 *
 * Хук:
 * - определяет активные клипы по `currentTime`
 * - ищет верхний активный `video clip`
 * - собирает визуальные слои поверх видео
 * - игнорирует `audio` клипы
 *
 * Используется для:
 * preview окна / canvas / overlay рендера.
 *
 * `activeLayers`
 *  EN: Collection of visible overlay layers.
 *  RU: Коллекция активных overlay слоёв.
 *
 * Logic:
 * top-most video track = base render layer
 * clips above it = hidden
 * clips below it = visible overlays
 *
 * Example:
 * Video Track 2
 * Text Track 1
 *
 * Result:
 * text layer will be rendered over the video.
 */

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

  const activeLayers: ActiveLayers = layers.filter(
    (layer) => layer.trackIndex < videoTrackIndex,
  );

  return { activeLayers };
}
