import { useMemo, useRef, useState, type ReactNode } from "react";
import { CurrentTimeContext } from "./CurrentTimeContext";

interface Props {
  children: ReactNode;
}

export function CurrentTimeProvider({ children }: Props) {
  const currentTimeRef = useRef<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const VALUES = useMemo(
    () => ({ currentTime, setCurrentTime, currentTimeRef }),
    [currentTime, setCurrentTime],
  );

  return (
    <CurrentTimeContext.Provider value={VALUES}>
      {children}
    </CurrentTimeContext.Provider>
  );
}
