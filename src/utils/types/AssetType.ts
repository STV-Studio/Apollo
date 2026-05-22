export type BaseAsset = {
  id: string;
  size: number;
  duration: number;
  name?: string;
};

export type VideoAsset = BaseAsset & {
  type: "video";
  src: string;
  hasAUDIO?: boolean;
};

export type AudioAsset = BaseAsset & {
  type: "audio";
  src: string;
};

export type ImageAsset = BaseAsset & {
  type: "image";
  src: string;
};

export type TextAsset = BaseAsset & {
  type: "text";
  text: string;
};

export type Asset =
  | VideoAsset
  | AudioAsset
  | ImageAsset
  | TextAsset;