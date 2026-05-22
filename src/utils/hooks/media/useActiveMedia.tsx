import { useClips, useCurrentTime } from "../../../context";
import type { Asset, VideoAsset } from "../../types";

export function useActiveMedia() {
  const { tracks, clips } = useClips();
  const { currentTime } = useCurrentTime();

  const activeVideo = tracks
    .flatMap((t) => t.clips)
    .find(
      (clip) =>
        clip.type === "video" &&
        currentTime >= clip.start &&
        currentTime <= clip.start + clip.duration,
    );
  const activeAudios = tracks
    .flatMap((t) => t.clips)
    .filter(
      (clip) =>
        clip.type === "audio" &&
        currentTime >= clip.start &&
        currentTime <= clip.start + clip.duration,
    );

  const audioAssets = activeAudios
    .map((clip) => clips.find((a) => a.id === clip.assetId))
    .filter((a): a is Extract<Asset, { src: string }> => !!a && "src" in a);

  const videoAsset = clips.find(
    (a): a is VideoAsset => a.id === activeVideo?.assetId && a.type === "video",
  );

  return {
    activeVideo,
    activeAudios,
    videoAsset,
    audioAssets,
  };
}
