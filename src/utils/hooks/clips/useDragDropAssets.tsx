import { useCallback, useMemo } from "react";
import { useClips } from "../../../context";
import { getClipType } from "../../index";
import { useDropzone } from "react-dropzone";
import { useFileReader } from "../ui";

//! хук для обработки перетаскивания файлов в зону ассетов, добавляет новые клипы в список клипов, если они не дублируются с существующими клипами
export function useDragDropAssets() {
  //* получение текущего списка клипов и функции для добавления новых клипов из контекста клипов
  const { clips, addClip } = useClips();
  const { readFile } = useFileReader();

  //* функция обработки дропа файлов в зону ассетов
  const onDrop = useCallback(
    async (files: File[]) => {
      //? проверяем каждый файл на наличие дубликатов в текущем списке клипов, сравнивая имя, размер и тип файла с существующими клипами, если дубликат не найден, читаем файл и добавляем его в список клипов
      const newClips = await Promise.all(
        files.map((file) => {
          if (
            clips.some(
              (el) =>
                el?.name === file.name &&
                el.size === file.size &&
                el.type === getClipType(file),
            )
          ) {
            return null;
          }

          return readFile(file);
        }),
      );

      //? добавляем новые клипы в список клипов, фильтруя null значения, которые представляют дубликаты
      newClips.forEach((clip) => {
        if (clip) addClip(clip);
      });
    },
    [clips, readFile, addClip],
  );

  //* использование хука useDropzone для получения пропсов и состояния, связанных с перетаскиванием файлов в зону ассетов
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,

    onDragEnter: (e) => {
      if (!e.dataTransfer.types.includes("Files")) {
        e.preventDefault();
        e.stopPropagation();
      }
    },

    accept: {
      "image/*": [],
      "video/*": [],
      "audio/*": [],
    },

    noClick: clips.length > 0,
  });

  //* мемоизация возвращаемых пропсов и состояния для оптимизации производительности при использовании хука в компонентах
  const props = useMemo(
    () => ({ onDrop, getRootProps, getInputProps, isDragActive }),
    [onDrop, getRootProps, getInputProps, isDragActive],
  );
  return { ...props };
}
