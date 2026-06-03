import { useCallback, useEffect, useState, type DragEvent } from "react";
import { useClips } from "../../../context";
import { useFileReader } from "../ui/useFileReader";
import { useAddAssetToTimeline } from "../../helper/useAssetToTimeline";

interface Props {
  scale: number;
}

export type GostClip = {
  trackId: string;
  start: number;
  duration: number;
  type: string;
};

export function useTimeLineDrop({ scale }: Props) {
  const { clips, tracks, addClip } = useClips();
  const { readFile } = useFileReader();
  const addAssetToTimeline = useAddAssetToTimeline();

  const [gostClip, setGostClip] = useState<GostClip[]>([]);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setGostClip([]);
      document.body.classList.add("is-dragging");
      delete document.body.dataset.dragClipId;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left + e.currentTarget.scrollLeft;
      const start = Math.max(0, Math.round((x / scale) * 10) / 10);
      const rows = document.querySelectorAll(".track_row");

      let trackIndex = -1;
      let targetTrack = null;

      for (let i = 0; i < rows.length; i++) {
        const rowRect = rows[i].getBoundingClientRect();
        if (e.clientY >= rowRect.top && e.clientY <= rowRect.bottom) {
          targetTrack = tracks[i];
          trackIndex = i;
          break;
        }
      }

      if (!targetTrack) return;

      // --- ПЕРЕТАСКИВАНИЕ ИЗ ASSETS ---
      const clipId = e.dataTransfer.getData("clipId");

      if (clipId) {
        const asset = clips.find((c) => c.id === clipId);
        if (!asset) return;

        addAssetToTimeline(asset, start, targetTrack, trackIndex);
        return;
      }

      // --- ПЕРЕТАСКИВАНИЕ ФАЙЛА НАПРЯМУЮ ---
      const files = e.dataTransfer.files;

      if (files && files.length > 0) {
        for (const file of files) {
          const newAsset = await readFile(file);
          if (!newAsset) continue;

          addClip(newAsset);
          addAssetToTimeline(newAsset, start, targetTrack, trackIndex);
        }
      }
    },
    [addAssetToTimeline, addClip, clips, readFile, tracks, scale],
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left + e.currentTarget.scrollLeft;
      const start = Math.max(0, Math.round((x / scale) * 10) / 10);
      const rows = document.querySelectorAll(".track_row");

      let targetTrack = null;
      let trackIndex = -1;

      for (let element = 0; element < rows.length; element++) {
        const rowRect = rows[element].getBoundingClientRect();

        if (e.clientY >= rowRect.top && e.clientY <= rowRect.bottom) {
          targetTrack = tracks[element];
          trackIndex = element;
          break;
        }
      }

      if (!targetTrack) {
        setGostClip([]);
        return;
      }

      const clipID =
        e.dataTransfer.getData("clipId") || document.body.dataset.dragClipId;
      const asset = clips.find((item) => item.id === clipID);

      if (!asset) {
        setGostClip([]);
        return;
      }

      const ghostList: GostClip[] = [
        {
          trackId: targetTrack.id,
          start,
          duration: asset.duration,
          type: asset.type,
        },
      ];

      if (asset.type === "video") {
        const nextTrack = tracks[trackIndex + 1];

        if (nextTrack) {
          ghostList.push({
            trackId: nextTrack.id,
            start,
            duration: asset.duration,
            type: "audio",
          });
        }
      }

      setGostClip(ghostList);
    },
    [scale, clips, tracks],
  );

  useEffect(() => {
    const clear = () => setGostClip([]);

    window.addEventListener("clear-ghost", clear);

    return () => {
      window.removeEventListener("clear-ghost", clear);
    };
  }, []);

  return { handleDrop, handleDragOver, gostClip, setGostClip };
}
