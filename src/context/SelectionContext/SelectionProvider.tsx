import React, { useMemo, useState } from "react";
import { SelectedContext } from "./SelectionContext";

interface Props {
  children: React.ReactNode;
}

export default function SelectionProvider({ children }: Props) {
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  const VALUES = useMemo(
    () => ({ selectedClipId, setSelectedClipId }),
    [selectedClipId],
  );
  return (
    <SelectedContext.Provider value={VALUES}>
      {children}
    </SelectedContext.Provider>
  );
}
