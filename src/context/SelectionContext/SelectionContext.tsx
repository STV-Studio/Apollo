import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ErrorMessage } from "../../utils";

interface SelectedContextProps {
  selectedClipId: string | null;
  setSelectedClipId: Dispatch<SetStateAction<string | null>>;
}

export const SelectedContext = createContext<SelectedContextProps | undefined>(
  undefined,
);

export function useSelected() {
  const context = useContext(SelectedContext);
  if (!context) {
    throw new Error(ErrorMessage);
  }
  return context;
}
