import { memo } from "react";
import type { ReactNode } from "react";
import { useMoveClip, useResizeClipViewport } from "../hooks";
import type { ClipWithTrack } from "../types";

interface Props {
  children: ReactNode;
  clip: ClipWithTrack;
}
function TransformBlock({ clip, children }: Props) {
  const { startDrag } = useMoveClip();
  const { startResize } = useResizeClipViewport();

  const style = {
    position: "absolute" as const,
    left: clip.x ?? 0,
    top: clip.y ?? 0,
    width: clip.width ?? 200,
    height: clip.height ?? 200,
    zIndex: clip.trackIndex,
  };

  return (
    <div
      className="transform_box"
      style={style}
      onMouseDown={(e) =>
        startDrag({
          e,
          clip,
          trackId: clip.trackId,
        })
      }
    >
      <div className="transform_content">{children}</div>

      <div
        className="transform_resize right"
        onMouseDown={(e) => startResize(e, clip, clip.trackId, "right")}
      />

      <div
        className="transform_resize bottom"
        onMouseDown={(e) => startResize(e, clip, clip.trackId, "bottom")}
      />

      <div
        className="transform_resize corner"
        onMouseDown={(e) => startResize(e, clip, clip.trackId, "corner")}
      />
    </div>
  );
}
export default memo(TransformBlock);
