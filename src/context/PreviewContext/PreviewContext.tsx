import { createContext, useContext } from "react";
import type {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
} from "react";

interface PreviewContextType {
  handlePlay: () => void;
  handlePause: () => void;
  isPlay: boolean;
  setIsPlay: Dispatch<SetStateAction<boolean>>;
  VIDEO_REF: RefObject<HTMLVideoElement | null>;
  JUST_SEEKED: MutableRefObject<boolean>;
  setJustSeeked: (val: boolean) => void;
}

export const PreviewContext = createContext<PreviewContextType | undefined>(
  undefined,
);

export function usePreview() {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }
  return context;
}
