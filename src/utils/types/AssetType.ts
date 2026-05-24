/**
 * EN: Base entity for every project asset.
 * Stores shared metadata for video, audio, image and text assets.
 *
 * RU: Базовая сущность любого ассета проекта.
 * Хранит общие метаданные для видео, аудио, изображений и текста.
 *
 * @see docs/assets.md
 */

export type BaseAsset = {
  /** EN: Unique asset identifier. RU: Уникальный ID ассета. */
  id: string;
   /** EN: File size in bytes. RU: Размер файла в байтах. */
  size: number;
  /** EN: Media duration in seconds. RU: Длительность медиа в секундах. */
  duration: number;
  /** EN: Display name. RU: Отображаемое имя. */
  name?: string;
};

/**
 * EN: Video file used inside the editor timeline.
 * Contains a path to the video and optional information
 * about whether the video has audio.
 *
 * RU: Видео ассет, используемый в редакторе.
 * Содержит ссылку на видео и информацию,
 * есть ли у видео встроенный звук.
 *
 * Example:
 * mp4, webm, mov
 */
export type VideoAsset = BaseAsset & {
  /**
   * EN: Asset type identifier.
   * RU: Тип ассета.
   */
  type: "video";

  /**
   * EN: Browser URL or local blob path to the video.
   * RU: Ссылка или blob-путь к видео файлу.
   */
  src: string;

  /**
   * EN: Indicates whether the video contains audio.
   * RU: Показывает, есть ли встроенный звук у видео.
   */
  hasAUDIO?: boolean;
};

/**
 * EN: Audio file used on timeline tracks.
 * Can be music, voice, sound effects etc.
 *
 * RU: Аудио файл для дорожек таймлайна.
 * Может быть музыкой, голосом или звуковым эффектом.
 *
 * Example:
 * mp3, wav, ogg
 */
export type AudioAsset = BaseAsset & {
  /**
   * EN: Asset type identifier.
   * RU: Тип ассета.
   */
  type: "audio";

  /**
   * EN: Browser URL or blob path to the audio file.
   * RU: Ссылка или blob-путь к аудио файлу.
   */
  src: string;
};

/**
 * EN: Image asset displayed inside the preview window.
 * Usually used for overlays, backgrounds or photos.
 *
 * RU: Изображение, отображаемое в preview окне.
 * Обычно используется как фон, фото или overlay.
 *
 * Example:
 * png, jpg, webp
 */
export type ImageAsset = BaseAsset & {
  /**
   * EN: Asset type identifier.
   * RU: Тип ассета.
   */
  type: "image";

  /**
   * EN: Path to the image file.
   * RU: Путь к изображению.
   */
  src: string;
};

/**
 * EN: Virtual text asset.
 * Unlike video/audio/image it does not use a file.
 * Text is rendered directly inside the preview.
 *
 * RU: Виртуальный текстовый ассет.
 * В отличие от видео или изображений
 * не использует отдельный файл.
 * Текст рендерится напрямую в preview.
 */
export type TextAsset = BaseAsset & {
  /**
   * EN: Asset type identifier.
   * RU: Тип ассета.
   */
  type: "text";

  /**
   * EN: Text displayed on screen.
   * RU: Текст, отображаемый в preview окне.
   */
  text: string;
};

/**
 * EN: Union type containing every supported asset type.
 * Used when the editor works with any media object.
 *
 * RU: Общий тип всех поддерживаемых ассетов редактора.
 * Используется когда редактор работает
 * с любым медиа объектом.
 *
 * Includes:
 * - VideoAsset
 * - AudioAsset
 * - ImageAsset
 * - TextAsset
 */
export type Asset =
  | VideoAsset
  | AudioAsset
  | ImageAsset
  | TextAsset;