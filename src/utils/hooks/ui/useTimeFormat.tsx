import { useCallback, useMemo } from "react";

export function useTimeFormat() {
  const NICE_STEPS = useMemo(() => [1, 2, 5, 10, 15, 30, 60, 120, 300], []);

  const getAdaptiveStep = useCallback(
    (scale: number, targetPx = 100): number => {
      const rawStep = targetPx / scale;

      const niceStep = NICE_STEPS.find((s) => s >= rawStep);

      return niceStep || NICE_STEPS[NICE_STEPS.length - 1];
    },

    [NICE_STEPS],
  );

  const formatTime = useCallback((seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;

    const m = Math.floor(seconds / 60);

    const s = Math.round(seconds % 60);

    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }, []);

  return { getAdaptiveStep, formatTime, NICE_STEPS };
}
