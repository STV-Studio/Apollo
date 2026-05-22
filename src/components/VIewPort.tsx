import { lazy, memo, Suspense } from "react";
import Preview_Window from "./Preview/Preview_Window";

const ViewPortAssets = lazy(() => import("./ViewPortAssets"));

function VIewPort() {
  return (
    <Suspense fallback={"loading..."}>
      <div className="Preview_Container">
        <ViewPortAssets />
        <Preview_Window />
      </div>
    </Suspense>
  );
}

export default memo(VIewPort);
