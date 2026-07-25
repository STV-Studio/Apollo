import { memo } from "react";

interface TickItemProps {
  index: number;
  calculatedStep: number;
  scale: number;
  formatTime: (seconds: number) => string;
}

export const TickItem = memo(function TickItem({
  index,
  calculatedStep,
  scale,
  formatTime,
}: TickItemProps) {
  const timeInSeconds = Math.round(index * calculatedStep * 10) / 10;
  const leftPosition = timeInSeconds * scale;

  return (
    <li
      style={{
        position: "absolute",
        left: leftPosition,
        top: 0,
        borderLeft: "1px solid #aaa",
        height: "100%",
        boxSizing: "border-box",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          paddingLeft: 6,
          fontSize: 11,
          color: "#ccc",
          userSelect: "none",
          fontFamily: "monospace",
        }}
      >
        {formatTime(timeInSeconds)}
      </span>
    </li>
  );
});
