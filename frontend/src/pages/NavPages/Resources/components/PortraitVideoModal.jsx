import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import CustomVideoPlayer from "../../../../components/CustomVideoPlayer/CustomVideoPlayer";
import { hideMobileNav, showMobileNav } from "../../../../utils/hideMobileNav";

/** Same popup used by Reels and Success Stories — mobile opens full-viewport portrait (no OS landscape player). */
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
    hideMobileNav();
    document.body.style.overflow = "hidden";
    return () => {
      showMobileNav();
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !src) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[120] bg-black flex items-center justify-center"
      onClick={onClose}
    >
      {/* Mobile: full viewport portrait frame. Desktop: centered 9:16 card. */}
      <div
        className="relative bg-black w-full h-[100dvh] max-h-[100dvh] landscape:max-w-[56.25dvh] landscape:w-full landscape:mx-auto md:h-auto md:max-w-[360px] md:aspect-[9/16] md:rounded-lg md:shadow-2xl md:mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-[70] w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white text-3xl font-bold border border-white/30"
          aria-label="Close video"
        >
          &times;
        </button>
        <div className="relative w-full h-full min-h-0">
          <CustomVideoPlayer
            ref={playerRef}
            id={playerId}
            src={src}
            className="w-full h-full md:rounded-lg"
            autoPlay
            orientation="portrait"
            immersiveOnMobile
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
