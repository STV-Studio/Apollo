import { type KeyboardEvent } from "react";

// Универсальный тип для коллбэка
type Action = () => void;


export const onKey = (e: KeyboardEvent) => ({
  enter: (cb: Action) => e.key === "Enter" && cb(),
  esc: (cb: Action) => e.key === "Escape" && cb(),
  delete: (cb: Action) => e.key === "Delete" && cb(),
  space: (cb: Action) => {
    if (e.key === " ") {
      e.preventDefault(); 
      cb();
    }
  },

});
