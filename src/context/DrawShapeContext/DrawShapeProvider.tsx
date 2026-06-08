import { useMemo, useCallback, useState } from "react";
import type { ReactNode, MouseEvent } from "react";
import type { ShapeType } from "../../utils";
import { DrawShapeContext } from "./DrawShapeContext";

interface Props {
  children: ReactNode;
}

export type DraftShape = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ShapeType;
};
export function DrawShapeProvider({ children }: Props) {
  const [activeShape, setActiveShape] = useState<ShapeType | null>(null);
  const [draftShape, setDraftShape] = useState<DraftShape | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleStartDraw = useCallback(
    (e: MouseEvent) => {
      if (!activeShape) return;

      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;

      setIsDrawing(true);

      const newShape: DraftShape = {
        x,
        y,
        width: 0,
        height: 0,
        type: activeShape,
      };

      setDraftShape({ ...newShape });
    },
    [activeShape],
  );

  const handleDraw = useCallback(
    (e: MouseEvent) => {
      if (!isDrawing) return;

      const currentX = e.nativeEvent.offsetX;
      const currentY = e.nativeEvent.offsetY;

      setDraftShape((prev) => {
        if (!prev) return null;

        const size = {
          width: currentX - prev.x,
          height: currentY - prev.y,
        };
        return { ...prev, ...size };
      });
    },
    [isDrawing],
  );

  const handleFinishDraw = useCallback(() => {
    setDraftShape(null);
    setIsDrawing(false);
  }, []);

  const VALUES = useMemo(
    () => ({
      draftShape,
      activeShape,
      setActiveShape,
      handleStartDraw,
      handleDraw,
      handleFinishDraw,
    }),
    [
      draftShape,
      activeShape,
      setActiveShape,
      handleStartDraw,
      handleDraw,
      handleFinishDraw,
    ],
  );

  return (
    <DrawShapeContext.Provider value={VALUES}>
      {children}
    </DrawShapeContext.Provider>
  );
}
