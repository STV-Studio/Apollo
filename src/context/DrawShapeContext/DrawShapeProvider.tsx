import { useMemo, useCallback, useState } from "react";
import type { ReactNode, MouseEvent } from "react";
import type { ShapeAsset, ShapeType } from "../../utils";
import { DrawShapeContext } from "./DrawShapeContext";
import { useClips } from "../ClipContext";
import { useCurrentTime } from "../CurrentTimeContext";
import { createTimelineClip } from "../../utils/helper/createTimelineClip";

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

  const { addClip, addToTrack, tracks } = useClips();
  const { currentTimeRef } = useCurrentTime();

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
    if (!draftShape) return;

    const targetTrack = tracks[0];
    if (!targetTrack) return;

    const asset: ShapeAsset = {
      id: crypto.randomUUID(),
      type: "shapes",
      shapes: [draftShape.type],
      size: 0,
      duration: 5,
      name: draftShape.type,
    };

    addClip(asset);

    const width = Math.abs(draftShape.width);
    const height = Math.abs(draftShape.height);

    const x = draftShape.width < 0 ? draftShape.x - width : draftShape.x;

    const y = draftShape.height < 0 ? draftShape.y - height : draftShape.y;

    addToTrack(
      targetTrack.id,
      createTimelineClip({
        assetId: asset.id,
        start: currentTimeRef.current,
        duration: 5,
        type: "shapes",
        x,
        y,
        width,
        height,
      }),
    );
    setDraftShape(null);
    setIsDrawing(false);

    setActiveShape(null);
  }, [addClip, addToTrack, currentTimeRef, draftShape, tracks]);

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
