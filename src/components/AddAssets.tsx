import { memo } from "react";
import { useClips } from "../context";
import { useFileReader } from "../utils/hooks/ui/useFileReader";

function AddAssets() {
  const { addClip } = useClips();
  const { readFile } = useFileReader();

  const handleAddClip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      const clip = await readFile(file);
      if (clip) addClip(clip);
    }

    e.target.value = "";
  };
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="file"
        accept="image/*,video/*, audio/*"
        onChange={handleAddClip}
      />
    </form>
  );
}
export default memo(AddAssets);
