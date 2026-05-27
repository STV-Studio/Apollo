import { Fragment, lazy, memo, Suspense, useMemo, useState } from "react";
import { useClips, useCurrentTime } from "../context";
import {
  useDataEdit,
  useDebounceSearch,
  useDragDropAssets,
  type Asset,
  type ClipView,
} from "../utils";
import { useClipEdit } from "../utils/hooks/clips/useClipsEdit";
import AddAssets from "./AddAssets";
import AssetItem from "./AssetItem";

const OptionFilter = lazy(() => import("./OptionFilter"));

function ViewPortAssets() {
  const { clips } = useClips();
  const { currentTime } = useCurrentTime();

  const { handleEdit } = useDataEdit();
  const {
    isEditID,
    newName,
    handleChange,
    startEditing,
    saveEdit,
    cancelEdit,
  } = useClipEdit<string>({
    handleEdit: (id, newName) => handleEdit(id, { name: newName }),
    initialValue: "",
  });

  //* функция обработки дропа файлов в зону ассетов
  const { getRootProps, getInputProps, isDragActive } = useDragDropAssets();

  //* состояние для хранения текста поиска и выбранного типа ассетов для фильтрации отображаемых ассетов в зоне ассетов
  const [search, setSearch] = useState<string>("");
  const debonse = useDebounceSearch({ value: search, delay: 500 });
  const [selectedType, setSelectedType] = useState("all");

  //* отфильтрованный массив ассетов для отображения в зоне ассетов в зависимости от текста поиска и выбранного типа ассетов
  const FilterFiles = useMemo(() => {
    const text = debonse.toLowerCase();
    return clips.filter((el) => {
      const filterMach =
        el.id?.slice(0, 4).toLowerCase().includes(text) ||
        el.name?.toLowerCase().includes(text);
      const filterType = selectedType === "all" || el.type === selectedType;
      return filterMach && filterType;
    });
  }, [clips, debonse, selectedType]);

  //* отображение ассетов в зоне ассетов с возможностью редактирования имени и перетаскивания на таймлайн
  const ELEMENTS = FilterFiles.map((asset: Asset) => {
    const clip = asset as ClipView;
    return (
      <div
        draggable
        onDragStart={(e) => {
          const img = new Image();
          e.dataTransfer.setDragImage(img, 0, 0); //  убивает ghost

          document.body.classList.add("is-dragging");
          e.dataTransfer.setData("clipId", clip.id);
        }}
        onDragEnd={() => {
          document.body.classList.remove("is-dragging");
        }}
        key={clip.id}
      >
        <AssetItem
          clip={clip}
          currentTime={currentTime}
          isEditing={isEditID === clip.id}
          newName={newName}
          onChange={handleChange}
          onEdit={startEditing}
          onSave={saveEdit}
          onCancel={cancelEdit}
        />
      </div>
    );
  });

  //* отображение состояния зоны ассетов в зависимости от наличия ассетов и результатов фильтрации

  const RESALT = () => {
    if (FilterFiles.length === 0) {
      if (clips.length === 0) {
        return (
          <div key="empty-state" className="no_result">
            <h3> Drop your files</h3>
          </div>
        );
      } else {
        return (
          <div className="no_result">
            <h3>No results files</h3>
          </div>
        );
      }
    } else {
      return <Fragment key="list-state">{ELEMENTS}</Fragment>;
    }
  };

  //* отображение панели добавления ассетов и фильтрации при наличии ассетов

  const FILTER_OPTIONS = () => {
    if (clips.length === 0) {
      return null;
    } else {
      return (
        <Suspense fallback={"loading..."}>
          <div className="block_added_and_filter">
            <div>
              <AddAssets />
            </div>
            <div className="filter_block">
              <input
                type="text"
                value={search}
                placeholder="search file"
                onChange={(e) => setSearch(e.target.value)}
              />
              <OptionFilter clip={clips} onFilter={setSelectedType} />
            </div>
          </div>
        </Suspense>
      );
    }
  };

  const isFileDrag =
    isDragActive &&
    (window.event as DragEvent)?.dataTransfer?.types?.includes("Files");

  return (
    <div className="block__ViewPortFile" translate="no">
      {FILTER_OPTIONS()}
      <div
        className={`ViewPort_FILE_ZONE ${isFileDrag ? "drag" : ""}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {RESALT()}
      </div>
    </div>
  );
}
export default memo(ViewPortAssets);
