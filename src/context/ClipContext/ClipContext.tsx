import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ErrorMessage } from "../../utils";
import type { Asset, TimelineClip, Track } from "../../utils";

interface ClipContextProps {
  clips: Asset[];
  timeLineClips: TimelineClip[];
  selectedClipId: string | null;
  setSelectedClipId: Dispatch<SetStateAction<string | null>>;
  setClips: Dispatch<SetStateAction<Asset[]>>;
  setTimeLineClips: Dispatch<SetStateAction<TimelineClip[]>>;
  addClip: (clip: Asset) => void;
  addToTimeLineClip: (exeClip: TimelineClip) => void;
  updateClip: (id: string, clipID: string, data: Partial<TimelineClip>) => void;
  tracks: Track[];
  setTracks: Dispatch<SetStateAction<Track[]>>;
  addToTrack: (trackID: string, CLIP: TimelineClip) => void;
  addTrack: () => void;
  moveClipToTrack: (
    fromTrackID: string,
    toTrackID: string,
    clipID: string,
  ) => void;
}

export const ClipContext = createContext<ClipContextProps | undefined>(
  undefined,
);

export function useClips() {
  const context = useContext(ClipContext);
  if (!context) {
    throw new Error(ErrorMessage);
  }
  return context;
}
