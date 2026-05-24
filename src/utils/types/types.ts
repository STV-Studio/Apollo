import type { Asset } from "./AssetType";

/**
 * EN: Asset prepared for preview rendering.
 * Extends the original Asset type by adding
 * a start time on the timeline.
 *
 * RU: Ассет, подготовленный для отображения в preview.
 * Расширяет Asset добавлением времени начала
 * на таймлайне.
 */
export type ClipView = Asset & {
  /**
   * EN: Start time on timeline in seconds.
   * RU: Время начала на таймлайне в секундах.
   */
  start: number;
};

/**
 * EN: Lightweight timeline clip representation.
 * Used mainly for rendering clip blocks in the UI.
 *
 * RU: Упрощённое представление клипа на таймлайне.
 * Используется в основном для отображения
 * clip blocks в интерфейсе.
 */
export type ClipViewTimeLine = {
  /**
   * EN: Unique clip identifier.
   * RU: Уникальный ID клипа.
   */
  id: string;

  /**
   * EN: ID of the source Asset linked to this clip.
   * RU: ID исходного Asset, связанного с этим клипом.
   */
  assetId: string;

  /**
   * EN: Timeline start position in seconds.
   * RU: Позиция начала на таймлайне в секундах.
   */
  start: number;

  /**
   * EN: Clip duration in seconds.
   * RU: Длительность клипа в секундах.
   */
  duration: number;

  /**
   * EN: Media type used for rendering logic.
   * RU: Тип медиа для логики отображения.
   */
  type: "video" | "audio" | "image" | "default" | "text" | "effect";

  /**
   * EN: Optional custom clip name.
   * RU: Пользовательское имя клипа.
   */
  name?: string;
};

/**
 * EN: Timeline track containing clips.
 * Similar to tracks in Premiere or DaVinci Resolve.
 *
 * RU: Дорожка таймлайна, содержащая клипы.
 * Аналог дорожек в Premiere или DaVinci Resolve.
 */
export type Track = {
  /**
   * EN: Unique track identifier.
   * RU: Уникальный ID дорожки.
   */
  id: string;

  /**
   * EN: Visible track name.
   * RU: Название дорожки.
   */
  name: string;

  /**
   * EN: List of clips placed on the track.
   * RU: Список клипов на дорожке.
   */
  clips: TimelineClip[];

  /**
   * EN: Optional track media type.
   * RU: Тип дорожки.
   */
  type?: "video" | "audio" | "image" | "default" | "text" | "effect";
};

/**
 * EN: Main timeline clip entity.
 * Represents an Asset placed on the timeline.
 *
 * RU: Основная сущность клипа таймлайна.
 * Представляет Asset, размещённый на таймлайне.
 *
 * Difference:
 * Asset = original file/data
 * TimelineClip = instance on timeline
 */
export type TimelineClip = {
  /**
   * EN: Unique clip identifier.
   * RU: Уникальный ID клипа.
   */
  id: string;

  /**
   * EN: Linked source asset ID.
   * RU: ID связанного ассета.
   */
  assetId: string;

  /**
   * EN: Start position on timeline in seconds.
   * RU: Начальная позиция на таймлайне.
   */
  start: number;

  /**
   * EN: Visible duration of the clip.
   * RU: Видимая длительность клипа.
   */
  duration: number;

  /**
   * EN: Display name of the clip.
   * RU: Отображаемое имя клипа.
   */
  name: string;

  /**
   * EN: Clip media type.
   * RU: Тип клипа.
   */
  type: "video" | "audio" | "image" | "default" | "text" | "effect";

  /**
   * EN: Optional group identifier.
   * Used for linked clips or grouped media.
   *
   * RU: ID группы клипов.
   * Используется для связанных клипов.
   */
  groupId?: string;

  /**
   * EN: Offset inside the source media.
   * Used when trimming clips.
   *
   * RU: Смещение внутри исходного медиа.
   * Используется при trim/resizing.
   */
  sourceOffset?: number;

  /**
   * EN: Rendering layer index.
   * Higher layer = rendered above others.
   *
   * RU: Слой рендера.
   * Чем выше слой — тем выше клип отображается.
   */
  layer?: number;

  /**
   * EN: X position inside preview window.
   * RU: Позиция по X в preview.
   */
  x?: number;

  /**
   * EN: Y position inside preview window.
   * RU: Позиция по Y в preview.
   */
  y?: number;

  /**
   * EN: Width inside preview renderer.
   * RU: Ширина объекта в preview.
   */
  width?: number;

  /**
   * EN: Height inside preview renderer.
   * RU: Высота объекта в preview.
   */
  height?: number;

  /**
   * EN: Fade-in duration in seconds.
   * Controls smooth volume appearance.
   *
   * RU: Длительность плавного появления звука.
   */
  fadeIn?: number;

  /**
   * EN: Fade-out duration in seconds.
   * Controls smooth volume disappearance.
   *
   * RU: Длительность плавного затухания звука.
   */
  fadeOut?: number;
};

/**
 * EN: Serializable project state.
 * Used for saving/loading editor sessions.
 *
 * RU: Сохраняемое состояние проекта.
 * Используется для сохранения и загрузки проекта.
 */
export type Project = {
  /**
   * EN: Imported project assets.
   * RU: Импортированные ассеты проекта.
   */
  clips: Asset[];

  /**
   * EN: Current timeline playback position.
   * RU: Текущая позиция playback на таймлайне.
   */
  currentTime: number;
};

/**
 * EN: Timeline clip extended with track index.
 * Used for playback rendering order calculations.
 *
 * RU: TimelineClip с индексом дорожки.
 * Используется для вычисления порядка рендера.
 */
export type ClipWithTrack = TimelineClip & {
  /**
   * EN: Track position index.
   * RU: Индекс дорожки.
   */
  trackIndex: number;
};


/**
 * EN:
 * Collection of visible overlay layers.
 *
 * RU:
 * Коллекция активных overlay слоёв.
 */
export type ActiveLayers = ClipWithTrack[];

/**
 * EN: Shared error message for invalid context usage.
 *
 * RU: Общая ошибка при использовании
 * неинициализированного React Context.
 */
export const ErrorMessage = "Context is not defined";