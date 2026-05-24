// CLIP_REGISTRY.ts
export const CLIP_REGISTRY = {
  video: {
    source: "viewport",
    color: "#5E7A8C",
    creates: ["video", "audio"],
  },

  audio: {
    source: "viewport",
    color: "#8C6D5E",
    creates: ["audio"],
  },

  image: {
    source: "viewport",
    color: "#718E5E",
    creates: ["image"],
  },

  text: {
    source: "timeline",
    color: "#4F3626",
    creates: ["text"],
    defaultDuration: 5,
  },

  effect: {
    source: "timeline",
    color: "#6A4C93",
    creates: ["effect"],
    defaultDuration: 3,
  },
} as const;

export type ClipType = keyof typeof CLIP_REGISTRY;