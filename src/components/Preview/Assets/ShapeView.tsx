import { memo } from "react";
import type { ShapeAsset } from "../../../utils";

function ShapeView({ asset }: { asset: ShapeAsset }) {
  const validShapes = ["rect", "circle", "triangle", "line"];

  if (!asset.shapes || asset.shapes.length === 0) {
    return null;
  }

  return (
    <>
      {asset.shapes.map((shape) => {
        if (!validShapes.includes(shape)) return null;

        return <div key={shape} className={`shape_${shape}`} />;
      })}
    </>
  );
}

export default memo(ShapeView);
