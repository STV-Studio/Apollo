import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";

interface ZoomContextType {
  scale: number;
  STEP: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ZoomContext = createContext<ZoomContextType | null>(null);

export function ZoomProvider({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const STEP = useMemo(() => {
    if (scale > 150) return 1;
    if (scale > 80) return 2;
    if (scale > 40) return 5;
    return 10;
  }, [scale]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!e.ctrlKey) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const scrollLeft = container.scrollLeft;
    const timelineX = cursorX + scrollLeft;

    setScale((prev) => {
      const timeBeforeZoom = timelineX / prev;
      const next = Math.min(Math.max(prev - e.deltaY * 0.1, 10), 300);
      const newScroll = timeBeforeZoom * next - cursorX;

      requestAnimationFrame(() => {
        container.scrollLeft = newScroll;
      });

      return next;
    });
  }, []);

  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => {
      if (!e.ctrlKey) return;

      const container = containerRef.current;
      if (!container || !container.contains(e.target as Node)) return;

      e.preventDefault();
      handleWheel(e);
    };

    window.addEventListener("wheel", wheelHandler, { passive: false });
    return () => {
      window.removeEventListener("wheel", wheelHandler);
    };
  }, [handleWheel]);

  return (
    <ZoomContext.Provider value={{ scale, STEP, containerRef }}>
      {children}
    </ZoomContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useZoomEffect() {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error("useZoomEffect must be used within a ZoomProvider");
  }
  return context;
}
