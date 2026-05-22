import { memo, useMemo } from "react";
import { useDragClip, useResizeClip } from "../../utils";
import { useClips } from "../../context";
import type { ClipViewTimeLine, TimelineClip } from "../../utils/types/types";
import Option_ListClip from "./Option_ListClip";
import FadeClip from "./FadeClip";
import EditBlock from "./EditBlock";

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

const TYPE_COLORS: Record<ClipViewTimeLine["type"], string> = {
  image: "#718E5E",
  video: "#5E7A8C",
  audio: "#8C6D5E",
  text: "#4F3626",
  default: "#9e9e9e",
};

function ClipItem({
  clip,
  trackID,
  scale,
  newName,
  name,
  onSave,
  onCancel,
  onChange,
  isEditing,
  onEdit,
}: Props) {
  const { start, duration, type, id } = clip;
  const { onMouseDown } = useDragClip({ start, id, trackID });
  const { setSelectedClipId, selectedClipId } = useClips();
  const { onResizeStart } = useResizeClip({
    id: clip.id,
    trackID,
    start: clip.start,
    duration: clip.duration,
    assetId: clip.assetId,
    sourceOffset: clip.sourceOffset ?? 0,
  });

  const backgroundColor = TYPE_COLORS[type] || TYPE_COLORS.default;

  const handleSelectedClip = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setSelectedClipId(id);
  };
  const isSelected = selectedClipId === id;

  const props = useMemo(
    () => ({
      clip,
      newName,
      onCancel,
      onSave,
      onChange,
      scale,
      name,
      onEdit,
      isEditing,
      trackID,
    }),
    [
      clip,
      newName,
      onCancel,
      onSave,
      onChange,
      scale,
      name,
      onEdit,
      isEditing,
      trackID,
    ],
  );

  return (
    <div
      onClick={handleSelectedClip}
      className="clip_block"
      style={{
        position: "absolute",
        left: start * scale,
        width: Math.max(duration * scale, 3),
        height: 40,
        background: backgroundColor,

        border:
          selectedClipId === id ? "2px solid #4FC3F7" : "2px solid transparent",
      }}
      onMouseDown={(e) => {
        if (!isSelected || isEditing) return;
        onMouseDown(e);
      }}
    >
      {/* левая ручка */}
      {!isEditing && (
        <div
          className="resize_handle left"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(e, "left");
          }}
        />
      )}

      {/* контент */}
      <div className="block_edit_Clip">
        <EditBlock {...props} />
        <Option_ListClip
          isEdit={isEditing}
          setIsEdit={() => onEdit(id, newName)}
          id={clip.id}
        />
      </div>

      {!isEditing && clip.type === "audio" && <FadeClip {...props} />}

      {/* правая ручка */}
      {!isEditing && (
        <div
          className="resize_handle right"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(e, "right");
          }}
        />
      )}
    </div>
  );
}
export default memo(ClipItem);
