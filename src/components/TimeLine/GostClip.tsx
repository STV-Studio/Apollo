import type { GostClip } from "../../utils/hooks/timeline/useTimeLineDrop";
interface Props {
  ghostClip: GostClip[];
  scale: number;
}

export default function GhostClip({ ghostClip, scale }: Props) {
  return (
    <div
      className="ghost_clip"
      style={{
        left: ghostClip[0]?.start * scale,
        width: ghostClip[0]?.duration * scale,
      }}
    />
  );
}
