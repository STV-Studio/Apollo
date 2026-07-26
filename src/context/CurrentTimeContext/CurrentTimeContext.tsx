import { createContext, useContext, type RefObject } from "react";
import { ErrorMessage } from "../../utils";
import type { TimeListener } from "./CurrentTimeProvider";

interface CurrentTimeContextProps {
  setCurrentTime: (time: number) => void;
  currentTimeRef: RefObject<number>;
  listenersRef: RefObject<Set<TimeListener>>;
  subscribeTime: (listener: TimeListener) => () => void;
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
