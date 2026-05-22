import { memo, useEffect, useRef } from "react";

interface Props {
  src: string | undefined;
  currentTime: number;
  start: number;
}

function VideoClip({ src, currentTime, start }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);

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
