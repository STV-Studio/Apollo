import { CLIP_REGISTRY, type ClipType } from "./CLIP_REGISTRY";

/**
 * EN:
 * Checks whether a clip type can be added
 * from the ViewPort/Asset panel into the timeline.
 *
 * Used for:
 * - drag & drop validation
 * - filtering available asset types
 * - editor UI logic
 *
 * RU:
 * Проверяет, можно ли добавлять данный тип клипа
 * из ViewPort/панели ассетов на таймлайн.
 *
 * Используется для:
 * - проверки drag & drop
 * - фильтрации доступных ассетов
 * - логики редактора
 *
 * Example:
 * video  -> true
 * audio  -> true
 * text   -> false
 */
export function canDropFromViewport(type: ClipType) {
  return CLIP_REGISTRY[type].source === "viewport";
}

/**
 * EN:
 * Checks whether a clip type can be created
 * directly from the timeline UI.
 *
 * Usually used for:
 * - text clips
 * - effects
 * - transitions
 * - generated editor elements
 *
 * RU:
 * Проверяет, можно ли создавать данный тип клипа
 * напрямую через интерфейс таймлайна.
 *
 * Обычно используется для:
 * - текста
 * - эффектов
 * - переходов
 * - автоматически создаваемых элементов
 *
 * Example:
 * text        -> true
 * transition  -> true
 * video       -> false
 */
export function canCreateFromTimeline(type: ClipType) {
  return CLIP_REGISTRY[type].source === "timeline";
}

/**
 * EN:
 * Returns UI color for a clip type.
 *
 * Used for:
 * - timeline clip background
 * - visual grouping
 * - media type identification
 *
 * RU:
 * Возвращает UI цвет для типа клипа.
 *
 * Используется для:
 * - цвета clip block на таймлайне
 * - визуальной группировки
 * - определения типа медиа
 *
 * Example:
 * video -> blue
 * audio -> brown
 * image -> green
 */
export function getClipColor(type: ClipType) {
  return CLIP_REGISTRY[type].color;
}