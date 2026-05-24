import { useCallback, useMemo, useState } from "react";
import { createAsset, getVideoDuration } from "../../index";
import type { Asset } from "../../types";

/**
 * **RU:** Кастомный хук для чтения локальных файлов пользователя и извлечения метаданных (тип, размер, длительность видео).
 * Автоматически управляет состояниями загрузки (`loading`) и ошибок (`error`).
 * * **EN:** Custom hook for reading user's local files and extracting metadata (type, size, video duration).
 * Automatically manages `loading` and `error` states.
 *
 * ---
 * @returns **RU:** Объект с тремя свойствами: `loading` (статус), `error` (текст ошибки) и `readFile` (функция для запуска чтения).
 * @returns **EN:** Object with three properties: `loading` (status), `error` (error message), and `readFile` (function to trigger reading).
 *
 * ---
 * @example
 * ```tsx
 * // RU: Пример использования в компоненте загрузки медиа:
 * // EN: Media upload component usage example:
 * * function FileUploader() {
 * const { readFile, loading, error } = useFileReader();
 * * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 * const file = e.target.files?.[0];
 * if (!file) return;
 * * // RU: readFile возвращает Promise, поэтому используем await
 * // EN: readFile returns a Promise, so we use await
 * const asset = await readFile(file);
 * * if (asset) {
 * console.log("Успешно прочитано / Successfully read:", asset);
 * }
 * };
 * * return (
 * <div>
 * <input type="file" onChange={handleFileChange} disabled={loading} />
 * {loading && <p>Загрузка файла... / Loading file...</p>}
 * {error && <p style={{ color: 'red' }}>{error}</p>}
 * </div>
 * );
 * }
 * ```
 */
export function useFileReader() {
  /**
   * **RU:** Индикатор загрузки. Становится `true`, пока файл читается и вычисляется длительность, затем возвращается в `false`.
   * Используйте для блокировки кнопок (disabled) или показа спиннеров/лоадеров.
   * * **EN:** Loading indicator. Becomes `true` while the file is being read and duration is calculated, then reverts to `false`.
   * Use this to disable buttons or show loading spinners.
   */
  const [loading, setLoading] = useState(false);

  /**
   * **RU:** Хранит текст ошибки, если чтение файла сорвалось. Если ошибок нет, равен `null`.
   * Автоматически сбрасывается в `null` при каждом новом вызове `readFile`.
   * * **EN:** Stores the error message if the file reading fails. Equals `null` if there are no errors.
   * Automatically resets to `null` on every new `readFile` invocation.
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * **RU:** Асинхронная функция для обработки файла. Обернута в `useCallback`, чтобы ссылка не менялась при перерендерах.
   * * **EN:** Asynchronous function to process the file. Wrapped in `useCallback` to maintain reference stability across re-renders.
   * * @param file - **RU:** Сырой файл из инпута (`File`). | **EN:** Raw file object from input (`File`).
   * @returns **RU:** Промис, возвращающий готовый объект `Asset` или `null` в случае ошибки. | **EN:** Promise that resolves to an `Asset` object, or `null` if failed.
   */
  const readFile = useCallback(async (file: File): Promise<Asset | null> => {
    setLoading(true);
    setError(null);

    try {
      // RU: Создаем временную blob-ссылку для локального предпросмотра (видео/картинки)
      // EN: Create a temporary blob URL for local preview (video/image)
      const url = URL.createObjectURL(file);
      let duration = 5; // RU: Дефолтное значение для статичных медиафайлов | EN: Default value for static media files

      // RU: Если это видео, замеряем его реальную длительность в секундах
      // EN: If it's a video, calculate its actual duration in seconds
      if (file.type.startsWith("video/")) {
        duration = await getVideoDuration(url);
      }

      // RU: Собираем финальный объект со всеми метаданными
      // EN: Construct the final asset object with all metadata
      const asset = createAsset(file, url, duration);

      return asset;
    } catch (e) {
      setError("File error");
      console.error(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * **RU:** Мемоизированный объект с результатами работы хука.
   * Предотвращает лишние перерендеры дочерних компонентов, которые принимают эти пропсы.
   * * **EN:** Memoized object containing the hook results.
   * Prevents unnecessary re-renders of child components that consume these props.
   */
  const props = useMemo(
    () => ({ loading, error, readFile }),
    [loading, error, readFile],
  );

  return { ...props };
}
