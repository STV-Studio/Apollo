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
    return (
      <TransformBlock clip={clip}>
        <img src={asset.src} className="layer_image" draggable={false} />
      </TransformBlock>
    );
  }

  return null;
}

export default memo(LayerItem);
