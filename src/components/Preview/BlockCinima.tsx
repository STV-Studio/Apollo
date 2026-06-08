import {
  memo,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useClips } from "../../context";
import { useDrawContext } from "../../context/DrawShapeContext/DrawShapeContext";

interface Props {
  children: ReactNode;
}

function BlockCinima({ children }: Props) {
  const { setSelectedClipId } = useClips();
  const { handleStartDraw, handleDraw, handleFinishDraw, draftShape } =
    useDrawContext();

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    setSelectedClipId(null);
    handleStartDraw(e);
  };
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleDraw}
      onMouseUp={handleFinishDraw}
      className="cinima"
    >
      {children}
      {draftShape && (
        <div
          className="draft_shape"
          style={{
            left: draftShape.x,
            top: draftShape.y,
            width: draftShape.width,
            height: draftShape.height,
          }}
        />
      )}
    </div>
  );
}
export default memo(BlockCinima);
