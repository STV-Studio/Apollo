import { memo } from "react";
import {
  createCustomeVolumePoints,
  getCustomVolumePoints,
  useFadeDrag,
  type TimelineClip,
} from "../../utils";

import { useClips } from "../../context";
import { getSmoothVolumePath } from "../../utils/helper/getSmoothVolumePath";
import { getAllVolumePoints } from "../../utils/helper/getAllVolumePoints";

interface Props {
  clip: TimelineClip;
  trackID: string;
  scale: number;
}

function FadeClip({ clip, trackID, scale }: Props) {
  const { duration } = clip;
  const { handleFadeDrag, handlePointDrag } = useFadeDrag({
    trackID,
    clip,
    scale,
  });

  const { updateClip } = useClips();

  const fadeIn = clip.fadeIn ?? 0;
  const fadeOut = clip.fadeOut ?? 0;

  const MIN_PX = 6;

  const fadeInPx = Math.max(fadeIn * scale, MIN_PX);
  const fadeOutPx = Math.max(fadeOut * scale, MIN_PX);

  const customVolumePoints = getCustomVolumePoints({ clip, scale });

  const allPoints = getAllVolumePoints({
    clip,
    scale,
  });

  const smoothPath = getSmoothVolumePath(allPoints);

  const width = duration * scale;
  const top = 5;

  const handleAddedNewVolumePoint = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const localTime = x / scale;
    const value = 1 - y / 20;

    const point = createCustomeVolumePoints({ clip, localTime, value });

    updateClip(trackID, clip.id, {
      volumePoints: [...(clip.volumePoints ?? []), point],
    });
  };

  const points = customVolumePoints.map(({ x, y, id }) => (
    <circle
      key={id}
      cx={x}
      cy={y}
      r={5}
      fill="yellow"
      style={{ pointerEvents: "auto", cursor: "move" }}
      onMouseDown={(e) => handlePointDrag(e, id)}
    />
  ));

  return (
    <div className="fade_block">
      <svg
        className="volume-line"
        width={duration * scale}
        height={20}
        onDoubleClick={handleAddedNewVolumePoint}
      >
        <path
          d={`
            ${smoothPath}
              L ${width} 20
              L 0 20
              Z
            `}
          fill="rgba(255,255,255,0.12)"
        />
        <path d={smoothPath} stroke="white" strokeWidth="2" fill="none" />

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
