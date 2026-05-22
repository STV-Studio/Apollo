import { memo } from "react";

import audioPlaceholder from "../assets/audio_images.webp";

function AudioClip() {
  return (
    <img draggable={false} src={audioPlaceholder} className="audio_preview" />
  );
}
export default memo(AudioClip);
