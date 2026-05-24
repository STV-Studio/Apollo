import { CLIP_REGISTRY, type ClipType } from "./CLIP_REGISTRY";

export function getDefaultDuration(type: ClipType, asset: { id: string; duration: number }) {
  const config = CLIP_REGISTRY[type];


  const duration =
  config.source === "timeline" && "defaultDuration" in config
    ? config.defaultDuration
    : asset.duration;

  return duration
}