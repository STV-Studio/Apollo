import { memo } from "react";
import { useClips } from "../../context";

interface Props {
  scale: number;
  STEP: number;
}

function TimeRuler({ scale, STEP }: Props) {
  const { tracks } = useClips();

  const allClips = tracks.flatMap((track) => track.clips);

  const DEFAULT_TIME = 46;

  const MAX_TIME =
    allClips.length === 0
      ? DEFAULT_TIME
      : Math.max(
          Math.max(...allClips.map((c) => c.start + c.duration)),
          DEFAULT_TIME,
        );

  const TICKS = Math.ceil(MAX_TIME / STEP);

  return (
    <div className="ruler" style={{ width: MAX_TIME * scale }}>
      {Array.from({ length: TICKS }).map((_, i) => {
        if (scale < 40 && i % 2 !== 0) return null;
        if (scale < 20 && i % 5 !== 0) return null;

        const time = i * STEP;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: time * scale,
              borderLeft: "1px solid gray",
              height: "auto",
            }}
          >
            <span style={{ paddingLeft: 10 }}>{time}</span>
          </div>
        );
      })}
    </div>
  );
}
export default memo(TimeRuler);
