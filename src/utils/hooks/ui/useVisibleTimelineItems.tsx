import { useMemo } from "react";

interface Viewport {
  scrollLeft: number;
  clientWidth: number;
}

interface Options<T> {
  items: T[];
  scale: number;
  clipStart?: number;
  getTimeInSeconds: (item: T) => number;
  overscanSeconds?: number;
}

/**
 * Хук для виртуализации любых временных элементов (точек, маркеров, субтитров и т.д.)
 */
export function useVisibleTimelineItems<T>({
  items,
  scale,
  clipStart = 0,
  getTimeInSeconds,
  overscanSeconds = 2,
  viewport,
}: Options<T> & { viewport: Viewport }): T[] {
  return useMemo(() => {
    if (!items.length) return [];

    // Границы видимой области в секундах
    const viewStartTime = Math.max(
      0,
      viewport.scrollLeft / scale - overscanSeconds,
    );
    const viewEndTime =
      (viewport.scrollLeft + viewport.clientWidth) / scale + overscanSeconds;

    return items.filter((item) => {
      const itemLocalTime = getTimeInSeconds(item);
      const itemGlobalTime = clipStart + itemLocalTime;

      return itemGlobalTime >= viewStartTime && itemGlobalTime <= viewEndTime;
    });
  }, [items, scale, clipStart, getTimeInSeconds, overscanSeconds, viewport]);
}
