import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction, MouseEvent } from "react";
import type { ShapeType } from "../../utils";
import type { DraftShape } from "./DrawShapeProvider";

interface ContextProps {
  draftShape: DraftShape | null;
  activeShape: ShapeType | null;
  setActiveShape: Dispatch<SetStateAction<ShapeType | null>>;
  handleStartDraw: (e: MouseEvent<Element, globalThis.MouseEvent>) => void;
  handleDraw: (e: MouseEvent<Element, globalThis.MouseEvent>) => void;
  handleFinishDraw: () => void;
}

export const DrawShapeContext = createContext<ContextProps | undefined>(
  undefined,
);

export function useDrawContext() {
  const context = useContext(DrawShapeContext);
  if (!context) {
    throw new Error(
      "Context Draw not found. Did you forget DrawShapeProvider?",
    );
  }
  return context;
}
