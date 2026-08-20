import React from "react";
import ReactDOM from "react-dom";
import CustomVideoPlayer from "../../../../components/CustomVideoPlayer/CustomVideoPlayer";

/** Same popup used by Reels and Success Stories so fullscreen/portrait behavior matches. */
export default function PortraitVideoModal({
  open,
  src,
  onClose,
  playerRef,
  playerId,
  onPlay,
  onPause,
}) {
  if (!open || !src) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[80] p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded-lg shadow-2xl w-full max-w-[360px] aspect-[9/16] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-[40px] font-bold z-50 hover:opacity-80"
        >
          &times;
        </button>
        <div className="relative w-full h-full">
          <CustomVideoPlayer
            ref={playerRef}
            id={playerId}
            src={src}
            className="rounded-lg w-full h-full object-contain"
            autoPlay
            orientation="portrait"
            pauseOtherVideos={true}
            onPlay={onPlay}
            onPause={onPause}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
