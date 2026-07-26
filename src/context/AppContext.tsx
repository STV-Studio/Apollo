import {
  createContext,
  useContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { ErrorMessage, type Asset } from "../utils";
import type { TimeListener } from "./CurrentTimeContext/CurrentTimeProvider";

interface AppContextProps {
  clips: Asset[];
  setClips: Dispatch<SetStateAction<Asset[]>>;
  setCurrentTime: (time: number) => void;
  currentTimeRef: RefObject<number>;
  listenersRef: RefObject<Set<TimeListener>>;
  subscribeTime: (listener: TimeListener) => () => void;
  addClip: (clip: Asset) => void;
  updateClip: (id: string, data: Partial<Asset>) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(ErrorMessage);
  }
  return context;
}
