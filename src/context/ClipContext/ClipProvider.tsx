import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ClipContext } from "./ClipContext";
import type { Asset, TimelineClip, Track } from "../../utils";
import { insertClip } from "../../utils";

type Props = {
  children: ReactNode;
};

export function ClipProvider({ children }: Props) {
  const [clips, setClips] = useState<Asset[]>([]);
  const [timeLineClips, setTimeLineClips] = useState<TimelineClip[]>([]);
  const [tracks, setTracks] = useState<Track[]>([
    { id: "1", name: "Track 1", clips: [] },
    { id: "2", name: "Track 2", clips: [] },
    { id: "3", name: "Track 3", clips: [] },
    { id: "4", name: "Track 4", clips: [] },
    { id: "5", name: "Track 5", clips: [] },
    { id: "6", name: "Track 6", clips: [] },
  ]);

  //! состояние для хранения идентификатора выбранного клипа, которое может быть использовано для управления выделением клипа на таймлайне или треке.
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  // ----

  /* 
    функция для добавления нового клипа в список клипов, 
    которая принимает объект клипа и обновляет состояние clips,
    добавляя новый клип в массив существующих клипов с помощью функции setClips. 
  */
  const addClip = useCallback(
    (clip: Asset) => {
      setClips((prev) => [...prev, clip]);
    },
    [setClips],
  );

  // ----

  /* 
    функция для добавления клипа на таймлайн, которая принимает объект клипа и обновляет состояние timeLineClips,
    добавляя новый клип в массив существующих клипов на таймлайне с помощью функции setTimeLineClips. 
  */
  const addToTimeLineClip = useCallback(
    (exeClip: TimelineClip) => {
      setTimeLineClips((prev) => [...prev, exeClip]);
    },
    [setTimeLineClips],
  );

  // ----

  /*
    функция для добавления клипа на трек, которая принимает идентификатор трека и объект клипа. 
    Она обновляет состояние треков, находя нужный трек по его идентификатору и добавляя новый клип в массив клипов этого трека с помощью функции insertClip.
  */
  const addToTrack = useCallback((trackID: string, CLIP: TimelineClip) => {
    setTracks((prev) => {
      const next = prev.map((item: Track) => {
        console.log("CHECK", item.id === trackID);

        return item.id === trackID
          ? {
              ...item,
              clips: insertClip(item, CLIP),
            }
          : item;
      });

      return next;
    });
  }, []);

  // ----

  // функция для добавления нового трека, которая обновляет состояние треков, добавляя новый трек в массив существующих треков с помощью функции setTracks.
  const addTrack = useCallback(() => {
    setTracks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: `Track ${prev.length + 1}`, clips: [] },
    ]);
  }, []);

  // ----

  /* 
    функция для перемещения клипа между треками, которая принимает идентификаторы исходного и целевого трека,
    а также идентификатор клипа. 
    Она обновляет состояние треков, удаляя клип из старого трека и добавляя его в новый трек.
  */
  const moveClipToTrack = useCallback(
    (fromTrackID: string, toTrackID: string, clipID: string) => {
      setTracks((prev) => {
        let movedClip: TimelineClip | null = null;

        // 1. удалить из старого трека
        const withoutOld = prev.map((track) => {
          if (track.id === fromTrackID) {
            const clip = track.clips.find((c) => c.id === clipID);
            if (clip) movedClip = clip;

            return {
              ...track,
              clips: track.clips.filter((c) => c.id !== clipID),
            };
          }
          return track;
        });

        // 2. добавить в новый трек
        return withoutOld.map((track) => {
          if (track.id === toTrackID && movedClip) {
            return {
              ...track,
              clips: [...track.clips, movedClip],
            };
          }
          return track;
        });
      });
    },
    [],
  );

  // ----

  /*
    функция для обновления клипа внутри трека,
    которая принимает идентификатор трека, идентификатор клипа и объект с новыми данными для обновления клипа.
    Она использует setTracks для обновления состояния треков, находя нужный трек и клип по их идентификаторам и обновляя данные клипа с помощью spread оператора.
  */
  const updateClip = useCallback(
    (
      trackID: string,
      clipID: string,
      data: Omit<Partial<TimelineClip>, "layer">,
    ) => {
      setTracks((prev) =>
        prev.map((track) =>
          track.id === trackID
            ? {
                ...track,
                clips: track.clips.map((clip) =>
                  clip.id === clipID ? { ...clip, ...data } : clip,
                ),
              }
            : track,
        ),
      );
    },
    [setTracks],
  );

  // ----

  //! useMemo для оптимизации производительности, чтобы не пересоздавать объект значений при каждом рендере, а только при изменении зависимостей */
  const VALUES = useMemo(
    () => ({
      moveClipToTrack,
      timeLineClips,
      setTimeLineClips,
      addToTimeLineClip,
      clips,
      setClips,
      addClip,
      updateClip,
      tracks,
      setTracks,
      addToTrack,
      addTrack,
      selectedClipId,
      setSelectedClipId,
    }),
    [
      moveClipToTrack,
      timeLineClips,
      setTimeLineClips,
      addToTimeLineClip,
      clips,
      addClip,
      setClips,
      updateClip,
      tracks,
      setTracks,
      addToTrack,
      addTrack,
      selectedClipId,
      setSelectedClipId,
    ],
  );

  return <ClipContext.Provider value={VALUES}>{children}</ClipContext.Provider>;
}
