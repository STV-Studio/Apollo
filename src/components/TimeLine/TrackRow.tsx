import { memo, useMemo } from "react";
import { useClipEdit, useDataEdit, type Track } from "../../utils";
import { useClips } from "../../context";
import ClipItem from "./ClipItem";

interface Props {
  track: Track;
  scale: number;
}
function TrackRow({ track, scale }: Props) {
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

  //* отображение клипов на треке в зависимости от их позиции и длительности, а также масштаба таймлайна для правильного отображения ширины клипа на таймлайне */
  const TRACKS = useMemo(() => {
    return track.clips.map((clip) => {
      const ASSETS = clips.find((a) => a.id === clip.assetId);
      if (!ASSETS) return null;
      return (
        <ClipItem
          key={clip.id}
          clip={{
            ...clip,
          }}
          name={ASSETS.name}
          scale={scale}
          trackID={track.id}
          isEditing={isEditID === clip.id}
          newName={newName}
          onChange={handleChange}
          onEdit={startEditing}
          onSave={() => saveEdit(clip.id)}
          onCancel={cancelEdit}
        />
      );
    });
  }, [
    track.clips,
    clips,
    scale,
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
      <div className="track_row">{TRACKS}</div>
    </div>
  );
}
export default memo(TrackRow);
