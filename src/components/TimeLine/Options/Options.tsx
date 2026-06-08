import { memo } from "react";
import TextEditor from "./TextEditor";
import Shapes from "./Shapes";

function Options() {
  return (
    <div className="options_function">
      <TextEditor />
      <Shapes />
    </div>
  );
}

export default memo(Options);
