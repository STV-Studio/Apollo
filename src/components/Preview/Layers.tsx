import { memo } from "react";
import { useActiveLayers } from "../../utils";
import LayerItem from "./LayerItem";
import { useClips } from "../../context";

function Layers() {
  const { clips } = useClips();
  const { activeLayers } = useActiveLayers();

  const LayerElement = activeLayers.map((clip) => {
    const asset = clips.find((a) => a.id === clip.assetId);
    if (!asset) return null;

    return <LayerItem key={clip.id} clip={clip} asset={asset} />;
  });

  return <>{LayerElement}</>;
}
export default memo(Layers);
