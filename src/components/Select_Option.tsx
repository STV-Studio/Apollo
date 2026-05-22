import { memo, useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { useDataEdit } from "../utils";

interface Props {
  CLIP_ID: string;
  isEdit: boolean;
  setIsEdit: () => void;
}

function Select_Option({ CLIP_ID, setIsEdit, isEdit }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { handleDeleteClip } = useDataEdit();

  const startEditing = () => {
    setIsEdit();
    setIsOpen(false);
  };

  const Delete = () => {
    handleDeleteClip(CLIP_ID);
    setIsOpen(false);
  };

  const LIST = isOpen && (
    <>
      <div
        onClick={() => setIsOpen(false)}
        style={{ position: "fixed", inset: 0, zIndex: 10 }}
      />

      <div className="MENU_OPTION">
        <ul style={{ listStyle: "none", margin: 0, padding: "5px" }}>
          <li onClick={startEditing}>Edit</li>
          <li onClick={Delete}>Delete</li>
        </ul>
      </div>
    </>
  );

  return (
    <div className="box_all">
      {!isEdit && (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="btn_option"
        >
          <SlOptionsVertical
            title="option"
            style={{ cursor: "pointer", color: "white" }}
          />
        </button>
      )}
      {LIST}
    </div>
  );
}

export default memo(Select_Option);
