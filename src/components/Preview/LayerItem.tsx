import { memo, useEffect } from "react";
import { useMoveClip, type Asset, type ClipWithTrack } from "../../utils";

interface Props {
  clip: ClipWithTrack;
  asset: Asset;
}

function LayerItem({ clip, asset }: Props) {
  const style = {
    position: "absolute" as const,
    left: clip.x ?? 0,
    top: clip.y ?? 0,
    width: clip.width ?? 200,
    height: clip.height ?? 200,
    zIndex: clip.trackIndex,
  };

  const { startDrag } = useMoveClip();

  useEffect(() => {
    console.log(clip.x, clip.y, clip.width, clip.height);
  }, [clip.x, clip.y, clip.width, clip.height]);

  if (asset.type === "text") {
    return (
      <div className="layer" style={style}>
        {asset.text}
      </div>
    );
  }

  if (asset.type === "image") {
    return (
      <img
        onMouseDown={(e) => startDrag({ e, clip, trackId: clip.trackId })}
        src={asset.src}
        className="layer"
        style={style}
      />
    );
  }

  return null;
}

export default memo(LayerItem);
