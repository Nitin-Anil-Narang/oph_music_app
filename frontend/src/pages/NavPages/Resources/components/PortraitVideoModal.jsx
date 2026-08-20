import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import CustomVideoPlayer from "../../../../components/CustomVideoPlayer/CustomVideoPlayer";

/**
 * Shared by Reels + Success Stories.
 * Opens as a portrait card; user taps expand for fullscreen (CSS portrait — never OS landscape).
 */
export default function PortraitVideoModal({
  open,
  src,
  onClose,
  playerRef,
  playerId,
  onPlay,
  onPause,
}) {
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !src) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center p-4 pb-28 md:pb-4"
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded-lg shadow-2xl w-full max-w-[360px] aspect-[9/16] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-[70] w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white text-3xl font-bold border border-white/30 hover:opacity-80"
          aria-label="Close video"
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
