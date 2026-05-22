import { memo } from "react";
import Preview from "./Preview";

function Preview_Window() {
  return (
    <div className="preview_window">
      <Preview />
    </div>
  );
}
export default memo(Preview_Window);
