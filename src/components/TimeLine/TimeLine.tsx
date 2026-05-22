import { memo } from "react";
import TimeRuler from "./TimeRuler";
import Playhead from "./Playhead";
import Tracks from "./Tracks";
import { useClips, usePreview } from "../../context";
import Options from "./Options/Options";
import TrackSidebar from "./TrackSidebar";
import {
  useDataEdit,
  useZoomEffect,
  useClipEdit,
  useTimeLineDrop,
  onKey,
  useTimelineClick,
} from "../../utils";

function TimeLine() {
  const { addTrack, tracks, setSelectedClipId, setTracks } = useClips();
  const { handlePlay, handlePause, isPlay } = usePreview();
  const { scale, STEP, containerRef } = useZoomEffect();
  const { handleTrackEdit } = useDataEdit();
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

  // функция обработки дропа клипа на таймлайн
  const { handleDrop } = useTimeLineDrop({ scale });

  // функция обработки клика по таймлайну для перемещения playhead и синхронизации видео
  const { handleTimelineClick } = useTimelineClick({ scale, containerRef });

  // функция обработки нажатия клавиш для управления воспроизведением видео с помощью пробела
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
        {/*  SIDEBAR */}
        <button className="btn__add_tracks" onClick={addTrack}>
          + add Tracks
        </button>
        <div className="timeline_sidebar">{track_sidebar}</div>

        {/*  TIMELINE */}
        <div className="timeline" onDrop={handleDrop}>
          <div
            className="timeline_inner"
            ref={containerRef}
            onClick={handleTimelineClick}
          >
            <div className="timeline_content">
              <TimeRuler scale={scale} STEP={STEP} />
              <Tracks scale={scale} />
              <Playhead scale={scale} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TimeLine);
