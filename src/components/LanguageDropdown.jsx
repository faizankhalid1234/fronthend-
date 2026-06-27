import { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import FlagIcon from "./FlagIcon";

const languages = [
  { code: "en", label: "English", short: "EN" },
  { code: "ar", label: "Arabic", short: "AR" },
];

function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(languages[0]);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-[42px] items-center gap-2.5 rounded-full border border-gray-border bg-white px-3.5 text-sm font-medium text-navy shadow-sm transition hover:border-orange/30 hover:shadow-md"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Language: ${selected.label}`}
      >
        <FlagIcon code={selected.code} className="h-[18px] w-[26px]" />
        <span className="whitespace-nowrap">{selected.label}</span>
        <IoChevronDown
          className={`h-4 w-4 text-gray-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[210px] overflow-hidden rounded-xl border border-gray-border bg-white py-1.5 shadow-lg"
        >
          {languages.map((lang) => {
            const active = selected.code === lang.code;

            return (
              <li key={lang.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setSelected(lang);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition hover:bg-orange-light ${
                    active ? "bg-orange-light text-orange" : "text-navy"
                  }`}
                >
                  <FlagIcon code={lang.code} className="h-[20px] w-[30px]" />
                  <span className="flex-1 text-left">{lang.label}</span>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wide ${
                      active ? "text-orange" : "text-gray-muted"
                    }`}
                  >
                    {lang.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default LanguageDropdown;
