import { memo } from "react";
import { useCart } from "../context/CartContext";
import AddButton from "./AddButton";
import DealPoster from "./DealPoster";

function InfoIcon() {
  return (
    <button
      type="button"
      aria-label="More info"
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#8b9cb8] text-[10px] font-bold text-white transition hover:bg-navy-light"
    >
      i
    </button>
  );
}

function DealCard({ deal }) {
  const { openProductModal } = useCart();

  const handleAdd = () => {
    openProductModal({
      id: deal.id,
      type: "deal",
      title: deal.title,
      price: deal.price,
      image: deal.image,
    });
  };

  return (
    <article className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl border border-[#eceef3] bg-white shadow-[0_2px_10px_rgba(26,35,64,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(26,35,64,0.09)]">
      <div className="relative h-[170px] shrink-0 overflow-hidden">
        <DealPoster deal={deal} />
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="flex-1 text-[13px] font-bold leading-[1.35] text-navy line-clamp-2">
            {deal.title}
          </h3>
          <InfoIcon />
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="text-[16px] font-bold text-navy">{deal.price}</p>
          <AddButton onClick={handleAdd} className="px-3 py-1.5 text-[12px]" />
        </div>
      </div>
    </article>
  );
}

export default memo(DealCard);
