import { memo } from "react";
import { Link } from "react-router-dom";
import FoodImage from "./FoodImage";

function CategoryCard({ category }) {
  return (
    <Link
      to="/menu"
      className="group flex h-[128px] w-full flex-col items-center justify-center rounded-xl border border-gray-border bg-white px-2 py-3 shadow-[0_2px_8px_rgba(26,35,64,0.04)] transition hover:-translate-y-0.5 hover:border-orange/20 hover:shadow-[0_6px_16px_rgba(26,35,64,0.08)]"
    >
      <div className="mb-2 h-[68px] w-[68px] overflow-hidden rounded-xl">
        <FoodImage
          src={category.image}
          alt={category.title}
          className="transition duration-200 group-hover:scale-105"
        />
      </div>
      <h3 className="text-center text-[10px] font-bold leading-tight tracking-wide text-navy">
        {category.title}
      </h3>
      <p className="mt-0.5 text-center text-[9px] font-medium text-gray-muted line-clamp-1">
        {category.arabicTitle}
      </p>
    </Link>
  );
}

export default memo(CategoryCard);
