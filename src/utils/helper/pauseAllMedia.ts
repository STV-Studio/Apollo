export function pauseAllMedia(video: HTMLVideoElement | null) {
  video?.pause();

  document.querySelectorAll("audio").forEach((el) => {
    (el as HTMLAudioElement).pause();
  });
}