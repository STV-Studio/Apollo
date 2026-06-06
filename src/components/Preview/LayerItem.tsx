import { memo, useState } from "react";
import { TransformBlock, useText } from "../../utils";
import type { Asset, ClipWithTrack } from "../../utils/";
import { useClips } from "../../context";

interface Props {
  clip: ClipWithTrack;
  asset: Asset;
}

function LayerItem({ clip, asset }: Props) {
  const { selectedClipId, setSelectedClipId } = useClips();
  const { handleUpdateText } = useText();
  const { src, type } = asset as Asset & { src: string; type: string };

  const [isTextEdit, setIsTextEdit] = useState(false);
  const [newText, setNewText] = useState("");

  const isSelected = selectedClipId === clip.id;

  const saveText = () => {
    if (asset.type !== "text") return;

    handleUpdateText(asset.id, newText);
    setIsTextEdit(false);
  };

  const content =
    asset.type === "text" ? (
      isTextEdit ? (
        <input
          className="layer_text_input"
          value={newText}
          autoFocus
          onChange={(e) => setNewText(e.target.value)}
          onBlur={saveText}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveText();

            if (e.key === "Escape") {
              setIsTextEdit(false);
              setNewText(asset.text);
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          className="layer_text"
          onDoubleClick={(e) => {
            e.stopPropagation();
            setSelectedClipId(clip.id);
            setNewText(asset.text);
            setIsTextEdit(true);
          }}
        >
          {asset.text}
        </div>
      )
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
        transform: `rotate(${clip.rotation ?? 0}deg)`,
        transformOrigin: "center center",
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedClipId(clip.id);
      }}
    >
      {content}
    </div>
  );
}

export default memo(LayerItem);
