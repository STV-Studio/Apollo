import { memo, type ChangeEvent, type KeyboardEvent } from "react";
import type { Track } from "../../utils";
import { onKey } from "../../utils";

interface Props {
  track: Track;
  index: number;
  setTrack: React.Dispatch<React.SetStateAction<Track[]>>;

  isEditing: boolean;
  newName: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEdit: (id: string, currentName: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
}

function TrackSidebar({
  track,
  index,
  setTrack,
  isEditing,
  newName,
  onChange,
  onEdit,
  onSave,
  onCancel,
}: Props) {
  const handleDelete = () => {
    setTrack((prev) => prev.filter((el) => el.id !== track.id));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const press = onKey(e);
    press.enter(() => onSave(track.id));
    press.esc(() => onCancel());
  };

  let content;

  if (isEditing) {
    content = (
      <div className="block_edit_text_tracks">
        <input
          className="edit_name_tracks"
          value={newName}
          onChange={onChange}
          autoFocus
          onBlur={onCancel}
          onKeyDown={handleKeyDown}
        />
        <button className="save_changes_btn" onClick={() => onSave(track.id)}>
          ✔
        </button>
        <button className="remove_changes_btn" onClick={onCancel}>
          ✖
        </button>
      </div>
    );
  } else {
    content = (
      <h4 onDoubleClick={() => onEdit(track.id, track.name || "")}>
        {track.name || `track-${index + 1}`}
      </h4>
    );
  }

  return (
    <div className="track_label">
      {content}
      {!isEditing ? (
        <button className="delete_btn_tracks" onClick={handleDelete}>
          -
        </button>
      ) : null}
    </div>
  );
}

export default memo(TrackSidebar);
