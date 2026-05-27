interface Props {
  /** 
   * EN: Time in seconds.
   *  
   * RU: Время в секундах. 
   */
  time: number;
}

/**
 * EN: Utility function to format time in minutes and seconds.
 * RU: Утилита для форматирования времени в минуты и секунды.
 *
 * @param time - Time in seconds to be formatted.
 * @returns Formatted time string in the format "MM:SS".
 * 
 * Example:
 * 
 * formatTime(125) // `returns "2:05"`
 */

export function formatTime({time}: Props) {
  const minutes = Math.floor(time / 60);

  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}