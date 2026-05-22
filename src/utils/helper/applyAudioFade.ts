import type { TimelineClip } from "../types";

interface Props {
  audio: HTMLAudioElement;
  clip: TimelineClip;
  currentTime: number;
}

export function applyAudioFade({ audio, clip, currentTime }: Props) {
  const local = currentTime - clip.start;

  if (local < 0 || local > clip.duration) {
    audio.volume = 0;
    return;
  }

  const fadeIn = clip.fadeIn ?? 0;
  const fadeOut = clip.fadeOut ?? 0;

  let volume = 1;

  // fade in
  if (fadeIn > 0 && local < fadeIn) {
    volume = local / fadeIn;
  }

  // fade out
  else if (fadeOut > 0 && clip.duration - local < fadeOut) {
    volume = (clip.duration - local) / fadeOut;
  }

  audio.volume = Math.max(0, Math.min(1, volume));
}
