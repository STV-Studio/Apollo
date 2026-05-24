import { CLIP_REGISTRY, type ClipType } from "./CLIP_REGISTRY";

export function getDefaultDuration(type: ClipType) {
  const config = CLIP_REGISTRY[type];

  return "defaultDuration" in config
    ? config.defaultDuration
    : 5;
}