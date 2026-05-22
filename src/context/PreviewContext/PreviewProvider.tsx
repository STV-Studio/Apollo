import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { PreviewContext } from "./PreviewContext";

interface Props {
  children: ReactNode;
}
export function PreviewProvider({ children }: Props) {
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const VIDEO_REF = useRef<HTMLVideoElement | null>(null);
  const JUST_SEEKED = useRef(false);

  const handlePlay = useCallback(() => {
    const video = VIDEO_REF.current;

    const SAFE_OFFSET = 0.03;

    if (
      video &&
      video.duration &&
      video.currentTime >= video.duration - SAFE_OFFSET
    ) {
      video.currentTime = video.duration - SAFE_OFFSET;
    }

    if (JUST_SEEKED.current) {
      JUST_SEEKED.current = false;

      requestAnimationFrame(() => {
        video?.play().catch(() => {});
      });
    } else {
      video?.play().catch(() => {});
    }

    //  ВСЕ AUDIO
    requestAnimationFrame(() => {
      document.querySelectorAll("audio").forEach((el) => {
        const audio = el as HTMLAudioElement;
        audio.play().catch(() => {});
      });
    });

    setIsPlay(true);
  }, []);

  const setJustSeeked = useCallback((val: boolean) => {
    JUST_SEEKED.current = val;
  }, []);

  const handlePause = useCallback(() => {
    const video = VIDEO_REF.current;

    video?.pause();

    document.querySelectorAll("audio").forEach((el) => {
      (el as HTMLAudioElement).pause();
    });

    setIsPlay(false);
  }, []);

  const Props = useMemo(
    () => ({
      handlePlay,
      handlePause,
      isPlay,
      VIDEO_REF,
      JUST_SEEKED,
      setIsPlay,
      setJustSeeked,
    }),
    [handlePlay, handlePause, isPlay, setJustSeeked],
  );

  return (
    <PreviewContext.Provider value={Props}>{children}</PreviewContext.Provider>
  );
}
