import { memo } from "react";
import Track from "./Track";
import { useClips } from "../../context";
import type { GostClip } from "../../utils/hooks/timeline/useTimeLineDrop";

interface Props {
  scale: number;
  gostClip: GostClip[];
}

function Tracks({ scale, gostClip }: Props) {
  const { tracks } = useClips();

  const allClips = tracks.flatMap((track) => track.clips);

  const maxFromClips =
    allClips.length > 0
      ? Math.max(...allClips.map((c) => c.start + c.duration))
      : 0;

  const MAX_TIME = Math.max(maxFromClips, 45);

  return (
    <div className="tracks_block" style={{ width: MAX_TIME * scale }}>
      {tracks.map((track) => (
        <Track
          key={track.id}
          tracks={track}
          scale={scale}
          gostClip={gostClip}
        />
      ))}
    </div>
  );
}
export default memo(Tracks);
