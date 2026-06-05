import { memo } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  useMoveClip,
  useResizeClipViewport,
  useRotateClipViewport,
} from "../hooks";
import type { ClipWithTrack } from "../types";

interface Props {
  children: ReactNode;
  clip: ClipWithTrack;
}
function TransformBlock({ clip, children }: Props) {
  const { startDrag } = useMoveClip();
  const { startResize } = useResizeClipViewport();
  const { startRotate } = useRotateClipViewport();

  const style: CSSProperties = {
    position: "absolute",
    left: clip.x ?? 0,
    top: clip.y ?? 0,
    width: clip.width ?? 200,
    height: clip.height ?? 200,
    zIndex: clip.trackIndex,
    transform: `rotate(${clip.rotation ?? 0}deg)`,
    transformOrigin: "center center",
  };

  return (
    <div
      className="transform_box"
      style={style}
      onMouseDown={(e) => {
        e.stopPropagation();
        startDrag({
          e,
          clip,
          trackId: clip.trackId,
        });
      }}
    >
      <div
        className="transform_rotate"
        onMouseDown={(e) => startRotate(e, clip, clip.trackId)}
      />
      {children}
      {(
        [
          "top-left",
          "top-right",
          "bottom-left",
          "bottom-right",
          "left",
          "right",
          "top",
          "bottom",
        ] as const
      ).map((dir) => (
        <div
          key={dir}
          className={`transform_resize ${dir}`}
          onMouseDown={(e) => startResize(e, clip, clip.trackId, dir)}
        />
      ))}
    </div>
  );
}
export default memo(TransformBlock);
