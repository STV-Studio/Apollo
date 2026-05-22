import { memo, useMemo } from "react";
import { onKey, type TimelineClip } from "../../utils";
import ButtonBlockOptionsTimeLine from "./ButtonBlockOptionsTimeLine";
interface Props {
  isEditing: boolean;
  newName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement, Element>) => void;
  onCancel: () => void;
  onSave: (id: string) => void;
  onEdit: (id: string, value: string) => void;
  clip: TimelineClip;
  scale: number;
}
function EditBlock({
  isEditing,
  newName,
  onChange,
  onCancel,
  onSave,
  onEdit,
  clip,
  scale,
}: Props) {
  const { id, name, duration } = clip;

  const width = duration * scale;
  const props = useMemo(
    () => ({ clip, newName, onCancel, onSave }),
    [clip, newName, onCancel, onSave],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const press = onKey(e);

    press.enter(() => onSave(id));
    press.esc(() => onCancel());
  };

  let nameContent;

  if (isEditing) {
    nameContent = (
      <div className="block_edit_name">
        <input
          type="text"
          value={newName}
          placeholder="new name"
          onChange={onChange}
          autoFocus
          onBlur={onCancel}
          onKeyDown={handleKeyDown}
        />
        <ButtonBlockOptionsTimeLine {...props} />
      </div>
    );
  } else {
    nameContent = (
      <h4
        style={{
          overflow: width < 105 ? "hidden" : "visible",
          textOverflow: width < 105 ? "ellipsis" : "clip",
          whiteSpace: "nowrap",
        }}
        className="asset_name"
        onDoubleClick={() => !isEditing && onEdit(id, name || "")}
      >
        Name: {clip.name || name || id.slice(0, 4)}
      </h4>
    );
  }
  return <>{nameContent}</>;
}
export default memo(EditBlock);
