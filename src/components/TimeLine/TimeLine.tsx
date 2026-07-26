import { memo } from "react";
import TimeRuler from "./TimeRuler";
import Playhead from "./Playhead";
import Tracks from "./Tracks";
import { useClips, usePreview } from "../../context";
import Options from "./Options/Options";
import TrackSidebar from "./TrackSidebar";
import { useDataEdit, useClipEdit, useTimeLineDrop, onKey } from "../../utils";
import { useSelected } from "../../context/SelectionContext";
import { useZoomEffect } from "../../context/ZoomContext/ZoomContext";

function TimeLine() {
  const { addTrack, tracks, setTracks } = useClips();
  const { handlePlay, handlePause, isPlay } = usePreview();
  const { scale, containerRef } = useZoomEffect();
  const { handleTrackEdit } = useDataEdit();
  const { setSelectedClipId } = useSelected();
  const {
    isEditID,
    newName,
    handleChange,
    startEditing,
    saveEdit,
    cancelEdit,
  } = useClipEdit<string>({
    handleEdit: handleTrackEdit,
    initialValue: "",
  });

  const { handleDrop, gostClip, handleDragOver, setGostClip } = useTimeLineDrop(
    { scale },
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const press = onKey(e);

    press.space(() => {
      if (isPlay) {
        handlePause();
      } else {
        handlePlay();
      }
    });
  };

  const track_sidebar = tracks.map((track, index) => (
    <TrackSidebar
      isEditing={isEditID === track.id}
      newName={newName}
      onChange={handleChange}
      onEdit={startEditing}
      onSave={saveEdit}
      onCancel={cancelEdit}
      key={track.id}
      track={track}
      setTrack={setTracks}
      index={index}
    />
  ));

  return (
    <div onClick={() => setSelectedClipId(null)} className="timeline_wrapper">
      <Options />

      <div className="timeline_layout" onKeyDown={handleKeyDown} tabIndex={0}>
        {/* SIDEBAR */}
        <div className="timeline_sidebar">
          <button className="btn__add_tracks" onClick={addTrack}>
            + add Tracks
          </button>
          {track_sidebar}
        </div>

        {/* TIMELINE */}
        <div
          className="timeline"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setGostClip([])}
        >
          <div
            ref={containerRef}
            className="timeline_inner timeline_scroll_viewport"
          >
            <div className="timeline_content">
              <TimeRuler containerRef={containerRef} />
              <Tracks gostClip={gostClip} scale={scale} />
              <Playhead />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TimeLine);
