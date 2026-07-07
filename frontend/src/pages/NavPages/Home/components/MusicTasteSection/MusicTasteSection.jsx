import React from "react";
import { useNavigate } from "react-router-dom";

const MusicTasteSection = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-black pt-[16px] lg:pt-16 pb-[16px] lg:pb-16">
      <div
        className="mx-auto px-[12px] lg:px-8"
        style={{ maxWidth: "135rem" }}
      >
        {/* Desktop Layout */}
        <div
          className="hidden md:block relative overflow-hidden bg-gradient-to-r from-pink-500/20 to-blue-900/40 rounded-2xl"
          style={{
            backgroundImage: "url('/assets/images/musicTasteSectionBg.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            minHeight: "45rem",
          }}
          aria-label="Best platform for independent artists 2025"
        >
          <div className="absolute inset-0 bg-black/10 rounded-2xl" />

          <div
            className="relative grid grid-cols-1 md:grid-cols-12 items-center z-10"
            style={{ minHeight: "35rem" }}
          >
            <div className="hidden md:block md:col-span-6 lg:col-span-7"></div>
            <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-center items-start px-6 sm:px-8 lg:px-12 py-12 lg:py-16 text-left">
              <div className="max-w-md w-full">
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight uppercase tracking-wide">
                  YOUR MUSIC IS YOUR TASTE,
                  <span className="text-cyan-400 block mt-1">
                    WE ARE JUST TASTE ENHANCER
                  </span>
                </h2>
                <p className="text-gray-300 mb-6 text-sm lg:text-base leading-relaxed">
                  Lorem ipsum has been the industry&apos;s standard dummy text
                  ever since the 1500s, when an unknown printer took. Standard
                  dummy text ever since the 1500s when an unknown printer took.
                </p>
                <button
                  onClick={() => navigate("/auth/signup")}
                  className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-3 px-8 rounded-full transition-colors duration-300 w-fit whitespace-nowrap shadow-lg"
                >
                  Book Your Spot - Sign Up Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Fixed with Image Parent Sizing Container */}
        <div className="block md:hidden lg:max-w-md lg:mx-auto w-full px-2">
          <div className="bg-[#0c0d27] rounded-2xl overflow-hidden shadow-xl border border-white/5 flex flex-col">
            {/* Parent Container for Sizing the Image Section */}
            <div className="w-full h-64 overflow-hidden relative bg-black flex items-center justify-center">
              <img
                src="/assets/images/musicTasteSectionBg.png"
                alt="Independent artists platform"
                className="w-full h-full object-center"
              />
            </div>

            {/* Bottom Content Card Area */}
            <div className="flex flex-col items-center justify-center text-center px-6 py-8">
              <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wide leading-tight">
                YOUR MUSIC IS YOUR TASTE,
                <span className="text-cyan-400 block mt-1">
                  WE ARE JUST TASTE ENHANCER
                </span>
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Lorem ipsum has been the industry&apos;s standard dummy text
                ever since the 1500s, when an unknown printer took. Standard
                dummy text ever since the 1500s when an unknown printer took.
              </p>

              <button
                onClick={() => navigate("/auth/signup")}
                className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-3 px-8 rounded-full transition-colors duration-300 w-full max-w-[280px] text-sm shadow-md"
              >
                Book Your Spot - Sign Up Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicTasteSection;
