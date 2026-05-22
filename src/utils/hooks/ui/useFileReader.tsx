import { useCallback, useMemo, useState } from "react";
import { createAsset, getVideoDuration } from "../../index";
import type { Asset } from "../../types";

//! хук для чтения файлов и получения информации о них, таких как тип, размер и длительность (для видео)
export function useFileReader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //? функция для чтения файла и получения информации о нем
  const readFile = useCallback(async (file: File): Promise<Asset | null> => {
    setLoading(true);
    setError(null);

    //! создаем URL для файла и определяем его длительность, если это видео, затем возвращаем объект Asset с информацией о файле
    try {
      const url = URL.createObjectURL(file);
      let duration = 5;

      if (file.type.startsWith("video/")) {
        duration = await getVideoDuration(url);
      }

      const asset = createAsset(file, url, duration);

      return asset;
    } catch (e) {
      setError("File error");
      console.log(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  //? мемоизация возвращаемых значений для оптимизации производительности при использовании хука в компонентах
  const props = useMemo(
    () => ({ loading, error, readFile }),
    [loading, error, readFile],
  );

  return { ...props };
}
