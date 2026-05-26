import type { TimelineClip } from "../types";


interface Props{
    /**
     * EN: The timeline clip for which the volume level will be calculated.
     * RU: Клипа таймлайна, для которого будет рассчитан уровень громкости.
     */
    clip: TimelineClip
    /**
     * EN: The local time (in seconds) on the clip for which the volume level will be calculated.
     * RU: Локальное время (в секундах) на клипе, для которого будет рассчитан уровень громкости.
     */
    local: number;
}

/**
 * 
 * @param clip 
 * @param local 
 * @returns 
 * EN: Calculates the volume level at a specific local time on a timeline clip based on defined volume points.
 * Allows for precise volume automation by interpolating between defined points.
 * 
 * RU: Вычисляет уровень громкости в определённое локальное время на клипе таймлайна на основе заданных точек громкости.
 * Позволяет точно контролировать автоматизацию громкости, интерполируя между заданными точками.
 * 
 */
export function getPointsVolume({ clip, local}: Props) {
  const points = [...(clip.volumePoints ?? [])].sort(
    (a, b) => a.time - b.time,
  );

  if (points.length === 0) return 1;

  const before = [...points].reverse().find((p) => p.time <= local);
  const after = points.find((p) => p.time >= local);

  if (!before && after) return after.value;
  if (before && !after) return before.value;
  if (!before || !after) return 1;

  if (before.id === after.id) return before.value;

  const progress = (local - before.time) / (after.time - before.time);

  return before.value + (after.value - before.value) * progress;
}