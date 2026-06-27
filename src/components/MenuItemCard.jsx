import { memo } from "react";
import { useCart } from "../context/CartContext";
import AddButton from "./AddButton";
import FoodImage from "./FoodImage";

function InfoIcon() {
  return (
    <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full bg-[#8b9cb8] text-[9px] font-bold text-white">
      i
    </span>
  );
}

function MenuItemCard({ item }) {
  const { openProductModal } = useCart();

  const handleAdd = () => {
    openProductModal({
      id: item.id,
      type: "menu-item",
      title: item.title,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <article className="flex overflow-hidden rounded-xl border border-[#eceef3] bg-white shadow-[0_2px_8px_rgba(26,35,64,0.05)] transition hover:shadow-[0_3px_14px_rgba(26,35,64,0.08)]">
      <div className="h-[96px] w-[96px] shrink-0 sm:h-[104px] sm:w-[104px]">
        <FoodImage src={item.image} alt={item.title} className="h-full w-full" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-2.5 sm:p-3">
        <div>
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="text-[12px] font-bold uppercase leading-snug tracking-wide text-navy sm:text-[13px]">
              {item.title}
            </h3>
            <InfoIcon />
          </div>
          {item.arabicTitle && (
            <p className="mt-0.5 text-[11px] font-medium leading-snug text-navy/80 line-clamp-1">
              {item.arabicTitle}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between pt-1.5">
          <p className="text-[14px] font-bold text-navy sm:text-[15px]">
            {item.price}
          </p>
          <AddButton onClick={handleAdd} className="px-2.5 py-1 text-[11px]" />
        </div>
      </div>
    </article>
  );
}

export default memo(MenuItemCard);
