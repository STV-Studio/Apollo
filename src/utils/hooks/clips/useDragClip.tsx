import { useEffect, useRef } from "react";
import { useClips, usePreview } from "../../../context";
import { insertClip } from "../../const";
import { useZoomEffect } from "../timeline";
import { pauseAllMedia } from "../../helper";

interface Props {
  id: string;
  trackID: string;
  start: number;
}

//! ХУК ДЛЯ ПЕРЕТАСКИВАНИЯ КЛИПОВ НА ТАЙМЛАЙНЕ, ОБРАБАТЫВАЕТ СМЕЩЕНИЕ ПО X И ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ТРЕКАМИ ПРИ ПЕРЕМЕЩЕНИИ ПО Y
export function useDragClip({ start, id, trackID }: Props) {
  const { updateClip, moveClipToTrack, tracks, selectedClipId, setTracks } =
    useClips();
  const { scale } = useZoomEffect();
  const { setIsPlay, VIDEO_REF } = usePreview();

  //?  РЕФЫ ДЛЯ ХРАНЕНИЯ ТЕКУЩЕГО ТРЕКА, СОСТОЯНИЯ ПЕРЕТАСКИВАНИЯ, ID ЦЕЛЕВОГО ТРЕКА ПРИ ПЕРЕКЛЮЧЕНИИ И ТАЙМЕРА ДЛЯ СТАБИЛЬНОГО ПЕРЕКЛЮЧЕНИЯ
  const currentTrackID = useRef(trackID);
  const isDragging = useRef(false);
  const frame = useRef<number | null>(null);

  //? РЕФЫ ДЛЯ ХРАНЕНИЯ ПРЕДЫДУЩИХ КООРДИНАТ МЫШИ И ТЕКУЩЕГО СТАРТА КЛИПА ДЛЯ РАСЧЕТА СМЕЩЕНИЯ И ОБНОВЛЕНИЯ ПО X
  const prevX = useRef(0);
  const prevY = useRef(0);

  //? РЕФ ДЛЯ ХРАНЕНИЯ ТЕКУЩЕГО СТАРТА КЛИПА ДЛЯ РАСЧЕТА СМЕЩЕНИЯ И ОБНОВЛЕНИЯ ПО X
  const currentStart = useRef(start);

  //? РЕФ ДЛЯ ХРАНЕНИЯ ID ЦЕЛЕВОГО ТРЕКА ПРИ ПЕРЕКЛЮЧЕНИИ
  const targetTrackID = useRef<string | null>(null);
  const switchTimeout = useRef<number | null>(null);

  //! ОБНОВЛЯЕМ currentTrackID ПРИ ИЗМЕНЕНИИ trackID В ПРОПСАХ, ЧТОБЫ ВСЕГДА ИМЕТЬ АКТУАЛЬНЫЙ ID ТРЕКА, НА КОТОРОМ НАХОДИТСЯ КЛИП
  useEffect(() => {
    currentTrackID.current = trackID;
  }, [trackID]);

  //? ФУНКЦИЯ ОБРАБОТКИ НАЖАТИЯ МЫШИ НА КЛИПЕ, ИНИЦИИРУЕТ ПЕРЕТАСКИВАНИЕ И ОБРАБАТЫВАЕТ ДВИЖЕНИЕ И ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ТРЕКАМИ
  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    pauseAllMedia(VIDEO_REF.current);

    setIsPlay(false);

    if (selectedClipId !== id) return;

    //* ИНИЦИИРУЕМ ПЕРЕТАСКИВАНИЕ
    isDragging.current = true;

    //? ИНИЦИИРУЕМ ПРЕДЫДУЩИЕ КООРДИНАТЫ МЫШИ И ТЕКУЩИЙ СТАРТ КЛИПА
    prevX.current = e.clientX;
    prevY.current = e.clientY;

    //? ИНИЦИИРУЕМ ТЕКУЩИЙ СТАРТ КЛИПА И СБРАСЫВАЕМ ЦЕЛЕВОЙ ТРЕК
    currentStart.current = start;
    targetTrackID.current = null;

    const rows = document.querySelectorAll(".track_row");

    //! ФУНКЦИЯ ОБРАБОТКИ ДВИЖЕНИЯ МЫШИ, РАСЧИТЫВАЕТ СМЕЩЕНИЕ ПО X И ОБНОВЛЯЕТ СТАРТ КЛИПА, А ТАКЖЕ ОПРЕДЕЛЯЕТ ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ТРЕКАМИ ПРИ ПЕРЕМЕЩЕНИИ ПО Y
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      if (frame.current) return;

      //? РАСЧИТЫВАЕМ СМЕЩЕНИЕ ПО X И ОБНОВЛЯЕМ ПРЕДЫДУЩИЕ КООРДИНАТЫ МЫШИ
      const moveX = moveEvent.clientX - prevX.current;

      //! РАСЧИТЫВАЕМ СМЕЩЕНИЕ ПО Y И ОБНОВЛЯЕМ ПРЕДЫДУЩИЕ КООРДИНАТЫ МЫШИ
      prevX.current = moveEvent.clientX;
      prevY.current = moveEvent.clientY;

      //? ИСПОЛЬЗУЕМ requestAnimationFrame ДЛЯ ОПТИМИЗАЦИИ ОБНОВЛЕНИЯ ПО X И ПЕРЕКЛЮЧЕНИЯ МЕЖДУ ТРЕКАМИ
      frame.current = requestAnimationFrame(() => {
        frame.current = null;

        //*  ДВИЖЕНИЕ ПО X
        currentStart.current = Math.max(
          0,
          currentStart.current + moveX / scale,
        );

        //? ОБНОВЛЯЕМ СТАРТ КЛИПА ПО X
        updateClip(currentTrackID.current, id, {
          start: currentStart.current,
        });

        //? ОПРЕДЕЛЯЕМ TRACK
        let hoveredTrackID: string | null = null;

        //? ПРОВЕРЯЕМ КАЖДУЮ ДИВКУ ТРЕКА НА ПЕРЕСЕЧЕНИЕ С КУРСОРОМ ПО Y И ОПРЕДЕЛЯЕМ НАД КАКИМ ТРЕКОМ НАХОДИТСЯ КУРСОР
        rows.forEach((row, index) => {
          const rect = row.getBoundingClientRect();

          if (
            moveEvent.clientY >= rect.top &&
            moveEvent.clientY <= rect.bottom
          ) {
            hoveredTrackID = tracks[index]?.id || null;
          }
        });

        //?  СТАБИЛЬНОЕ ПЕРЕКЛЮЧЕНИЕ TRACK
        if (
          hoveredTrackID &&
          hoveredTrackID !== currentTrackID.current &&
          hoveredTrackID !== targetTrackID.current
        ) {
          targetTrackID.current = hoveredTrackID;

          //?  чистим старый таймер
          if (switchTimeout.current) {
            clearTimeout(switchTimeout.current);
          }

          //!  устанавливаем новый таймер для стабильного переключения между треками при перемещении по Y
          switchTimeout.current = window.setTimeout(() => {
            if (targetTrackID.current === hoveredTrackID) {
              moveClipToTrack(currentTrackID.current, hoveredTrackID!, id);
              currentTrackID.current = hoveredTrackID!;
            }
          }, 80);
        }
      });
    };

    //! ФУНКЦИЯ ОБРАБОТКИ ОТПУСКАНИЯ КЛИКА МЫШИ, ЗАВЕРШАЕТ ПЕРЕТАСКИВАНИЕ И ОБНОВЛЯЕТ РАСПОЛОЖЕНИЕ КЛИПА В НОВОМ ТРЕКЕ ЕСЛИ БЫЛО ПЕРЕКЛЮЧЕНИЕ
    const handleMouseUp = () => {
      isDragging.current = false;

      //* ОЧИЩАЕМ ОБРАБОТЧИКИ СОБЫТИЙ И ТАЙМЕР
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      //* ЧИСТИМ ТАЙМЕР ДЛЯ СТАБИЛЬНОГО ПЕРЕКЛЮЧЕНИЯ МЕЖДУ ТРЕКАМИ
      if (switchTimeout.current) {
        clearTimeout(switchTimeout.current);
        switchTimeout.current = null;
      }

      //? ЕСЛИ БЫЛО ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ТРЕКАМИ, ОБНОВЛЯЕМ РАСПОЛОЖЕНИЕ КЛИПА В НОВОМ ТРЕКЕ
      setTracks((prev) => {
        const track = prev.find((t) => t.id === currentTrackID.current);
        if (!track) return prev;

        const clip = track.clips.find((c) => c.id === id);
        if (!clip) return prev;

        const newClips = insertClip(
          {
            ...track,
            clips: track.clips.filter((c) => c.id !== id),
          },
          clip,
        );

        return prev.map((t) =>
          t.id === track.id ? { ...t, clips: newClips } : t,
        );
      });
    };

    //! ДОБАВЛЯЕМ ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ ДВИЖЕНИЯ И ОТПУСКАНИЯ МЫШИ
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return { onMouseDown };
}
