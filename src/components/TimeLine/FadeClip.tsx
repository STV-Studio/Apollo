import { memo, useEffect, useRef, useState } from "react";

import { useClips } from "../../context";
import type { TimelineClip } from "../../utils";

import {
  createCustomeVolumePoints,
  getCustomVolumePoints,
  useFadeDrag,
  useScrollParent,
  useTimeFormat,
  useVisibleTimelineItems,
  getSmoothVolumePath,
  getAllVolumePoints,
} from "../../utils";

interface Props {
  clip: TimelineClip;
  trackID: string;
  scale: number;
  isSelected: boolean;
  onDeselectClip?: () => void;
}

const SVG_HEIGHT = 20;
const POINT_RADIUS = 5;
const FADE_HANDLE_TOP = 5;
const MIN_FADE_PX = 6;
const OVERSCAN_BUFFER_PX = 20;
const SELECTED_POINT_RADIUS = 6;

function FadeClip(props: Props) {
  const { clip, trackID, scale, isSelected, onDeselectClip } = props;
  const { duration, start } = clip;
  const { handleFadeDrag, handlePointDrag } = useFadeDrag({
    trackID,
    clip,
    scale,
  });

  const { updateClip } = useClips();
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const handleSelectPoint = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    setSelectedPointId(id);
    onDeselectClip?.();
    handlePointDrag(e, id);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const viewport = useScrollParent(containerRef, scale);

  const fadeIn = clip.fadeIn ?? 0;
  const fadeOut = clip.fadeOut ?? 0;

  const fadeInPx = Math.max(fadeIn * scale, MIN_FADE_PX);
  const fadeOutPx = Math.max(fadeOut * scale, MIN_FADE_PX);

  const customVolumePoints = getCustomVolumePoints({ clip, scale });

  const allPoints = getAllVolumePoints({
    clip,
    scale,
  });

  const { cleanPath } = useTimeFormat();
  const rawSmoothPath = getSmoothVolumePath(allPoints);
  const smoothPath = cleanPath(rawSmoothPath);

  const width = duration * scale;

  const areaPath = cleanPath(`
  ${smoothPath}
  L ${width} 20
  L 0 20
  Z
`);

  useEffect(() => {
    if (!selectedPointId) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.classList.contains("volume-point") &&
        !target.classList.contains("fade-handle")
      ) {
        setSelectedPointId(null);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [selectedPointId]);

  const handleAddedNewVolumePoint = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();

    const hasNoPointsYet = customVolumePoints.length === 0 && isSelected;
    const isPointActive = selectedPointId !== null;

    if (!isPointActive && !hasNoPointsYet) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const localTime = x / scale;
    const value = 1 - y / SVG_HEIGHT;

    const point = createCustomeVolumePoints({ clip, localTime, value });

    updateClip(trackID, clip.id, {
      volumePoints: [...(clip.volumePoints ?? []), point],
    });

    setSelectedPointId(point.id);
  };

  const handleSelectFadeHandle = (
    e: React.MouseEvent,
    type: "left" | "right",
  ) => {
    e.stopPropagation();

    const handleId = type === "left" ? "fade-in" : "fade-out";
    setSelectedPointId(handleId);
    onDeselectClip?.(); // Снимаем выбор с клипа
    handleFadeDrag(e, type);
  };

  const handleLineClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPointId(null);
  };

  const visiblePoints = useVisibleTimelineItems({
    items: customVolumePoints,
    scale,
    clipStart: start,
    viewport,
    getTimeInSeconds: (point) => point.x / scale,
  });

  const points = visiblePoints.map(({ x, y, id }) => {
    const isPointSelected = selectedPointId === id;

    return (
      <circle
        key={id}
        className="volume-point"
        cx={x}
        cy={y}
        r={isPointSelected ? SELECTED_POINT_RADIUS : POINT_RADIUS}
        fill={isPointSelected ? "#00fff0" : "yellow"}
        stroke={isPointSelected ? "#ffffff" : "none"}
        strokeWidth={isPointSelected ? 2 : 0}
        style={{
          pointerEvents: "auto",
          cursor: !isPointSelected ? "pointer" : "move",
        }}
        onMouseDown={(e) => handleSelectPoint(e, id)}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => {
          if (!isPointSelected) {
            e.stopPropagation();
          }
        }}
      />
    );
  });

  const isFadeInVisible =
    start * scale + fadeInPx >= viewport.scrollLeft - OVERSCAN_BUFFER_PX;

  const isFadeOutVisible =
    (start + duration) * scale - fadeOutPx <=
    viewport.scrollLeft + viewport.clientWidth + OVERSCAN_BUFFER_PX;

  const isFadeInSelected = selectedPointId === "fade-in";
  const isFadeOutSelected = selectedPointId === "fade-out";

  return (
    <div ref={containerRef} className="fade_block">
      <svg
        className="volume-line"
        width={width}
        height={SVG_HEIGHT}
        onMouseDown={(e) => {
          if (!isSelected) {
            e.stopPropagation();
          }
        }}
        onClick={handleLineClick}
        onDoubleClick={handleAddedNewVolumePoint}
      >
        <path d={areaPath} fill="rgba(255,255,255,0.12)" />
        <path d={smoothPath} stroke="white" strokeWidth="2" fill="none" />

        {points}

        {/* fade in handle */}
        {isFadeInVisible && (
          <circle
            className="fade-handle"
            style={{
              pointerEvents: "auto",
              cursor: !isFadeInSelected ? "pointer" : "ew-resize",
            }}
            cx={fadeInPx}
            cy={FADE_HANDLE_TOP}
            r={isFadeInSelected ? SELECTED_POINT_RADIUS : POINT_RADIUS}
            fill={isFadeInSelected ? "#00fff0" : "white"}
            stroke={isFadeInSelected ? "#ffffff" : "none"}
            strokeWidth={isFadeInSelected ? 2 : 0}
            onMouseDown={(e) => handleSelectFadeHandle(e, "left")}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => {
              if (!isFadeInSelected) e.stopPropagation();
            }}
          />
        )}

        {/* fade out handle */}
        {isFadeOutVisible && (
          <circle
            className="fade-handle"
            style={{
              pointerEvents: "auto",
              cursor: !isFadeOutSelected ? "pointer" : "ew-resize",
            }}
            cx={width - fadeOutPx}
            cy={FADE_HANDLE_TOP}
            r={isFadeOutSelected ? SELECTED_POINT_RADIUS : POINT_RADIUS}
            fill={isFadeOutSelected ? "#00fff0" : "white"}
            stroke={isFadeOutSelected ? "#ffffff" : "none"}
            strokeWidth={isFadeOutSelected ? 2 : 0}
            onMouseDown={(e) => handleSelectFadeHandle(e, "right")}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => {
              if (!isFadeOutSelected) e.stopPropagation();
            }}
          />
        )}
      </svg>
    </div>
  );
}
export default memo(FadeClip);
