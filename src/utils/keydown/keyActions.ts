import { type KeyboardEvent } from "react";

// Универсальный тип для коллбэка


/**
 * **RU:** Тип для функции-коллбэка, которая не принимает аргументов и ничего не возвращает.
 * Проще говоря: это просто «действие» (команда), которое нужно запустить в ответ на событие.
 * * **EN:** Type for a callback function that takes no arguments and returns nothing.
 * Simply put: it's just an "action" (command) to be executed in response to an event.
 *
 * ---
 * @example
 * ```ts
 * // RU: Вот так выглядит функция, подходящая под этот тип:
 * // EN: This is what a function matching this type looks like:
 * const sayHello: Action = () => console.log("Привет!");
 * * // RU: Её удобно передавать как задачу, которую нужно выполнить позже
 * // EN: It's useful for passing around a task to be executed later
 * ```
 */
type Action = () => void;

/**
 * **RU:** Хелпер для удобной обработки нажатий клавиш клавиатуры в событиях (`onKeyDown`, `onKeyUp`).
 * Избавляет от бесконечных проверок `if (e.key === 'Enter')`.
 * 
 * **EN:** A helper for clean keyboard event handling (like `onKeyDown`, `onKeyUp`).
 * Eliminates the need for repetitive `if (e.key === 'Enter')` checks.
 *
 * ---
 * @param e - **RU:** Объект события клавиатуры (`KeyboardEvent`) из обработчика. | **EN:** The `KeyboardEvent` object from the event listener.
 * @returns **RU:** Объект с методами для конкретных клавиш. Каждая функция принимает коллбэк, который выполнится, если клавиша нажата. | **EN:** Object with methods for specific keys. Each function accepts a callback that triggers if the key matches.
 *
 * ---
 * @example
 * ```tsx
 * // RU: Пример использования в React компоненте:
 * // EN: React component usage example:
 * 
 * <input 
 *   onKeyDown={(e) => {
 *     const key = onKey(e);
 *     
 *     key.enter(() => console.log("Отправлено! / Submitted!"));
 *     key.esc(() => console.log("Закрыто! / Closed!"));
 *   }} 
 * />
 *
 * */
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
