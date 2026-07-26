import { memo, useEffect, useRef } from "react";
import { useCurrentTime } from "../../context";
import { useZoomEffect } from "../../context/ZoomContext/ZoomContext";

function Playhead() {
  const { subscribeTime } = useCurrentTime();
  const { scale } = useZoomEffect();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeTime((time) => {
      if (ref.current) {
        ref.current.style.transform = `translateX(${time * scale}px)`;
      }
      return unsubscribe;
    });
  }, [subscribeTime, scale]);
  return (
    <div
      ref={ref}
      className="playhead"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0, // Стартовая позиция, дальше рулит transform
        willChange: "transform", // Подсказка браузеру для плавности
      }}
    />
  );
}

export default memo(Playhead);
