import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ErrorMessage, type Asset } from "../utils";

interface AppContextProps {
  clips: Asset[];
  setClips: Dispatch<SetStateAction<Asset[]>>;
  currentTime: number;
  setCurrentTime: Dispatch<SetStateAction<number>>;
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
