import { memo } from "react";
import type { ClipView } from "../utils";
import VideoClip from "../utils/const/VideoClip";
import AudioClip from "./AudioClip";

interface Props {
  clip: ClipView;
  currentTime: number;
}
function AssetPreview({ clip, currentTime }: Props) {
  const { type, start } = clip;

  switch (type) {
    case "image":
      return <img draggable={false} src={clip.src} className="asset_image" />;
    case "video":
      return (
        <VideoClip src={clip.src} currentTime={currentTime} start={start} />
      );
    case "audio":
      return <AudioClip />;
    default:
      return null;
  }
}
export default memo(AssetPreview);
