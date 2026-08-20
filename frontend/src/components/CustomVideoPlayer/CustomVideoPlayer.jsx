import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactDOM from "react-dom";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { FaBackward, FaForward } from "react-icons/fa";
import { pauseAllAudio } from "../../utils/pauseAllAudio";
import { hideMobileNav, showMobileNav } from "../../utils/hideMobileNav";

const CustomVideoPlayer = forwardRef(
  (
    {
      src,
      poster,
      className = "",
      autoPlay = false,
      onPlay,
      onPause,
      showPlayButtonOverlay = false,
      /** When overlay is shown: "default" uses image asset; "purple" uses branded circular play (signup profile videos). */
      playOverlayVariant = "default",
      onPlayButtonClick,
      pauseOtherVideos = true,
      id,
      allowFullscreen = true,
      /** When true, mobile skips the expand button (modal is already full viewport). */
      immersiveOnMobile = false,
      /** "portrait" locks to portrait in fullscreen; anything else locks to landscape */
      orientation = "landscape",
    },
    ref,
  ) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
    const [isCssFullscreen, setIsCssFullscreen] = useState(false);
    const isFullscreen = isNativeFullscreen || isCssFullscreen;
    const [videoIsLandscape, setVideoIsLandscape] = useState(false);
    const [videoIsPortrait, setVideoIsPortrait] = useState(false);
    const stayPortrait =
      orientation === "portrait" || videoIsPortrait;
    const stayPortraitRef = useRef(stayPortrait);
    stayPortraitRef.current = stayPortrait;

    const isCoarseMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    // Portrait on phones: never show expand — OS fullscreen rotates to landscape on OnePlus/Android.
    const hideExpandButton =
      isCoarseMobile && (immersiveOnMobile || orientation === "portrait");
    const portraitMode = orientation === "portrait" || stayPortrait;
    const portraitModeRef = useRef(portraitMode);
    portraitModeRef.current = portraitMode;

    const exitAnyNativeFullscreen = () => {
      const video = videoRef.current;
      document.exitFullscreen?.().catch(() => {});
      document.webkitExitFullscreen?.();
      document.msExitFullscreen?.();
      video?.webkitExitFullscreen?.();
      try {
        video?.webkitSetPresentationMode?.("inline");
      } catch {
        /* ignore */
      }
    };

    const blockNativeVideoFullscreen = () => {
      if (!portraitModeRef.current) return;
      exitAnyNativeFullscreen();
    };
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef(null);
    const wasPlayingBeforeSeek = useRef(false);
    const [isDragging, setIsDragging] = useState(false);

    // Expose video ref methods
    useImperativeHandle(ref, () => ({
      play: () => videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
      get currentTime() {
        return videoRef.current?.currentTime || 0;
      },
      set currentTime(value) {
        if (videoRef.current) {
          videoRef.current.currentTime = value;
        }
      },
      get paused() {
        return videoRef.current?.paused ?? true;
      },
      videoElement: videoRef.current,
    }));

    // Format time in MM:SS format
    const formatTime = (time) => {
      if (!time || isNaN(time)) return "0:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // Update current time and duration
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const updateTime = () => setCurrentTime(video.currentTime);
      const updateDuration = () => {
        setDuration(video.duration);
        const w = video.videoWidth;
        const h = video.videoHeight;
        const landscape = Number(w) > 0 && Number(h) > 0 && w > h;
        const portrait = Number(w) > 0 && Number(h) > 0 && h > w;
        setVideoIsLandscape(landscape);
        setVideoIsPortrait(portrait);
      };

      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("x5-playsinline", "true");

      video.addEventListener("timeupdate", updateTime);
      video.addEventListener("loadedmetadata", updateDuration);

      return () => {
        video.removeEventListener("timeupdate", updateTime);
        video.removeEventListener("loadedmetadata", updateDuration);
      };
    }, []);

    // Block Android/OnePlus native video fullscreen (always forces landscape).
    useEffect(() => {
      const video = videoRef.current;
      if (!video || !portraitMode) return undefined;

      const blockNative = (e) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        exitAnyNativeFullscreen();
      };

      try {
        video.webkitSetPresentationMode?.("inline");
      } catch {
        /* ignore */
      }

      const noopFs = () => {
        exitAnyNativeFullscreen();
        return Promise.resolve();
      };

      const originals = {};
      [
        "requestFullscreen",
        "webkitRequestFullscreen",
        "webkitRequestFullScreen",
        "mozRequestFullScreen",
        "msRequestFullscreen",
        "webkitEnterFullscreen",
        "webkitEnterFullScreen",
      ].forEach((method) => {
        if (typeof video[method] === "function") {
          originals[method] = video[method];
          video[method] = noopFs;
        }
      });

      video.addEventListener("webkitbeginfullscreen", blockNative, true);
      video.addEventListener("webkitendfullscreen", blockNative, true);
      video.addEventListener("dblclick", blockNative, true);

      return () => {
        Object.entries(originals).forEach(([method, fn]) => {
          video[method] = fn;
        });
        video.removeEventListener("webkitbeginfullscreen", blockNative, true);
        video.removeEventListener("webkitendfullscreen", blockNative, true);
        video.removeEventListener("dblclick", blockNative, true);
      };
    }, [portraitMode]);

    // Handle play/pause
    const togglePlayPause = (e) => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        // Pause all other videos and audio when this video plays
        if (pauseOtherVideos) {
          pauseAllAudio();
          const allVideos = document.querySelectorAll("video");
          allVideos.forEach((v) => {
            if (v !== video && !v.paused) {
              v.pause();
            }
          });
        }

        video
          .play()
          .then(() => {
            setIsPlaying(true);
            onPlay?.();
          })
          .catch((err) => console.error("Video play error:", err));
      } else {
        video.pause();
        setIsPlaying(false);
        onPause?.();
      }
    };

    // Handle 10 seconds backward
    const skipBackward = () => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = Math.max(0, video.currentTime - 10);
    };

    // Handle 10 seconds forward
    const skipForward = () => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
    };

    // Handle progress bar click and drag
    const handleProgressClick = (e) => {
      const video = videoRef.current;
      const progress = progressRef.current;
      if (!video || !progress) return;

      const rect = progress.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      video.currentTime = percent * video.duration;
    };

    const handleProgressMouseDown = (e) => {
      const video = videoRef.current;
      if (!video) return;

      setIsDragging(true);
      wasPlayingBeforeSeek.current = !video.paused;
      console.log('[Drag] Was playing before seek:', wasPlayingBeforeSeek.current);
      if (wasPlayingBeforeSeek.current) {
        video.pause();
      }

      handleProgressClick(e);
    };

    const handleProgressMouseMove = (e) => {
      if (!isDragging) return;
      handleProgressClick(e);
    };

    const handleProgressMouseUp = () => {
      if (!isDragging) return;
      console.log('[Drag] Mouse up, was playing:', wasPlayingBeforeSeek.current);
      setIsDragging(false);

      const video = videoRef.current;
      if (video && wasPlayingBeforeSeek.current) {
        console.log('[Drag] Resuming playback');
        video.play().catch((err) => console.error('[Drag] Play error:', err));
      }
    };

    // Add global mouse event listeners for dragging
    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleProgressMouseMove);
        document.addEventListener('mouseup', handleProgressMouseUp);

        return () => {
          document.removeEventListener('mousemove', handleProgressMouseMove);
          document.removeEventListener('mouseup', handleProgressMouseUp);
        };
      }
    }, [isDragging]);

    // Handle volume change
    const handleVolumeChange = (e) => {
      const video = videoRef.current;
      if (!video) return;
      const newVolume = parseFloat(e.target.value);
      video.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    };

    // Toggle mute
    const toggleMute = () => {
      const video = videoRef.current;
      if (!video) return;
      if (isMuted) {
        video.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        video.volume = 0;
        setIsMuted(true);
      }
    };

    const tryLockOrientation = (mode) => {
      const api = screen.orientation;
      if (!api?.lock) return;
      const primary = mode === "portrait" ? "portrait-primary" : "landscape-primary";
      const fallback = mode === "portrait" ? "portrait" : "landscape";
      api.lock(primary).catch(() => api.lock(fallback).catch(() => {}));
    };

    const tryUnlockOrientation = () => {
      try {
        screen.orientation?.unlock?.();
      } catch {
        /* ignore */
      }
    };

    const enterCssFullscreen = () => {
      setIsCssFullscreen(true);
      document.body.style.overflow = "hidden";
      hideMobileNav();
    };

    const exitCssFullscreen = () => {
      setIsCssFullscreen(false);
      document.body.style.overflow = "";
      showMobileNav();
    };

    const enterNativeFullscreen = (el) => {
      // Never use OS fullscreen for portrait — Android (OnePlus) rotates to landscape.
      if (portraitModeRef.current) {
        enterCssFullscreen();
        return;
      }
      const req =
        el.requestFullscreen?.() ||
        el.webkitRequestFullscreen?.() ||
        el.msRequestFullscreen?.();
      if (req && typeof req.then === "function") {
        req
          .then(() => tryLockOrientation("landscape"))
          .catch((err) => console.error("Fullscreen error:", err));
      }
    };

    const exitNativeFullscreen = () => {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      tryUnlockOrientation();
    };

    /**
     * Portrait videos (stories/reels): CSS overlay only — never OS fullscreen.
     * Landscape videos: native fullscreen with landscape lock.
     */
    const toggleFullscreen = (e) => {
      e?.stopPropagation?.();
      e?.preventDefault?.();
      if (!containerRef.current || hideExpandButton) return;

      if (portraitModeRef.current) {
        if (!isCssFullscreen) enterCssFullscreen();
        else exitCssFullscreen();
        return;
      }

      if (!isFullscreen) {
        enterNativeFullscreen(containerRef.current);
        return;
      }
      if (isCssFullscreen) {
        exitCssFullscreen();
        return;
      }
      exitNativeFullscreen();
    };

    useEffect(() => {
      const onFsChange = () => {
        const fsEl =
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement;

        if (portraitModeRef.current && fsEl) {
          // Kick out of OS fullscreen immediately (causes landscape on OnePlus).
          exitAnyNativeFullscreen();
          setIsNativeFullscreen(false);
          return;
        }

        setIsNativeFullscreen(!!fsEl);
      };

      document.addEventListener("fullscreenchange", onFsChange);
      document.addEventListener("webkitfullscreenchange", onFsChange);
      document.addEventListener("msfullscreenchange", onFsChange);

      const video = videoRef.current;
      if (video) {
        video.addEventListener("fullscreenchange", onFsChange);
        video.addEventListener("webkitbeginfullscreen", blockNativeVideoFullscreen);
      }

      return () => {
        document.removeEventListener("fullscreenchange", onFsChange);
        document.removeEventListener("webkitfullscreenchange", onFsChange);
        document.removeEventListener("msfullscreenchange", onFsChange);
        if (video) {
          video.removeEventListener("fullscreenchange", onFsChange);
          video.removeEventListener(
            "webkitbeginfullscreen",
            blockNativeVideoFullscreen,
          );
        }
      };
    }, [portraitMode]);

    useEffect(() => {
      if (!isCssFullscreen) return undefined;
      const onKey = (event) => {
        if (event.key === "Escape") exitCssFullscreen();
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }, [isCssFullscreen]);

    // Auto-hide controls
    useEffect(() => {
      if (isPlaying) {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);

        return () => {
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
          }
        };
      } else {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      }
    }, [isPlaying]);

    // Reset controls timeout on mouse move
    const resetControlsTimeout = () => {
      if (isPlaying) {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    // Prevent right-click context menu (to prevent download)
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Handle video click to play/pause
    const handleVideoClick = (e) => {
      console.log(e.target);
      console.log(videoRef.current);

      // Don't handle click if it's on the overlay or controls
      if (
        e.target.closest(".absolute.inset-0.flex") ||
        e.target.closest(".absolute.bottom-0")
      ) {
        return;
      }

      togglePlayPause(e);
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    const fullscreenStyle = isCssFullscreen
      ? {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100dvh",
          maxWidth: "none",
          maxHeight: "none",
          zIndex: 2147483646,
          background: "#000",
          transform: "none",
          borderRadius: 0,
        }
      : undefined;

    const playerNode = (
      <div
        ref={containerRef}
        className={`relative group ${className} ${
          isCssFullscreen ? "bg-black flex items-center justify-center oph-portrait-video-fs" : ""
        }`}
        style={fullscreenStyle}
        onMouseMove={resetControlsTimeout}
        onMouseLeave={() => {
          if (isPlaying && controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
            setShowControls(false);
          }
        }}
      >
        <video
          ref={videoRef}
          id={id}
          src={src}
          poster={poster}
          className={`w-full h-full ${
            orientation === "portrait" && videoIsLandscape
              ? "object-cover"
              : "object-contain"
          }`}
          onContextMenu={handleContextMenu}
          onClick={handleVideoClick}
          onPlay={(e) => {
            // Pause all other videos and audio when this video plays
            if (pauseOtherVideos) {
              pauseAllAudio();
              const allVideos = document.querySelectorAll("video");
              allVideos.forEach((v) => {
                if (v !== e.target && !v.paused) {
                  v.pause();
                }
              });
            }
            setIsPlaying(true);
            onPlay?.();
          }}
          onPause={() => {
            setIsPlaying(false);
            onPause?.();
          }}
          onSeeking={(e) => {
            // Only track if not dragging (dragging handles its own state)
            if (!isDragging) {
              wasPlayingBeforeSeek.current = !e.target.paused;
            }
          }}
          onSeeked={(e) => {
            // Only resume if not dragging (dragging handles its own resume)
            if (!isDragging && wasPlayingBeforeSeek.current && e.target.paused) {
              e.target.play().catch(() => {});
            }
          }}
          autoPlay={autoPlay}
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="false"
          disablePictureInPicture
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
        />

        {/* Play Button Overlay (when video is paused) */}
        {showPlayButtonOverlay && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
            <button
              type="button"
              onClick={(e) => {
                togglePlayPause(e);
              }}
              className={`z-30 transition-opacity ${
                playOverlayVariant === "purple"
                  ? "rounded-full bg-[#6F4FA0] p-5 sm:p-6 shadow-lg hover:bg-purple-500 hover:opacity-95"
                  : "hover:opacity-80"
              }`}
              aria-label="Play video"
            >
              {playOverlayVariant === "purple" ? (
                <FaPlay className="w-8 h-8 sm:w-10 sm:h-10 text-white translate-x-0.5" />
              ) : (
                <img
                  src="/assets/images/play_button.png"
                  className="w-[100px] sm:w-[150px]"
                  alt=""
                />
              )}
            </button>
          </div>
        )}

        {/* Custom Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 z-[60] ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="w-full h-3 bg-gray-600 cursor-pointer group/progress relative overflow-hidden"
            onMouseDown={handleProgressMouseDown}
          >
            <div
              className="h-full bg-[#5DC9DE] relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Draggable thumb */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing" />
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
            {/* Left Controls */}
            <div className="flex items-center gap-1 sm:gap-3 flex-wrap sm:flex-nowrap">
              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="text-white hover:text-[#5DC9DE] transition-colors text-sm sm:text-base"
                aria-label={isPlaying ? "Pause" : "Play"}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <FaPause className="text-lg sm:text-xl" />
                ) : (
                  <FaPlay className="text-lg sm:text-xl" />
                )}
              </button>

              {/* 10s Backward */}
              <button
                onClick={skipBackward}
                className="text-white hover:text-[#5DC9DE] transition-colors text-sm sm:text-base"
                aria-label="Skip backward 10 seconds"
                title="Backward 10s"
              >
                <FaBackward className="text-base sm:text-lg" />
              </button>

              {/* 10s Forward */}
              <button
                onClick={skipForward}
                className="text-white hover:text-[#5DC9DE] transition-colors text-sm sm:text-base"
                aria-label="Skip forward 10 seconds"
                title="forward 10s"
              >
                <FaForward className="text-base sm:text-lg" />
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-[#5DC9DE] transition-colors text-sm sm:text-base"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <FaVolumeMute className="text-base sm:text-lg" />
                  ) : (
                    <FaVolumeUp className="text-base sm:text-lg" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-12 sm:w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#5DC9DE]"
                />
              </div>

              {/* Time Display */}
              <span className="text-white text-xs sm:text-sm whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            {allowFullscreen && !hideExpandButton && (
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="text-white hover:text-[#5DC9DE] transition-colors text-sm sm:text-base"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <FaCompress className="text-base sm:text-lg" />
                  ) : (
                    <FaExpand className="text-base sm:text-lg" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    if (isCssFullscreen && typeof document !== "undefined") {
      return ReactDOM.createPortal(playerNode, document.body);
    }

    return playerNode;
  },
);

export default CustomVideoPlayer;
CustomVideoPlayer.displayName = "CustomVideoPlayer";
