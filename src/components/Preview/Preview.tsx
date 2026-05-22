import BlockCinima from "./BlockCinima";

import { useMediaSync } from "../../utils";
import Asset from "./Asset";
import Layers from "./Layers";

export default function Preview() {
  useMediaSync();
  return (
    <BlockCinima>
      <Asset />
      <Layers />
    </BlockCinima>
  );
}
