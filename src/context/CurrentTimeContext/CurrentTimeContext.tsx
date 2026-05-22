import {
  createContext,
  useContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { ErrorMessage } from "../../utils";

interface CurrentTimeContextProps {
  currentTime: number;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  currentTimeRef: RefObject<number>;
}

export const CurrentTimeContext = createContext<
  CurrentTimeContextProps | undefined
>(undefined);

export function useCurrentTime() {
  const context = useContext(CurrentTimeContext);
  if (!context) {
    throw new Error(ErrorMessage);
  }
  return context;
}
