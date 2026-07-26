import { memo, useEffect, useRef } from "react";
import { useCurrentTime } from "../../context";

interface Props {
  src: string | undefined;
  start: number;
}

function VideoClip({ src, start }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const { currentTime } = useCurrentTime();

  useEffect(() => {
    if (!ref.current) return;

    const time = currentTime - start;

    if (time >= 0) {
      ref.current.currentTime = time;
    }
  }, [currentTime, start]);

  return (
    <video
      draggable={false}
      ref={ref}
      src={src}
      muted
      className="asset_video"
    />
  );
}
export default memo(VideoClip);
