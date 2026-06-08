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

  const width = draftShape ? Math.abs(draftShape.width) : 0;
  const height = draftShape ? Math.abs(draftShape.height) : 0;

  const x = draftShape
    ? draftShape.width < 0
      ? draftShape.x - width
      : draftShape.x
    : 0;

  const y = draftShape
    ? draftShape.height < 0
      ? draftShape.y - height
      : draftShape.y
    : 0;
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
            left: x,
            top: y,
            width,
            height,
          }}
        />
      )}
    </div>
  );
}
export default memo(BlockCinima);
