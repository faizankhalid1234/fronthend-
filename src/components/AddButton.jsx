import { HiOutlineShoppingBag } from "react-icons/hi2";

function AddButton({ onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-orange shadow-[0_2px_8px_rgba(26,35,64,0.12)] transition hover:shadow-[0_4px_14px_rgba(249,115,22,0.25)] active:scale-95 ${className}`}
    >
      <HiOutlineShoppingBag className="h-[17px] w-[17px] stroke-[2]" />
      Add
    </button>
  );
}

export default AddButton;
