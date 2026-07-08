import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import searchIc from "/assets/images/artists/searchIc.svg";
import { ChevronDown } from "lucide-react";

 const btnClass =
   "w-full rounded-3xl border border-white/20 bg-[rgb(52,53,55,0.4)] backdrop-blur-sm py-3 pl-4 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#5DC9DE]/60 cursor-pointer flex items-center justify-between gap-2";

const FilterSelect = ({ value, onChange, options, placeholder, ariaLabel }) => {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const btnRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
    setOpen((o) => !o);
  };

  return (
    <div ref={btnRef} className="relative w-full sm:flex-1 min-w-0">
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={handleOpen}
        className={btnClass}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-white/70" />
      </button>

      {open &&
        ReactDOM.createPortal(
          <ul
            style={dropdownStyle}
            className="max-h-48 overflow-y-auto rounded-xl border border-white/20 bg-gray-900 text-white text-sm shadow-lg"
          >
            <li
              className="px-4 py-2 cursor-pointer hover:bg-white/10"
              onClick={() => { onChange(""); setOpen(false); }}
            >
              {placeholder}
            </li>
            {options.map((opt) => (
              <li
                key={opt}
                className="px-4 py-2 cursor-pointer hover:bg-white/10 truncate"
                onClick={() => { onChange(opt); setOpen(false); }}
              >
                {opt}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};

const HeroSection = ({
  onSearchQueryChange,
  profession,
  location,
  professionOptions = [],
  locationOptions = [],
  onProfessionChange,
  onLocationChange,
}) => {
  const [inputName, setInputName] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearchQueryChange?.(inputName.trim());
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [inputName, onSearchQueryChange]);

  const handleSearchClick = () => {
    onSearchQueryChange?.(inputName.trim());
  };

  return (
    <div className="relative sm:min-h-[70vh] min-h-[40vh] w-full flex flex-col items-center justify-center text-white pt-[100px] sm:pt-[140px]">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 z-10" />
      <div
        className="absolute inset-0 bg-[url('/assets/images/artists/artistHeroBg.png')] bg-cover bg-center"
        style={{ backgroundBlendMode: "overlay" }}
        aria-label="Artists EPK"
      />
      <div className="relative z-20 max-w-5xl w-full text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold">
          FIND YOUR <span className="text-[#5DC9DE]">COLLABORATOR</span>
        </h1>
        <p className="text-gray-300 px-4 sm:text-base lg:text-lg">
          No need to look anywhere else—every music artist you seek is right
          here.
        </p>

        <div className="flex flex-col items-center gap-4 mt-8 px-4 py-8">
          <div className="relative flex w-full max-w-[600px] bg-[rgb(52,53,55,0.4)] rounded-3xl backdrop-blur-md py-2 border border-white/5 shadow-lg">
            <input
              type="text"
              placeholder="Search Artists..."
              value={inputName}
              className="flex-1 px-6 py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none min-w-0"
              onChange={(e) => setInputName(e.target.value)}
            />
            <button
              type="button"
              className="px-4 sm:px-8 py-3 bg-[#5DC9DE] hover:bg-cyan-500 rounded-full flex items-center justify-center transition-colors ml-2 mr-2 min-w-[44px] shrink-0"
              onClick={handleSearchClick}
            >
              <img
                src={searchIc}
                alt="Search Icon"
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              />
              <span className="ml-2 text-gray-800 font-medium hidden sm:inline">
                Search
              </span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row w-full max-w-[600px] gap-3 justify-center">
            <FilterSelect
              value={profession}
              onChange={(v) => onProfessionChange?.(v)}
              options={professionOptions}
              placeholder="All professions"
              ariaLabel="Filter by profession"
            />
            <FilterSelect
              value={location}
              onChange={(v) => onLocationChange?.(v)}
              options={locationOptions}
              placeholder="All locations"
              ariaLabel="Filter by location"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
