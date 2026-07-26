import { memo, useMemo } from "react";
import { useDragClip, useResizeClip } from "../../utils";
import type { TimelineClip } from "../../utils/types/types";
import Option_ListClip from "./Option_ListClip";
import FadeClip from "./FadeClip";
import EditBlock from "./EditBlock";
import { getClipColor } from "../../utils/helper/helperTypeClip";
import { useSelected } from "../../context/SelectionContext";

interface Props {
  clip: TimelineClip;
  trackID: string;
  scale: number;
  name: string | undefined;
  isEditing: boolean;
  newName: string;
  isSelected: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (id: string, value: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
}

function ClipItem({
  clip,
  trackID,
  scale,
  newName,
  name,
  isSelected,
  onSave,
  onCancel,
  onChange,
  isEditing,
  onEdit,
}: Props) {
  const { start, type, id } = clip;
  const { onMouseDown, isDragging } = useDragClip({
    start,
    id,
    trackID,
    scale,
  });
  const { setSelectedClipId } = useSelected();
  const { onResizeStart } = useResizeClip({
    id: clip.id,
    trackID,
    start: clip.start,
    duration: clip.duration,
    assetId: clip.assetId,
    sourceOffset: clip.sourceOffset ?? 0,
    scale,
  });

  const backgroundColor = getClipColor(type === "default" ? "effect" : type);

  const handleSelectedClip = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setSelectedClipId(id);
  };

  const props = useMemo(
    () => ({
      isSelected,
      onDeselectClip: () => setSelectedClipId(null),
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
      isSelected,
      setSelectedClipId,
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
      onMouseDown={(e) => {
        if (isEditing) return;
        onMouseDown(e);
      }}
      onClick={handleSelectedClip}
      data-clip-id={clip.id}
      className={`clip_block ${isDragging ? "is_dragging" : ""}`}
      style={{
        position: "absolute",
        left: `${clip.start * scale}px`,
        width: `${clip.duration * scale}px`,
        height: 60,
        background: backgroundColor,
        // 💡 Используем outline вместо border, чтобы рамка НЕ МЕНЯЛА геометрические размеры блока!
        outline: isSelected ? "2px solid #4FC3F7" : "none",
        outlineOffset: "-2px",
        boxSizing: "border-box", // 💡 Жестко фиксируем расчет геометрии
        margin: 0,
        padding: "10px", // Фиксированный внутренний отступ
        opacity: isDragging ? 0.6 : 1,
        pointerEvents: "auto",
        willChange: "transform",
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
