import { memo } from "react";
import TrackRow from "./TrackRow";
import type { Track } from "../../utils";
import type { GostClip } from "../../utils/hooks/timeline/useTimeLineDrop";

interface Props {
  tracks: Track;
  gostClip: GostClip[];
}
function Track({ tracks, gostClip }: Props) {
  return (
    <div>
      <TrackRow track={tracks} gostClip={gostClip} />
    </div>
  );
}
export default memo(Track);
