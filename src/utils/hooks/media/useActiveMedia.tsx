import { useEffect, useState } from "react";
import { useClips, useCurrentTime } from "../../../context";
import type { Asset, VideoAsset } from "../../types";

export function useActiveMedia() {
  const { tracks, clips } = useClips();
  const { currentTimeRef, subscribeTime } = useCurrentTime();

  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    setTime(currentTimeRef.current);
    const unsubscribe = subscribeTime((newTime) => {
      setTime(newTime);
    });
    return unsubscribe;
  }, [subscribeTime, currentTimeRef]);

  const activeVideo = tracks
    .flatMap((t) => t.clips)
    .find(
      (clip) =>
        clip.type === "video" &&
        time >= clip.start &&
        time <= clip.start + clip.duration,
    );
  const activeAudios = tracks
    .flatMap((t) => t.clips)
    .filter(
      (clip) =>
        clip.type === "audio" &&
        time >= clip.start &&
        time <= clip.start + clip.duration,
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
