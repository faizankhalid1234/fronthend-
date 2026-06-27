import { memo } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useCart } from "../context/CartContext";
import AddButton from "./AddButton";
import FoodImage from "./FoodImage";

function FoodCard({ item }) {
  const { openProductModal } = useCart();

  const handleAdd = () => {
    openProductModal({
      id: item.id,
      type: "menu",
      title: item.title,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <article className="group flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl border border-[#eceef3] bg-white shadow-[0_2px_10px_rgba(26,35,64,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(26,35,64,0.09)]">
      <div className="relative h-[155px] shrink-0 overflow-hidden">
        <FoodImage
          src={item.image}
          alt={item.title}
          className="transition duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[14px] font-bold leading-snug text-navy">
              {item.title}
            </h3>
            <p className="mt-0.5 truncate text-[11px] font-medium text-gray-muted">
              {item.arabicTitle}
            </p>
          </div>
          <button
            type="button"
            aria-label="More info"
            className="mt-0.5 shrink-0 text-[#8b9cb8] transition hover:text-navy"
          >
            <IoInformationCircleOutline className="h-[18px] w-[18px]" />
          </button>
        </div>

        <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-gray-muted">
          {item.description}
        </p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="text-[16px] font-bold text-navy">{item.price}</p>
          <AddButton onClick={handleAdd} className="px-3 py-1.5 text-[12px]" />
        </div>
      </div>
    </article>
  );
}

export default memo(FoodCard);
