import type { Asset } from "../types";

export const getClipType = (file: File): Asset["type"] => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if(file.type.startsWith("audio/")) return "audio"
  return "image"; // fallback
};