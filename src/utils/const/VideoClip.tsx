import { memo, useEffect, useRef } from "react";
import { useCurrentTime } from "../../context";

interface Props {
  src: string | undefined;
  start: number;
}

function VideoClip({ src, start }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const { subscribeTime } = useCurrentTime();

  useEffect(() => {
    // Подписываемся на тики времени без React-ререндеров!
    const unsubscribe = subscribeTime((time) => {
      if (!ref.current) return;

      const videoTime = time - start;
      if (
        videoTime >= 0 &&
        Math.abs(ref.current.currentTime - videoTime) > 0.05
      ) {
        ref.current.currentTime = videoTime;
      }
    });

    return unsubscribe;
  }, [start, subscribeTime]);

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
