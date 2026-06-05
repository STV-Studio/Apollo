import { memo } from "react";
import { TransformBlock } from "../../utils";
import type { Asset, ClipWithTrack } from "../../utils/";
import { useClips } from "../../context";

interface Props {
  clip: ClipWithTrack;
  asset: Asset;
}

function LayerItem({ clip, asset }: Props) {
  const { selectedClipId, setSelectedClipId } = useClips();
  const { id } = clip;
  const { src, type } = asset as Asset & { src: string; type: string };
  const text = (asset as Asset & { text?: string }).text ?? "";

  const isSelected = selectedClipId === id;

  const content =
    type === "text" ? (
      <div className="layer_text">{text}</div>
    ) : type === "image" ? (
      src.includes(".svg") || src.includes("image/svg") ? (
        <div className="layer_svg" style={{ backgroundImage: `url(${src})` }} />
      ) : (
        <img src={src} className="layer_image" draggable={false} />
      )
    ) : null;

  if (isSelected) {
    return <TransformBlock clip={clip}>{content}</TransformBlock>;
  }

  return (
    <div
      className="layer_static"
      style={{
        position: "absolute",
        left: clip.x ?? 0,
        top: clip.y ?? 0,
        width: clip.width ?? 200,
        height: clip.height ?? 200,
        zIndex: clip.trackIndex,
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setSelectedClipId(clip.id);
      }}
    >
      {content}
    </div>
  );
}

export default memo(LayerItem);
