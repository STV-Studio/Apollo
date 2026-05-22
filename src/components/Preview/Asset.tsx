import { memo } from "react";
import { usePreview } from "../../context";
import { useActiveMedia } from "../../utils";

function Asset() {
  const { VIDEO_REF } = usePreview();
  const { videoAsset, activeAudios, audioAssets } = useActiveMedia();

  return (
    <>
      {videoAsset && (
        <video ref={VIDEO_REF} src={videoAsset.src} className="video" muted />
      )}

      {activeAudios.map((clip) => {
        const asset = audioAssets.find((a) => a && a.id === clip.assetId);

        if (!asset) return null; // 💣 фикс TS + защита

        return (
          <audio
            key={clip.id}
            data-id={clip.id}
            src={asset.src}
            preload="auto"
          />
        );
      })}
    </>
  );
}
export default memo(Asset);
