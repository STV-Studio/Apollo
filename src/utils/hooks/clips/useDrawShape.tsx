import { useCallback, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import type { ShapeAsset, ShapeType } from "../../types";

type DraftShape = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ShapeType;
};

export default function useDrawShape() {
  const [tool, setTool] = useState<ShapeAsset | null>(null);
  const [draftShape, setDraftShape] = useState<DraftShape | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleStartDraw = useCallback(
    (e: MouseEvent) => {
      if (!tool) return;

      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;

      setIsDrawing(true);

      const newShape: DraftShape | null = {
        x,
        y,
        width: 0,
        height: 0,
        type: tool.shapes,
      };

      setDraftShape({ ...newShape });
    },
    [tool],
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

  const props = useMemo(
    () => ({ tool, setTool, draftShape }),
    [tool, setTool, draftShape],
  );

  return { ...props, handleStartDraw, handleDraw, handleFinishDraw };
}
