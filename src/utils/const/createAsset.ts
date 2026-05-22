import type { Asset } from "../types";
import { getClipType } from "./getClipType";

export function createAsset(file: File, url: string, duration: number): Asset {
  const type = getClipType(file);

  const base = {
    id: crypto.randomUUID(),
    size: file.size,
    duration,
  };

  switch (type) {
    case "video":
      return {
        ...base,
        type: "video",
        src: url,
      };

    case "audio":
      return {
        ...base,
        type: "audio",
        src: url,
      };

    case "image":
      return {
        ...base,
        type: "image",
        src: url,
      };

    case "text":
      return {
        ...base,
        type: "text",
        text: file.name,
      };
  }
}