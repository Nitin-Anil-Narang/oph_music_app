import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { ChevronDown } from "lucide-react";

const btnClass =
  "w-full rounded-full border border-gray-700 bg-gray-800/50 p-3 text-white focus:outline-none focus:border-cyan-400 cursor-pointer flex items-center justify-between gap-2";

const FilterSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const btnRef = useRef(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();

      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        maxWidth: "calc(100vw - 32px)",
        zIndex: 9999,
      });
    }

    setOpen((prev) => !prev);
  };

  return (
    <div ref={btnRef} className="relative w-full">
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={handleOpen}
        className={btnClass}
      >
        <span className="truncate text-left">{value || placeholder}</span>

        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        ReactDOM.createPortal(
          <ul
            ref={dropdownRef}
            style={dropdownStyle}
            className="max-h-60 overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 text-white shadow-lg"
          >
            <li
              className="px-4 py-3 cursor-pointer hover:bg-white/10"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              {placeholder}
            </li>

            {options.map((opt) => {
              const option =
                typeof opt === "string" ? { value: opt, label: opt } : opt;

              return (
                <li
                  key={option.value}
                  className={`px-4 py-3 cursor-pointer hover:bg-white/10 truncate ${
                    value === option.label ? "bg-white/10" : ""
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
};

export default FilterSelect;
