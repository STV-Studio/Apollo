import { memo } from "react";
import { useText } from "../../../utils";
function TextEditor() {
  const { handleAddedText } = useText();
  return <button onClick={handleAddedText}>Add Text</button>;
}
export default memo(TextEditor);
