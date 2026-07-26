import { memo, useMemo } from "react";
import { useClipEdit, useDataEdit, type Track } from "../../utils";
import { useClips } from "../../context";
import type { GostClip } from "../../utils/hooks/timeline/useTimeLineDrop";
import GhostClip from "./GostClip";
import TrackClipItem from "./TrackClipItem";

interface Props {
  track: Track;
  gostClip: GostClip[];
}
function TrackRow({ track, gostClip }: Props) {
  const { clips } = useClips();

  const { handleClipEdit } = useDataEdit();
  const {
    isEditID,
    newName,
    handleChange,
    startEditing,
    saveEdit,
    cancelEdit,
  } = useClipEdit<string>({
    handleEdit: (clipID, newName) =>
      handleClipEdit(track.id, clipID, {
        name: newName,
      }),
    initialValue: "",
  });

  const activeGhosts = useMemo(() => {
    return gostClip.filter((ghost) => ghost.trackId === track.id);
  }, [gostClip, track.id]);

  //* отображение клипов на треке в зависимости от их позиции и длительности, а также масштаба таймлайна для правильного отображения ширины клипа на таймлайне */
  const TRACKS = useMemo(() => {
    return track.clips.map((clip) => {
      const ASSET = clips.find((a) => a.id === clip.assetId);
      if (!ASSET) return null;

      return (
        <TrackClipItem
          key={clip.id}
          clip={clip}
          trackID={track.id}
          isEditing={isEditID === clip.id}
          newName={newName}
          onChange={handleChange}
          onEdit={startEditing}
          onSave={saveEdit}
          onCancel={cancelEdit}
        />
      );
    });
  }, [
    track.clips,
    clips,
    isEditID,
    newName,
    cancelEdit,
    handleChange,
    saveEdit,
    startEditing,
    track.id,
  ]);

  return (
    <div className="track_row_wrapper">
      <div
        className="track_row"
        style={{
          width: "100%",
          position: "relative",
        }}
      >
        {TRACKS}

        {activeGhosts.map((ghost) => (
          <GhostClip
            key={`${ghost.trackId}-${ghost.type}`}
            ghostClip={[ghost]}
          />
        ))}
      </div>
    </div>
  );
}
export default memo(TrackRow);
