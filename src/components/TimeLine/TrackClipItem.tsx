import { memo } from "react";
import type { TimelineClip } from "../../utils";
import ClipItem from "./ClipItem";
import { useSelected } from "../../context/SelectionContext";

interface Props {
  clip: TimelineClip;
  trackID: string;
  scale: number;
  name: string | undefined;
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
    scale,
    name,
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
      scale={scale}
      trackID={trackID}
      isSelected={isSelected}
      isEditing={isEditing}
      name={name}
      newName={newName}
      onChange={onChange}
      onEdit={onEdit}
      onSave={() => onSave(clip.id)}
      onCancel={onCancel}
    />
  );
}
export default memo(TrackClipItem);
