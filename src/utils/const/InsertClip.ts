import type { TimelineClip, Track } from "../types";

  
export const isOverlap = (
    aStart: number,
    aDur: number,
    bStart: number,
    bDur: number,
  ) => {
    return aStart < bStart + bDur && aStart + aDur > bStart;
  };  


//! функция для вставки клипа на трек с учетом возможного пересечения с существующими клипами, обеспечивая корректное размещение и обрезку клипов при необходимости
export const insertClip = (track: Track, newClip: TimelineClip) => {
  const result: TimelineClip[] = [];

  const newStart = newClip.start;
  const newEnd = newClip.start + newClip.duration;
  const MIN_DURATION = 0.05;

  for (const clip of track.clips) {
    const clipStart = clip.start;
    const clipEnd = clip.start + clip.duration;

    if (clip.id === newClip.id) continue;

    //? нет пересечения
    if (newEnd <= clipStart || newStart >= clipEnd) {
      result.push(clip);
      continue;
    }

    //? новый полностью перекрывает старый - удаляем старый
    if (newStart <= clipStart && newEnd >= clipEnd) {
      continue;
    }

    //? новый внутри старого - разрезаем старый на 2 части
    if (newStart > clipStart && newEnd < clipEnd) {
      const left = newStart - clipStart;
      const right = clipEnd - newEnd;

      if (left > MIN_DURATION) {
        result.push({
          ...clip,
          duration: left,
        });
      }

      //* для правой части генерируем новый id, чтобы избежать конфликтов с существующими клипами, так как это фактически новый клип, образующийся в результате разрезания старого клипа
      if (right > MIN_DURATION) {
        result.push({
          ...clip,
          id: crypto.randomUUID(),
          start: newEnd,
          duration: right,
        });
      }

      continue;
    }

    //? новый заходит СЛЕВА (отрезаем начало старого)
    if (newStart <= clipStart && newEnd < clipEnd) {
    const cutPoint = Math.min(Math.max(newEnd, clipStart), clipEnd);
    const right = clipEnd - cutPoint;

    if (right > 0) {
      result.push({
        ...clip,
        start: cutPoint,
        duration: right,
      });
    }

    continue;
  }

    //? новый заходит СПРАВА (отрезаем конец старого)
    if (newStart > clipStart && newEnd >= clipEnd) {
      const cutPoint = Math.min(Math.max(newStart, clipStart), clipEnd);
      const left = cutPoint - clipStart;

      if (left > 0) {
        result.push({
          ...clip,
         duration: left,
        });
      }

      continue;
    }
  }

  //? добавляем новый клип после обработки всех пересечений, гарантируя его корректное размещение на треке
  result.push(newClip);


  //* сортируем клипы по началу для правильного отображения на таймлайне, обеспечивая логический порядок клипов в треке
  return result.sort((a, b) => a.start - b.start);
};