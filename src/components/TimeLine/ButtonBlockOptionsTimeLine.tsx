import { MdOutlineTrackChanges, MdCancel } from "react-icons/md";

import { memo } from "react";
import type { TimelineClip } from "../../utils";

interface Props {
  clip: TimelineClip;
  newName: string;
  onCancel: () => void;
  onSave: (id: string) => void;
}
function ButtonBlockOptions({ clip, newName, onCancel, onSave }: Props) {
  const { id } = clip;

  const handleSave = () => {
    onSave(id);
  };
  return (
    <div className="block_btn_optios">
      <button
        className="btn_save"
        disabled={newName.length === 0}
        title="save"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleSave}
      >
        <MdOutlineTrackChanges color="white">Save</MdOutlineTrackChanges>
      </button>

      <button className="btn_cancel" title="cancel" onClick={onCancel}>
        <MdCancel color="white" width={50}>
          Cancel
        </MdCancel>
      </button>
    </div>
  );
}
export default memo(ButtonBlockOptions);
