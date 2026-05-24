export const CLIP_REGISTRY = {
  video: {
    source: "viewport",
    color: "#5E7A8C",
    defaultDuration: null,
  },

  audio: {
    source: "viewport",
    color: "#8C6D5E",
    defaultDuration: null,
  },

  image: {
    source: "viewport",
    color: "#718E5E",
    defaultDuration: 5,
  },

  text: {
    source: "timeline",
    color: "#4F3626",
    defaultDuration: 5,
  },

  effect: {
    source: "timeline",
    color: "#6A4C93",
    defaultDuration: 3,
  },

  transition: {
    source: "timeline",
    color: "#C77DFF",
    defaultDuration: 1,
  },
} as const;

export type ClipType = keyof typeof CLIP_REGISTRY;