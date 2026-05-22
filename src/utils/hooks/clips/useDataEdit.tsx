import { useCallback, useMemo } from "react";
import { useClips } from "../../../context";
import type { Asset, TimelineClip } from "../../types";
import { hasSrc } from "../../helper";

export function useDataEdit() {
  const { setClips, setTracks } = useClips();

  const handleDeleteClip = useCallback(
    (id: string) => {
      setClips((prev) => {
        const clip = prev.find((c) => c.id === id);

        if (clip && hasSrc(clip) && clip.src.startsWith("blob:")) {
          URL.revokeObjectURL(clip.src);
        }

        return prev.filter((c) => c.id !== id);
      });

      setTracks((prev) =>
        prev.map((item) => ({
          ...item,
          clips: item.clips.filter((el) => el.assetId !== id),
        })),
      );
    },
    [setClips, setTracks],
  );

  const handleDeleteTimeLineClip = useCallback(
    (clipId: string) => {
      setTracks((prev) =>
        prev.map((track) => ({
          ...track,
          clips: track.clips.filter((clip) => clip.id !== clipId),
        })),
      );
    },
    [setTracks],
  );

  const handleEdit = useCallback(
    (id: string, data: Partial<Omit<Asset, "type">>) => {
      setClips((prev) =>
        prev.map((item) =>
          item.id === id ? ({ ...item, ...data } as Asset) : item,
        ),
      );
    },
    [setClips],
  );

  const handleTrackEdit = useCallback(
    (id: string, newName: string) => {
      setTracks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, name: newName } : t)),
      );
    },
    [setTracks],
  );

  const handleClipEdit = useCallback(
    (trackID: string, clipID: string, data: Partial<TimelineClip>) => {
      setTracks((prev) =>
        prev.map((track) =>
          track.id === trackID
            ? {
                ...track,
                clips: track.clips.map((clip) =>
                  clip.id === clipID ? { ...clip, ...data } : clip,
                ),
              }
            : track,
        ),
      );
    },
    [setTracks],
  );

  const props = useMemo(
    () => ({
      handleDeleteClip,
      handleEdit,
      handleTrackEdit,
      handleClipEdit,
      handleDeleteTimeLineClip,
    }),
    [
      handleDeleteClip,
      handleEdit,
      handleTrackEdit,
      handleClipEdit,
      handleDeleteTimeLineClip,
    ],
  );
  return { ...props };
}
