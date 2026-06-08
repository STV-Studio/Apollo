import { memo } from "react";
import { TransformBlock } from "../../utils";
import type { Asset, ClipWithTrack } from "../../utils/";
import { useClips } from "../../context";
import TextView from "./Assets/TextView";
import ImageVeiw from "./Assets/ImageVeiw";
import ShapeView from "./Assets/ShapeView";

interface Props {
  clip: ClipWithTrack;
  asset: Asset;
}

function LayerItem({ clip, asset }: Props) {
  const { selectedClipId, setSelectedClipId } = useClips();
  const isSelected = selectedClipId === clip.id;

  const renderContent = () => {
    if (asset.type === "text") {
      return (
        <TextView
          asset={asset}
          clip={clip}
          isSelected={isSelected}
          setSelectedClipId={setSelectedClipId}
        />
      );
    }

    if (asset.type === "image" && asset.src) {
      return <ImageVeiw asset={asset} />;
    }

    if (asset.type === "shapes") {
      return <ShapeView asset={asset} />;
    }

    return null;
  };

  if (isSelected) {
    return <TransformBlock clip={clip}>{renderContent()}</TransformBlock>;
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
      {renderContent()}
    </div>
  );
}

export default memo(LayerItem);
