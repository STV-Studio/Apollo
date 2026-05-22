import { memo } from "react";
import TrackRow from "./TrackRow";
import type { Track } from "../../utils";

interface Props {
  scale: number;
  tracks: Track;
}
function Track({ scale, tracks }: Props) {
  return (
    <div>
      <TrackRow scale={scale} track={tracks} />
    </div>
  );
}
export default memo(Track);
