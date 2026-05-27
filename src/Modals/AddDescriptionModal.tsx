import AssetPreview from "../components/AssetPreview";
import { useClips } from "../context";
import { formatTime, Modal, type ClipView } from "../utils";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleToggle: () => void;
  assetId?: string;
  clip: ClipView;
}

export default function AddDescriptionModal({
  isOpen,
  handleClose,
  handleToggle,
  assetId,
  clip,
}: Props) {
  const { setClips } = useClips();
  const { name, type, duration, size, id } = clip;
  const [description, setDescription] = useState<string>("");

  const [message, setMessage] = useState<string>("");

  const handleChangeDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value);
  };

  const handleSave = () => {
    if (description.length === 0) {
      setMessage("Description cannot be empty.");
      return;
    }
    setClips((prev) =>
      prev.map((item) =>
        item.id === assetId ? { ...item, description } : item,
      ),
    );

    handleClose();
    setMessage("");
    setDescription("");
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      handleToggle={handleToggle}
    >
      <div className="modal-header">
        <span className="badge">{type}</span>
        <h2 className="modal-title" title={`Clip: ${id}`}>
          Clip: {id.slice(0, 8)}...
        </h2>
      </div>

      <div className="modal-body">
        <div className="modal-preview-zone">
          <AssetPreview clip={clip} currentTime={0} />
        </div>

        <div className="modal-info-zone">
          <div className="info-row">
            <span className="info-label">Name:</span>
            <span className="info-value">{name || id.slice(0, 6)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Duration:</span>
            <span className="info-value">
              {formatTime({ time: duration })}s
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Size:</span>
            <span className="info-value">
              {(size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <label className="textarea-label">Description</label>
        <textarea
          className="description_textarea"
          placeholder="Enter description here..."
          rows={3}
          value={description}
          onChange={handleChangeDescription}
          style={{ resize: "vertical" }}
        />
        {message && <p className="error-message">{message}</p>}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
