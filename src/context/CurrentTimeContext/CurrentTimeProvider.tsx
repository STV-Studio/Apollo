import { useCallback, useMemo, useRef, type ReactNode } from "react";
import { CurrentTimeContext } from "./CurrentTimeContext";

interface Props {
  children: ReactNode;
}

export type TimeListener = (time: number) => void;

export function CurrentTimeProvider({ children }: Props) {
  const currentTimeRef = useRef<number>(0);
  const listenersRef = useRef<Set<TimeListener>>(new Set());

  // 1. Метод подписки без React State
  const subscribeTime = useCallback((listener: TimeListener) => {
    listenersRef.current.add(listener);

    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  // 2. Быстрое обновление времени на каждый кадр (без ререндеров React!)
  const setCurrentTime = useCallback((time: number) => {
    currentTimeRef.current = time;

    // Уведомляем только тех, кто подписан напрямую (Playhead, VideoClip и т.д.)
    listenersRef.current.forEach((listener) => listener(time));
  }, []);

  const VALUES = useMemo(
    () => ({ subscribeTime, setCurrentTime, currentTimeRef, listenersRef }),
    [subscribeTime, setCurrentTime],
  );

  return (
    <CurrentTimeContext.Provider value={VALUES}>
      {children}
    </CurrentTimeContext.Provider>
  );
}
