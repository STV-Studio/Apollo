import { memo } from "react";
import type { TimelineClip } from "../../utils";
import ClipItem from "./ClipItem";
import { useSelected } from "../../context/SelectionContext";

interface Props {
  clip: TimelineClip;
  trackID: string;
  isEditing: boolean;
  newName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (id: string, value: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
}
function TrackClipItem(props: Props) {
  const {
    clip,
    trackID,
    isEditing,
    newName,
    onChange,
    onCancel,
    onEdit,
    onSave,
  } = props;
  const { selectedClipId } = useSelected();
  const isSelected = selectedClipId === clip.id;
  return (
    <ClipItem
      clip={clip}
      trackID={trackID}
      isSelected={isSelected}
      isEditing={isEditing}
      newName={newName}
      onChange={onChange}
      onEdit={onEdit}
      onSave={() => onSave(clip.id)}
      onCancel={onCancel}
    />
  );
}
export default memo(TrackClipItem);
