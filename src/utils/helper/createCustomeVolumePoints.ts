import type { TimelineClip } from "../types";

/**
    EN Props for creating a custom volume point on a timeline clip.
    RU Свойства для создания пользовательской точки громкости на клипе таймлайна.
 */
interface Props{
    /**
     * EN: The timeline clip to which the custom volume point will be added.
     * RU: Таймлайн клип, к которому будет добавлена пользовательская точка громкости.
     */
    clip: TimelineClip
    /**
     * EN: The local time (in seconds) on the clip where the volume point will be placed.
     * RU: Локальное время (в секундах) на клипе, где будет размещена точка громкости.
     */
    localTime: number;
    /**
     * EN: The volume level (from 0 to 1) for the new point.
     * RU: Уровень громкости (от 0 до 1) для новой точки.
     */
    value: number
}

/**
 * Creates a new custom volume point for a given clip at a specific time and value.
 * Allows for precise volume automation control by defining points with time and volume level.
 * 
 * EN: Creates a new custom volume point for a given clip at a specific time and value.
 * Allows for precise volume automation control by defining points with time and volume level.
 * 
 * RU: Создаёт новую пользовательскую точку громкости для данного клипа в определённое время и с определённым значением.
 * Позволяет точно контролировать автоматизацию громкости, задавая точки с временем и уровнем громкости.
 * 
 * 
 *  EN: The function takes a clip, a local time on that clip, and a volume value, and returns a new volume point object with a unique ID, the specified time (clamped to the clip's duration), and the specified value (clamped between 0 and 1).
    * @param {Props} props - The properties for creating a custom volume point.
    * @param {TimelineClip} props.`clip` - The timeline clip to which the volume point will be added.
    * @param {number} props.`localTime` - The time (in seconds) on the clip where the volume point will be placed.
    * @param {number} props.`value` - The volume level (0 to 1) for the new point.
    * @returns {VolumePoint} A new volume point object with a unique ID, time, and value.
    * 
    * 
    * RU : Функция принимает клип, локальное время на этом клипе и значение громкости, и возвращает новый объект точки громкости с уникальным ID, указанным временем (ограниченным длительностью клипа) и указанным значением (ограниченным между 0 и 1).
    * @param {Props} props - Свойства для создания пользовательской точки громкости.
    * @param {TimelineClip} props.`clip` - Таймлайн клип, к которому будет добавлена точка громкости.
    * @param {number} props.`localTime` - Время (в секундах) на клипе, где будет размещена точка громкости.
    * @param {number} props.`value` - Уровень громкости (от 0 до 1) для новой точки.
    * @returns {VolumePoint} Новый объект точки громкости с уникальным ID, временем и значением.
    * 
 */




export function getCustomeVolumePoints({clip, localTime, value = 1}: Props){

    const newPoint = {
        id: crypto.randomUUID(),
        time: Math.max(0, Math.min(localTime, clip.duration)),
        value: Math.max(0, Math.min(value, 1)),
    }
    return newPoint

}
