import { memo } from "react";
import {
  getCustomVolumePoints,
  getVolumePoints,
  useFadeDrag,
  type TimelineClip,
} from "../../utils";

interface Props {
  clip: TimelineClip;
  trackID: string;
  scale: number;
}

function FadeClip({ clip, trackID, scale }: Props) {
  const { id, duration } = clip;
  const handleFadeDrag = useFadeDrag(
    trackID,
    id,
    clip.fadeIn ?? 0,
    clip.fadeOut ?? 0,
    duration,
    scale,
  );

  const fadeIn = clip.fadeIn ?? 0;
  const fadeOut = clip.fadeOut ?? 0;

  const MIN_PX = 6;

  const fadeInPx = Math.max(fadeIn * scale, MIN_PX);
  const fadeOutPx = Math.max(fadeOut * scale, MIN_PX);

  const customVolumePoints = getCustomVolumePoints({ clip, scale });

  const width = duration * scale;
  const top = 5;

  const points = customVolumePoints.map(({ x, y, id }) => (
    <circle
      key={id}
      cx={x}
      cy={y}
      r={5}
      fill="yellow"
      style={{ pointerEvents: "auto", cursor: "move" }}
    />
  ));

  return (
    <div className="fade_block">
      <svg className="volume-line" width={duration * scale} height={20}>
        <polyline
          points={getVolumePoints({ clip, scale })}
          stroke="white"
          strokeWidth="2"
          fill="none"
        />

        {points}

        {/* fade in handle */}
        <circle
          style={{ pointerEvents: "auto", cursor: "ew-resize" }}
          cx={fadeInPx}
          cy={top}
          r={5}
          fill="white"
          onMouseDown={(e) => handleFadeDrag(e, "left")}
        />

        {/* fade out handle */}
        <circle
          style={{ pointerEvents: "auto", cursor: "ew-resize" }}
          cx={width - fadeOutPx}
          cy={top}
          r={5}
          fill="white"
          onMouseDown={(e) => handleFadeDrag(e, "right")}
        />
      </svg>
    </div>
  );
}
export default memo(FadeClip);
