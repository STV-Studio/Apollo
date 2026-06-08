import { memo } from "react";
import { Dropdown, type ShapeType } from "../../../utils";

import { useDrawContext } from "../../../context/DrawShapeContext/DrawShapeContext";

function Shapes() {
  const { setActiveShape } = useDrawContext();

  const shapes: ShapeType[] = ["rect", "circle", "triangle", "line"];

  const ListShape = shapes.map((shape) => {
    return (
      <li
        key={shape}
        onClick={() => {
          console.log("CLICK", shape);

          setActiveShape(shape);
        }}
      >
        {shape}
      </li>
    );
  });
  return <Dropdown trigger={<button>shapes</button>}>{ListShape}</Dropdown>;
}
export default memo(Shapes);
