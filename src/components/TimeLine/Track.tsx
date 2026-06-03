import { memo } from "react";
import TrackRow from "./TrackRow";
import type { Track } from "../../utils";
import type { GostClip } from "../../utils/hooks/timeline/useTimeLineDrop";

interface Props {
  scale: number;
  tracks: Track;
  gostClip: GostClip[];
}
function Track({ scale, tracks, gostClip }: Props) {
  return (
    <div>
      <TrackRow scale={scale} track={tracks} gostClip={gostClip} />
    </div>
  );
}
export default memo(Track);
