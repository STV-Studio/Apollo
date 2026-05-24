import { useCallback, type DragEvent } from "react";
import { useClips } from "../../../context";
import { useFileReader } from "../ui/useFileReader";
import { createTimelineClip } from "../../helper/createTimelineClip";

interface Props {
  scale: number;
}

export function useTimeLineDrop({ scale }: Props) {
  const { clips, tracks, addToTrack, addClip, setTracks } = useClips();
  const { readFile } = useFileReader();

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
        const clip = clips.find((c) => c.id === clipId);
        if (!clip) return;

        const groupId = crypto.randomUUID();

        if (clip.type === "video") {
          // 🎬 VIDEO
          addToTrack(
            targetTrack.id,
            createTimelineClip({
              assetId: clip.id,
              start,
              duration: clip.duration,
              type: "video",
              groupId,
            }),
          );

          // 🔊 AUDIO (на следующую дорожку)
          let nextTrack = tracks[trackIndex + 1];
          if (!nextTrack) {
            nextTrack = {
              id: crypto.randomUUID(),
              name: `Track ${tracks.length + 1}`,
              clips: [],
            };
            setTracks((prev) => [...prev, nextTrack]);
          }

          addToTrack(
            nextTrack.id,
            createTimelineClip({
              assetId: clip.id,
              start,
              duration: clip.duration,
              type: "audio",
              groupId,
            }),
          );
        } else {
          // 🎵 AUDIO или 🖼 IMAGE (не видео)
          addToTrack(
            targetTrack.id,
            createTimelineClip({
              assetId: clip.id,
              start,
              duration: clip.duration,
              type: clip.type as "audio" | "image",
              groupId,
            }),
          );
        }
        return; // Завершаем, так как это был внутренний ассет
      }

      // --- ПЕРЕТАСКИВАНИЕ ФАЙЛА НАПРЯМУЮ ---
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        for (const file of files) {
          const newAsset = await readFile(file);
          if (!newAsset) continue;

          addClip(newAsset);
          const groupId = crypto.randomUUID();

          if (newAsset.type === "video") {
            // Видео дорожка
            addToTrack(
              targetTrack.id,
              createTimelineClip({
                assetId: newAsset.id,
                start,
                duration: newAsset.duration,
                type: "video",
                groupId,
              }),
            );

            // Аудио дорожка
            let nextTrack = tracks[trackIndex + 1];
            if (!nextTrack) {
              nextTrack = {
                id: crypto.randomUUID(),
                name: `Track ${tracks.length + 1}`,
                clips: [],
              };
              setTracks((prev) => [...prev, nextTrack]);
            }

            addToTrack(
              nextTrack.id,
              createTimelineClip({
                assetId: newAsset.id,
                start,
                duration: newAsset.duration,
                type: "audio",
                groupId,
              }),
            );
          } else if (newAsset.type === "audio") {
            addToTrack(
              targetTrack.id,
              createTimelineClip({
                assetId: newAsset.id,
                start,
                duration: newAsset.duration,
                type: "audio",
                groupId,
              }),
            );
          } else if (newAsset.type === "image") {
            addToTrack(
              targetTrack.id,
              createTimelineClip({
                assetId: newAsset.id,
                start,
                duration: newAsset.duration,
                type: "image",
                groupId,
              }),
            );
          }
        }
      }
    },
    [addClip, addToTrack, clips, readFile, tracks, scale, setTracks],
  );

  return { handleDrop };
}
