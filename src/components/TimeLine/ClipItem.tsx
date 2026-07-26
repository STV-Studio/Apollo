import { memo, useCallback, useMemo } from "react";
import { useDragClip, useResizeClip } from "../../utils";
import type { TimelineClip } from "../../utils/types/types";
import Option_ListClip from "./Option_ListClip";
import FadeClip from "./FadeClip";
import EditBlock from "./EditBlock";
import { getClipColor } from "../../utils/helper/helperTypeClip";
import { useSelected } from "../../context/SelectionContext";
import { useZoomEffect } from "../../context/ZoomContext/ZoomContext";

interface Props {
  clip: TimelineClip;
  trackID: string;
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
  newName,
  isSelected,
  onSave,
  onCancel,
  onChange,
  isEditing,
  onEdit,
}: Props) {
  const { start, type, id } = clip;
  const { scale } = useZoomEffect();

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

  const handleSelectedClip = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      setSelectedClipId(id);
    },
    [id, setSelectedClipId],
  );

  const handleDeselectClip = useCallback(() => {
    setSelectedClipId(null);
  }, [setSelectedClipId]);

  const EditBlockProps = useMemo(
    () => ({
      isEditing,
      newName,
      onChange,
      onCancel,
      onSave,
      onEdit,
      clip,
      scale,
    }),
    [isEditing, newName, onChange, onCancel, onSave, onEdit, clip, scale],
  );

  const GostClipProps = useMemo(
    () => ({
      clip,
      trackID,
      scale,
      isSelected,
      onDeselectClip: handleDeselectClip,
    }),
    [clip, trackID, scale, isSelected, handleDeselectClip],
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
        outline: isSelected ? "2px solid #4FC3F7" : "none",
        outlineOffset: "-2px",
        boxSizing: "border-box",
        margin: 0,
        padding: "10px",
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
        <EditBlock {...EditBlockProps} />
        <Option_ListClip
          isEdit={isEditing}
          setIsEdit={() => onEdit(id, newName)}
          id={clip.id}
        />
      </div>

      {!isEditing && clip.type === "audio" && <FadeClip {...GostClipProps} />}

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

export default memo(ClipItem, (prevProps, nextProps) => {
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.newName === nextProps.newName &&
    prevProps.trackID === nextProps.trackID &&
    prevProps.clip === nextProps.clip
  );
});
