import { useEffect, useState } from "react";

/**
 * **RU:** Настройки для хука `useDebounceSearch`.
 * **EN:** Configuration properties for the `useDebounceSearch` hook.
 */
interface Props<T> {
  /** * **RU:** Задержка в миллисекундах (например, `500`), в течение которой хук ждет остановки ввода, прежде чем обновить значение.
   * **EN:** Delay in milliseconds (e.g., `500`) to wait after the last change before updating the value.
   */
  delay: number;

  /** * **RU:** Текущее "быстрое" значение из инпута, которое нужно задебаунсить.
   * **EN:** The current "fast" value from the input that needs to be debounced.
   */
  value: T;
}

/**
 * **RU:** Кастомный хук для искусственной задержки (дебаунса) быстро меняющихся значений.
 * Чаще всего используется для поисковых инпутов, чтобы не спамить запросами к API при каждом нажатии клавиши.
 * * **Как это работает для чайников:**
 * Пользователь пишет слово "Привет". Вместо 6 запросов к серверу (на каждую букву), хук включит таймер.
 * Если пользователь нажал следующую букву быстрее, чем прошла задержка `delay`, старый таймер сбрасывается и включается новый.
 * Запрос улетит только тогда, когда пользователь сделает паузу в вводе.
 * * **EN:** A custom hook to debounce rapidly changing values.
 * Commonly used for search inputs to prevent flooding the API/server with requests on every keystroke.
 *
 * ---
 * @param config - **RU:** Объект с параметрами `value` и `delay`. | **EN:** Object containing `value` and `delay`.
 * @returns **RU:** Отложенное (стабильное) значение, которое меняется только после паузы во вводе. | **EN:** The delayed (stable) value that only updates after the user stops typing.
 *
 * ---
 * @example
 * ```tsx
 * // RU: Пример интеграции с поисковым запросом в React:
 * // EN: React example with a search API query:
 * * function SearchComponent() {
 * const [searchQuery, setSearchQuery] = useState("");
 * * // RU: Ждем 500мс после того, как пользователь закончит печатать
 * // EN: Wait 500ms after the user stops typing
 * const debouncedSearch = useDebounceSearch({ value: searchQuery, delay: 500 });
 * * useEffect(() => {
 * if (debouncedSearch) {
 * // RU: Отправляем запрос на сервер только здесь!
 * // EN: Trigger the API request here only!
 * fetch(`/api/search?q=${debouncedSearch}`).then(...)
 * }
 * }, [debouncedSearch]);
 * * return <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />;
 * }
 * ```
 */
export function useDebounceSearch<T>({ value, delay }: Props<T>) {
  /**
   * **RU:** Локальное состояние, которое хранит "заторможенное" значение. Компонент снаружи будет следить именно за ним.
   * **EN:** Local state holding the "slowed down" value. The outer component will listen to this specific state.
   */
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    /**
     * **RU:** Запускаем таймер. Если он успеет дотикать до конца, `debouncedValue` обновится.
     * **EN:** Start a timer. If it manages to finish without interruption, `debouncedValue` gets updated.
     */
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    /**
     * **RU:** Функция очистки (эффект-клинап).
     * ОЧЕНЬ ВАЖНО: Уничтожает старый таймер, если `value` или `delay` изменились до того, как таймер сработал.
     * Именно эта строчка сбрасывает ожидание при каждом новом нажатии клавиши!
     * * **EN:** Cleanup function.
     * CRITICAL: Destroys the previous timer if `value` or `delay` change before the timeout finishes.
     * This exact line resets the waiting cycle on every single keystroke!
     */
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
