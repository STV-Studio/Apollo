import type { Asset } from "./AssetType";


export type ClipView = Asset &{
  start: number
}


export type ClipViewTimeLine = {
  id: string;
  assetId: string;
  start: number;
  duration: number;
  type: "video" | "audio" | "image" | "default" | "text" ; 
  name?: string;
};

export type Track = {
  id: string,
  name: string
  clips: TimelineClip[]
  type?: "video" | "audio" | "image" | "default" | "text"
}

export type TimelineClip = {
  id: string;
  assetId: string;
  start: number;
  duration: number;
  name: string
  type: "video" | "audio" | "image" | "default" | "text";
  groupId?: string;
  sourceOffset?: number
  layer?: number
  x?: number;
  y?: number;
  width?: number;
  height?: number;

  fadeIn?: number;
  fadeOut?: number;
};

export type Project = {
  clips: Asset[];
  currentTime: number;
};


export type ClipWithTrack = TimelineClip & {
  trackIndex: number;
};



export const ErrorMessage = "Context is not defined"