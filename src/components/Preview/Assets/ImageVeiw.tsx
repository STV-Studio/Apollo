import { memo } from "react";
import type { JSX } from "react";
import type { Asset } from "../../../utils";

interface Props {
  asset: Asset;
}

function ImageView({ asset }: Props): JSX.Element | null {
  if (asset.type !== "image" || !asset.src) {
    return null;
  }

  const isSvg = asset.src.includes(".svg") || asset.src.includes("image/svg");

  if (isSvg) {
    return (
      <div
        className="layer_svg"
        style={{ backgroundImage: `url(${asset.src})` }}
      />
    );
  } else {
    return (
      <img src={asset.src} className="layer_image" draggable={false} alt="" />
    );
  }
}

export default memo(ImageView);
