import { useState } from "react";
import type { Dispatch, JSX, SetStateAction } from "react";
import { useText } from "../../../utils";
import type { Asset, ClipWithTrack } from "../../../utils";

interface Props {
  asset: Asset;
  clip: ClipWithTrack;
  isSelected: boolean;
  setSelectedClipId: Dispatch<SetStateAction<string | null>>;
}

export default function TextView({
  asset,
  clip,
  setSelectedClipId,
}: Props): JSX.Element | null {
  const [isTextEdit, setIsTextEdit] = useState(false);
  const [newText, setNewText] = useState("");

  const { handleUpdateText } = useText();

  const saveText = () => {
    if (asset.type !== "text") return;

    handleUpdateText(asset.id, newText);
    setIsTextEdit(false);
  };

  if (asset.type !== "text") return null;

  const fontSize = clip.fontSize ?? 24;

  const CONTEXT = (): JSX.Element | null => {
    if (isTextEdit) {
      return (
        <textarea
          style={{ fontSize }}
          className="layer_text_input"
          value={newText}
          autoFocus
          onChange={(e) => setNewText(e.target.value)}
          onBlur={saveText}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveText();

            if (e.key === "Escape") {
              setIsTextEdit(false);
              setNewText(asset.text);
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      );
    } else {
      return (
        <div
          className="layer_text"
          onDoubleClick={(e) => {
            e.stopPropagation();
            setSelectedClipId(clip.id);
            setNewText(asset.text);
            setIsTextEdit(true);
          }}
          style={{ fontSize }}
        >
          {asset.text}
        </div>
      );
    }
  };

  return CONTEXT();
}
