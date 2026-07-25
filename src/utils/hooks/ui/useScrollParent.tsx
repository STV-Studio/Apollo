import { useState, useEffect } from "react";
import type { RefObject } from "react";

function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  if (!node) return null;
  let current = node.parentElement;

  while (current) {
    const overflowX = window.getComputedStyle(current).overflowX;
    const isScrollable = overflowX === "auto" || overflowX === "scroll";

    if (isScrollable && current.scrollWidth > current.clientWidth) {
      return current;
    }
    current = current.parentElement;
  }

  return document.documentElement;
}

export function useScrollParent(
  ref: RefObject<HTMLElement | null>,
  scale: number,
) {
  const [viewport, setViewport] = useState({
    scrollLeft: 0,
    clientWidth: 1000,
  });

  useEffect(() => {
    const scrollParent = getScrollParent(ref.current);
    if (!scrollParent) return;

    const handleScroll = () => {
      setViewport({
        scrollLeft: scrollParent.scrollLeft,
        clientWidth: scrollParent.clientWidth,
      });
    };

    handleScroll();

    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      scrollParent.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ref, scale]);

  return viewport;
}
