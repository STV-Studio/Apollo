import { memo } from "react";

import TextAsset from "../assets/text_asset.jpeg";
function TextClip() {
  return <img src={TextAsset} alt="" className="asset_image" />;
}
export default memo(TextClip);
