import { memo, useMemo, type ChangeEvent, type KeyboardEvent } from "react";
import {
  formatTime,
  HoverBlock,
  onKey,
  useModal,
  type ClipView,
} from "../utils";

import Select_Option from "./Select_Option";
import ButtonBlockOptions from "./ButtonBlockOptions";
import AssetPreview from "./AssetPreview";
import AddDescriptionModal from "../Modals/AddDescriptionModal";

interface AssetItemProps {
  clip: ClipView;
  isEditing: boolean;
  newName: string;
  currentTime: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEdit: (id: string, currentName: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
}

function AssetItem({
  clip,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  newName,
  onChange,
  currentTime,
}: AssetItemProps) {
  const { id, name } = clip;
  const { handleClose, handleToggle, isOpen, handleIsOpen } = useModal();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const press = onKey(e);

    press.enter(() => onSave(id));
    press.esc(() => onCancel());
  };

  const props = useMemo(
    () => ({ clip, newName, onCancel, onSave }),
    [clip, newName, onCancel, onSave],
  );

  let nameContent;

  if (isEditing) {
    nameContent = (
      <>
        <input
          type="text"
          value={newName}
          placeholder="new name"
          onChange={onChange}
          autoFocus
          onBlur={onCancel}
          onKeyDown={handleKeyDown}
        />
        <ButtonBlockOptions {...props} />
      </>
    );
  } else {
    nameContent = (
      <h4 className="asset_name">Name: {name || id.slice(0, 4)}</h4>
    );
  }

  return (
    <div
      className="file_from_dropzone"
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={handleIsOpen}
    >
      <AssetPreview clip={clip} currentTime={currentTime} />

      {!isEditing && (
        <HoverBlock>
          {/* Заголовок карточки с типом ассета */}
          <div className="hover-header">
            <span className="hover-badge">{clip.type}</span>
          </div>

          {/* Зона превью */}
          <div className="hover-preview-wrapper">
            <AssetPreview clip={clip} currentTime={currentTime} />
          </div>

          {/* Техническая инфа */}
          <div className="hover-meta">
            <div className="meta-row">
              <span className="meta-label">Name</span>
              <span className="meta-value">
                {clip.name || clip.id.slice(0, 4)}
              </span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Duration</span>
              <span className="meta-value">
                {formatTime({ time: clip.duration })}s
              </span>
            </div>

            {clip.description && (
              <div className="meta-row description-row">
                <span className="meta-label">Description</span>
                <p className="meta-value desc-text">{clip.description}</p>
              </div>
            )}
          </div>
        </HoverBlock>
      )}

      <AddDescriptionModal
        clip={clip}
        assetId={id}
        isOpen={isOpen}
        handleClose={handleClose}
        handleToggle={handleToggle}
      />

      <div
        className="ID_NAME"
        onDoubleClick={() => !isEditing && onEdit(id, name || "")}
      >
        {nameContent}
        <Select_Option
          CLIP_ID={id}
          isEdit={isEditing}
          setIsEdit={() => onEdit(id, newName)}
        />
      </div>
    </div>
  );
}
export default memo(AssetItem);
