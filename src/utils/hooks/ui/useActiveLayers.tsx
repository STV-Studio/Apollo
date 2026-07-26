import { useEffect, useState } from "react";
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
  const { currentTimeRef, subscribeTime } = useCurrentTime();

  const [activeLayers, setActiveLayers] = useState<ActiveLayers>([]);

  useEffect(() => {
    const calculateLayers = (time: number) => {
      let topVideo: ClipWithTrack | null = null;
      const layers: ClipWithTrack[] = [];

      tracks.forEach((track, trackIndex) => {
        track.clips.forEach((clip) => {
          const isActive =
            time >= clip.start && time <= clip.start + clip.duration;

          if (!isActive) return;

          //  VIDEO
          if (clip.type === "video") {
            const videoWithTrack: ClipWithTrack = {
              ...clip,
              trackIndex,
              trackId: track.id,
            };

            if (!topVideo) {
              topVideo = videoWithTrack;
            } else if (trackIndex > topVideo.trackIndex) {
              topVideo = videoWithTrack;
            }
            return;
          }

          //  LAYERS (не audio / не video)
          if (clip.type !== "audio") {
            const layerWithTrack: ClipWithTrack = {
              ...clip,
              trackIndex,
              trackId: track.id,
            };

            layers.push(layerWithTrack);
          }
        });
      });

      const videoTrackIndex =
        (topVideo as ClipWithTrack | null)?.trackIndex ?? -1;

      const nextActiveLayers: ActiveLayers = layers.filter(
        (layer) => layer.trackIndex < videoTrackIndex,
      );

      //  ОПТИМИЗАЦИЯ: обновляем state ТОЛЬКО если изменились ID слоев
      setActiveLayers((prev) => {
        const isSameCount = prev.length === nextActiveLayers.length;
        const isSameContent =
          isSameCount &&
          prev.every(
            (layer, index) => layer.id === nextActiveLayers[index]?.id,
          );

        return isSameContent ? prev : nextActiveLayers;
      });
    };

    // 1. Считаем сразу при монтировании безопасным путем из ref
    calculateLayers(currentTimeRef.current);

    // 2. Подписываемся на тики времени без глобального ререндера
    const unsubscribe = subscribeTime(calculateLayers);

    return unsubscribe;
  }, [tracks, subscribeTime, currentTimeRef]);

  return { activeLayers };
}
