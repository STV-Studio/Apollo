import { memo } from "react";
import TextEditor from "./TextEditor";

function Options() {
  return (
    <div className="options_function">
      <TextEditor />
    </div>
  );
}

export default memo(Options);
