import React from "react";
import { useNavigate } from "react-router-dom";

const MusicTasteSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black pt-16 xl:px-16 lg:px-10 px-6 mb-16 w-full relative block clear-both">
      <div className="container mx-auto">
        {/* Desktop Layout */}
        <div
          className="hidden md:block relative overflow-hidden bg-gradient-to-r from-pink-500/20 to-blue-900/40 min-h-[500px]"
          style={{
            backgroundImage: "url('/assets/images/musicTasteSectionBg.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          aria-label="Best platform for independent artists 2025"
        >
          <div className="grid md:grid-cols-2 items-center">
            <div className="absolute -z-30 inset-0 bg-gradient-to-r from-pink-500/30 to-blue-500/30" />
            <div className=""></div>
            <div className="p-8 md:p-12">
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-8 lg:mb-4 leading-tight">
                YOUR MUSIC IS YOUR TASTE,
                <span className="text-cyan-600">
                  WE ARE JUST TASTE ENHANCER
                </span>
              </h2>
              <p className="text-gray-300 mb-8 max-w-md">
                Lorem ipsum has been the industry&apos;s standard dummy text
                ever since the 1500s, when an unknown printer took. Standard
                dummy text ever since the 1500s when an unknown printer took.
              </p>
              <button
                onClick={() => navigate("/auth/signup")}
                className="bg-cyan-400 z-50 hover:cursor-pointer text-black font-semibold py-3 px-8 rounded-full hover:font-bold transition delay-300"
              >
                Book Your Spot - Sign Up Now
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Layout — Hard Inline Style Boundary Overrides */}
        <div
          className="md:hidden"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            maxWidth: "340px", // Strict structural constraint
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#0B0D1B",
            borderRadius: "24px",
            overflow: "hidden",
            paddingBottom: "40px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* 1. Integrated Header Visual Block */}
          <div
            style={{
              width: "100%",
              height: "210px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src="/assets/images/musicTasteSectionBg.png"
              alt="Live musical performance stage"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
            {/* Ambient Dark-Gradient Blending */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, #0B0D1B, transparent)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* 2. Text Content Block Container */}
          <div
            style={{
              width: "100%",
              padding: "0 24px",
              boxSizing: "border-box",
            }}
          >
            {/* Main Title Heading */}
            <h2
              className="text-white font-black uppercase"
              style={{
                fontSize: "22px",
                lineHeight: "1.2",
                marginTop: "24px",
                marginBottom: "16px",
              }}
            >
              YOUR MUSIC IS YOUR TASTE,
              <br />
              <span
                style={{
                  color: "#4EC3E0",
                  display: "inline-block",
                  marginTop: "4px",
                }}
              >
                WE ARE JUST TASTE ENHANCER
              </span>
            </h2>

            {/* Subtext Body Paragraph */}
            <p
              className="text-gray-400 font-normal"
              style={{
                fontSize: "13px",
                lineHeight: "1.6",
                maxWidth: "280px",
                margin: "0 auto 32px auto",
                opacity: 0.8,
              }}
            >
              Lorem ipsum has been the industry&apos;s standard dummy text ever
              since the 1500s, when an unknown printer took. Standard dummy text
              ever since the 1500s when an unknown printer took.
            </p>

            {/* Primary Action Button */}
            <button
              onClick={() => navigate("/auth/signup")}
              className="bg-[#4EC3E0] text-black font-extrabold active:scale-95 transition-transform uppercase"
              style={{
                width: "100%",
                maxWidth: "240px",
                padding: "14px 0",
                borderRadius: "9999px",
                fontSize: "12px",
                letterSpacing: "1px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Book Your Spot - Sign Up Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicTasteSection;
