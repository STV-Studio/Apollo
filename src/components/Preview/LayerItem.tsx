import { memo } from "react";
import { TransformBlock } from "../../utils";
import type { Asset, ClipWithTrack } from "../../utils/";

interface Props {
  clip: ClipWithTrack;
  asset: Asset;
}

function LayerItem({ clip, asset }: Props) {
  if (asset.type === "text") {
    return (
      <TransformBlock clip={clip}>
        <div className="layer_text">{asset.text}</div>
      </TransformBlock>
    );
  }

  if (asset.type === "image") {
    const isSvg = asset.src.includes(".svg") || asset.src.includes("image/svg");
    return (
      <TransformBlock clip={clip}>
        {isSvg ? (
          <div
            className="layer_svg"
            style={{ backgroundImage: `url(${asset.src})` }}
          />
        ) : (
          <img src={asset.src} className="layer_image" draggable={false} />
        )}
      </TransformBlock>
    );
  }

  return null;
}

export default memo(LayerItem);
