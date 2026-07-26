import { useClips, useCurrentTime } from "../../../context";
import { useCallback } from "react";
import { createClipsFromRegistry } from "../../helper/createClipsFromRegistry";
import type { TextAsset } from "../..";

export function useText() {
  const { addClip, addToTrack, tracks, setClips } = useClips();
  const { currentTimeRef } = useCurrentTime();

  const handleAddedText = useCallback(() => {
    const targetTrack = tracks[0];

    if (!targetTrack) return;

    const asset: TextAsset = {
      id: crypto.randomUUID(),
      type: "text",
      text: "New Text",
      size: 5,
      duration: 5,
      name: "Text",
      fontSize: 20,
    };

    addClip(asset);

    createClipsFromRegistry({
      asset,
      type: "text",
      start: currentTimeRef.current,
      targetTrack,
      addToTrack,
    });
  }, [addClip, addToTrack, currentTimeRef, tracks]);

  const handleUpdateText = useCallback(
    (idText: string, text: string) => {
      setClips((prev) =>
        prev.map((clip) => (clip.id === idText ? { ...clip, text } : clip)),
      );
    },
    [setClips],
  );
  return { handleAddedText, handleUpdateText };
}
