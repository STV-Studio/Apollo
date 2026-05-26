import React, { useCallback } from "react";
import { useClips } from "../../context";
import type { TimelineClip } from "../types";

interface Props {
  /**
   * EN: The ID of the track containing the clip being edited.
   * RU: Идентификатор дорожки, содержащей редактируемый клип.
   * @type {string}
   */
  trackID: string;

  /**
   * EN: The timeline clip for which fade effects and volume points will be edited.
   * RU: Клипа таймлайна, для которого будут редактироваться эффекты затухания и точки громкости.
   * @type {TimelineClip}
   */
  clip: TimelineClip;

  /**
   * EN: The scale factor for converting between time and pixels on the timeline, used for calculating fade durations and volume point positions.
   * RU: Коэффициент масштабирования для преобразования между временем и пикселями на таймлайне, используемый для расчёта длительности затухания и позиций точек громкости.
   * @type {number}
   */
  scale: number;
}

/**
 * EN: Custom hook that provides handlers for dragging fade in/out edges and volume points on a timeline clip.
 * Allows users to interactively adjust fade durations and volume automation points by dragging them on the timeline.
 *
 * RU: Пользовательский хук, который предоставляет обработчики для перетаскивания краёв затухания и точек громкости на клипе таймлайна.
 * Позволяет пользователям интерактивно настраивать длительность затухания и точки автоматизации громкости, перетаскивая их на таймлайне.
 *
 * The `handleFadeDrag` function manages the dragging of fade in and fade out edges, ensuring that the fade durations do not exceed the clip's duration and maintain a minimum gap between them.
 * The `handlePointDrag` function allows for dragging individual volume points, updating their time and value based on the mouse movement while ensuring they stay within the clip's duration and valid volume range.
 *
 * EN: The hook returns two handlers, `handleFadeDrag` for managing fade edge dragging and `handlePointDrag` for managing volume point dragging, which can be attached to the respective elements in the timeline UI.
 *
 * RU: Хук возвращает два обработчика, `handleFadeDrag` для управления перетаскиванием краёв затухания и `handlePointDrag` для управления перетаскиванием точек громкости, которые могут быть прикреплены к соответствующим элементам в интерфейсе таймлайна.
 *
 * @param {Props} props - The properties for the hook, including track ID, clip, and scale.
 * @returns {Object} An object containing the `handleFadeDrag` and `handlePointDrag` functions for managing drag interactions on the timeline clip.
 *
 */
export function useFadeDrag({ trackID, clip, scale }: Props) {
  const { updateClip } = useClips();

  const handleFadeDrag = useCallback(
    (e: React.MouseEvent, side: "left" | "right") => {
      e.stopPropagation();

      let prevX = e.clientX;
      const MIN_FADE = 0.2;

      let currentFadeIn = clip.fadeIn ?? 0;
      let currentFadeOut = clip.fadeOut ?? 0;

      const handleMove = (moveEvent: MouseEvent) => {
        const deltaPx = moveEvent.clientX - prevX;
        prevX = moveEvent.clientX;

        const deltaTime = deltaPx / scale;

        if (side === "left") {
          currentFadeIn += deltaTime;

          currentFadeIn = Math.max(0, currentFadeIn);
          currentFadeIn = Math.min(
            currentFadeIn,
            clip.duration - currentFadeOut - MIN_FADE,
          );

          updateClip(trackID, clip.id, {
            fadeIn: currentFadeIn,
          });
        }

        if (side === "right") {
          currentFadeOut -= deltaTime;

          currentFadeOut = Math.max(0, currentFadeOut);
          currentFadeOut = Math.min(
            currentFadeOut,
            clip.duration - currentFadeIn - MIN_FADE,
          );

          updateClip(trackID, clip.id, {
            fadeOut: currentFadeOut,
          });
        }
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [clip, scale, trackID, updateClip],
  );

  const handlePointDrag = useCallback(
    (e: React.MouseEvent, pointId: string) => {
      e.stopPropagation();

      const point = clip.volumePoints?.find((p) => p.id === pointId);
      if (!point) return;

      const H = 20;
      const TOP_PADDING = 2;
      const BOTTOM_PADDING = 2;

      const MIN_Y = TOP_PADDING;
      const MAX_Y = H - BOTTOM_PADDING;

      const startX = e.clientX;
      const startMouseY = e.clientY;

      const startPointY = H - point.value * H;
      const startTime = point.time;

      const handleMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startMouseY;

        const nextTime = Math.max(
          0,
          Math.min(startTime + deltaX / scale, clip.duration),
        );

        const nextY = Math.max(MIN_Y, Math.min(startPointY + deltaY, MAX_Y));

        const MIN_VALUE = 0.1;

        const nextValue = Math.max(MIN_VALUE, Math.min((H - nextY) / H, 1));

        updateClip(trackID, clip.id, {
          volumePoints: (clip.volumePoints ?? []).map((p) =>
            p.id === pointId ? { ...p, time: nextTime, value: nextValue } : p,
          ),
        });
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [clip, scale, trackID, updateClip],
  );

  return { handleFadeDrag, handlePointDrag };
}
