import { memo } from "react";
import FoodImage from "./FoodImage";

function MenuCategoryStrip({ categories, activeId, onSelect, disabled = false }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2.5 md:gap-3">
        {categories.map((cat) => {
          const active = cat.id === activeId;

          return (
            <button
              key={cat.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(cat.id)}
              className={`flex w-[100px] shrink-0 flex-col items-center rounded-xl px-1.5 py-2.5 transition md:w-[108px] ${
                disabled ? "cursor-wait opacity-70" : ""
              } ${
                active
                  ? "border-2 border-orange bg-orange-pale shadow-sm"
                  : "border border-transparent bg-white shadow-[0_2px_8px_rgba(26,35,64,0.05)] hover:-translate-y-0.5"
              }`}
            >
              <div className="mb-1.5 h-[60px] w-[60px] overflow-hidden rounded-lg md:h-[64px] md:w-[64px]">
                <FoodImage
                  src={cat.image}
                  alt={cat.title}
                  className="h-full w-full"
                  loading={active ? "eager" : "lazy"}
                />
              </div>
              <p className="text-center text-[9px] font-bold leading-tight tracking-wide text-navy md:text-[10px]">
                {cat.title}
              </p>
              {cat.arabicTitle && (
                <p className="mt-0.5 text-center text-[8px] text-gray-muted line-clamp-1">
                  ({cat.arabicTitle})
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(MenuCategoryStrip);
