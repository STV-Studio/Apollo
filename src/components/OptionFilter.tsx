import { memo, useState } from "react";
import type { Asset } from "../utils";

interface Props {
  clip: Asset[];
  onFilter: (value: string) => void;
}

function OptionFilter({ clip, onFilter }: Props) {
  const [selectedColumn, setSelectedColumn] = useState("all");
  const uniquewOptions = [...new Set(clip.map((item) => item.type))];
  const OPTION = uniquewOptions.map((type) => {
    return (
      <option key={type} value={type}>
        {type}
      </option>
    );
  });

  const handleSelectedFile = (value: string) => {
    setSelectedColumn(value);
    onFilter(value);
  };
  return (
    <select
      value={selectedColumn}
      onChange={(e) => handleSelectedFile(e.target.value)}
    >
      <option value={"all"}>all</option>
      {OPTION}
    </select>
  );
}
export default memo(OptionFilter);
