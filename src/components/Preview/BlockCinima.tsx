import { memo, type ReactNode } from "react";
import { useClips } from "../../context";

interface Props {
  children: ReactNode;
}

function BlockCinima({ children }: Props) {
  const { setSelectedClipId } = useClips();
  return (
    <div onMouseDown={() => setSelectedClipId(null)} className="cinima">
      {children}
    </div>
  );
}
export default memo(BlockCinima);
