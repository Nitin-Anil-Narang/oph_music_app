import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Trophy, Music, BarChart3, Play, Phone } from "lucide-react";
import "./MobileNavbar.css";

export default function MobileNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHomePage = pathname === "/home" || pathname === "/";
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const longPressTimers = useRef({});
  const iconRefs = useRef({});

  const navItems = [
    { icon: Home, path: "/home", label: "Home" },
    { icon: Trophy, path: "/events/online-music-events", label: "Events" },
    { icon: Music, path: "/find-your-collaborator", label: "Artists" },
    { icon: BarChart3, path: "/leaderboard/top-music-networking-platform-for-creators", label: "Leaderboard" },
    { icon: Play, path: "/resources/music-learning-education", label: "Resources" },
    { icon: Phone, path: "/contact", label: "Contact" },
  ];

  const getOriginDomainFromCookie = () => {
    if (typeof document === "undefined") return null;
    const match = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("oph_origin_domain="));
    if (!match) return null;
    return match.split("=")[1] || null;
  };

  const navigateWithOrigin = (path) => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    console.log("[MobileNavbar] navigateWithOrigin called with:", path, "hostname:", hostname);

    if (hostname.includes("ophcommunity.org")) {
      const originDomain = getOriginDomainFromCookie();
      const targetDomain = originDomain ? originDomain.replace(/^www\./, "") : "ophcommunity.com";
      const targetUrl = `${protocol}//${targetDomain}${path}`;
      console.log("[MobileNavbar] org domain redirecting to:", targetUrl);
      window.location.href = targetUrl;
      return;
    }
    console.log("[MobileNavbar] local/SPA navigate calling:", path);
    navigate(path);
  };

  const handleTouchStart = (index) => {
    const iconElement = iconRefs.current[index];
    if (iconElement) {
      const rect = iconElement.getBoundingClientRect();
      setTooltipPosition(rect.left + rect.width / 2);
    }
    longPressTimers.current[index] = setTimeout(() => {
      setActiveTooltip(index);
    }, 500);
  };

  const handleTouchEnd = (index) => {
    if (longPressTimers.current[index]) {
      clearTimeout(longPressTimers.current[index]);
      delete longPressTimers.current[index];
    }
    setActiveTooltip(null);
  };

  const handleTouchCancel = (index) => {
    if (longPressTimers.current[index]) {
      clearTimeout(longPressTimers.current[index]);
      delete longPressTimers.current[index];
    }
    setActiveTooltip(null);
  };

  const containerClass = "mobile-bottom-nav lg:hidden fixed bottom-0 left-0 w-full px-6 py-2 flex justify-center bg-black/40 border-t border-gray-800/80 z-50";

  const innerDivClass = isHomePage
    ? "flex justify-around items-center w-full max-w-md bg-[#13161C] border border-gray-800 rounded-2xl py-4 px-3 shadow-2xl relative z-50"
    : "flex justify-around items-center w-full max-w-md bg-[#13161C] border border-gray-800 rounded-2xl py-3 px-3 shadow-2xl";

  return (
    <div className={containerClass}>
      <div className={innerDivClass}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.path ||
            (item.path === "/home" && pathname === "/") ||
            (item.path !== "/home" && pathname.startsWith(item.path.split("?")[0]));

          return (
            <div
              key={index}
              className="relative flex flex-col items-center"
              ref={(el) => (iconRefs.current[index] = el)}
              onTouchStart={() => handleTouchStart(index)}
              onTouchEnd={() => handleTouchEnd(index)}
              onTouchCancel={() => handleTouchCancel(index)}
            >
              {/* Active text label above the icon */}
              {/* Long-press tooltip - mobile only */}
              {activeTooltip === index && (
                <div className="tooltip-label" style={{ left: `${tooltipPosition}px` }}>
                  {item.label}
                </div>
              )}

              <button
                type="button"
                onClick={() => navigateWithOrigin(item.path)}
                className={`p-2.5 rounded-full cursor-pointer pointer-events-auto transition-all duration-300 ${
                  isActive
                    ? "text-[#5DC9DE] bg-[#5DC9DE]/10 border border-[#5DC9DE]/30 shadow-[0_0_12px_rgba(93,201,222,0.2)]"
                    : "text-gray-400 hover:text-white"
                }`}
                aria-label={item.label}
              >
                <Icon size={20} className={isActive ? "scale-110" : "scale-100"} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
