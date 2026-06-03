import { useCallback, useState, type DragEvent } from "react";
import { useClips } from "../../../context";
import { useFileReader } from "../ui/useFileReader";
import { useAddAssetToTimeline } from "../../helper/useAssetToTimeline";

interface Props {
  scale: number;
}

type GostClip = {
  trackId: string;
  start: number;
  duration: number;
  type: string;
};

export function useTimeLineDrop({ scale }: Props) {
  const { clips, tracks, addClip } = useClips();
  const { readFile } = useFileReader();
  const addAssetToTimeline = useAddAssetToTimeline();

  const [gostClip, setGostClip] = useState<GostClip | null>(null);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

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

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left + e.currentTarget.scrollLeft;
      const start = Math.max(0, Math.round((x / scale) * 10) / 10);
      const rows = document.querySelectorAll(".track_row");

      let targetTrack = null;

      for (let element = 0; element < rows.length; element++) {
        const rowRect = rows[element].getBoundingClientRect();

        if (e.clientY >= rowRect.top && e.clientY <= rowRect.bottom) {
          targetTrack = tracks[element];
          break;
        }
      }

      if (!targetTrack) {
        setGostClip(null);
        return;
      }

      const clipID = e.dataTransfer.getData("clipId");
      const asset = clips.find((item) => item.id === clipID);

      if (!asset) {
        return;
      }

      const newGostClip: GostClip = {
        trackId: targetTrack.id,
        start,
        duration: asset.duration,
        type: asset.type,
      };

      setGostClip({
        ...newGostClip,
      });
    },
    [scale, clips, tracks],
  );

  return { handleDrop, handleDragOver, gostClip };
}
