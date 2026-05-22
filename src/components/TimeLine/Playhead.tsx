import { memo } from "react";
import { useCurrentTime } from "../../context";

interface Props {
  scale: number;
}

function Playhead({ scale }: Props) {
  const { currentTime } = useCurrentTime();

  return (
    <div
      className="playhead"
      style={{
        left: currentTime * scale,
      }}
    />
  );
}

export default memo(Playhead);
