import type { TimelineClip } from "../types";
import { getPointsVolume } from "./getPointsVolume";

interface Props {
  /**
   * EN: The audio element to which the fade effects will be applied.
   * 
   * RU: Аудио элемент, к которому будут применяться эффекты затухания.
    * @type {HTMLAudioElement}
   */
  audio: HTMLAudioElement;

  /**
   * EN: The timeline clip containing the properties for fade in, fade out, and volume automation.
   * 
   * RU: Клипа таймлайна, содержащий свойства для затухания и автоматизации громкости.
   * @type {TimelineClip}
   */
  clip: TimelineClip;

  /**
   * EN: The current playback time in seconds, used to determine the local time on the clip for applying fade effects.
   *
   * RU: Текущее время воспроизведения в секундах, используемое для определения локального времени на клипе для применения эффектов затухания.
   * @type {number}
   * 
   */
  currentTime: number;
}

/**
 * EN: Applies fade in and fade out effects to an audio element based on the clip's properties and current playback time.
 * Adjusts the audio volume according to the defined fade durations and any custom volume points on the clip.
 * 
 * RU: Применяет эффекты плавного затухания и появления к аудио элементу на основе свойств клипа и текущего времени воспроизведения.
 * Регулирует громкость аудио в соответствии с заданными длительностями затухания и любыми пользовательскими точками громкости на клипе.
 *  
 */
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

  const pointsVolume = getPointsVolume({ clip, local });

  const finalVolume = volume * pointsVolume;

  audio.volume = Math.max(0, Math.min(1, finalVolume));
}
