import { useEffect, useState } from "react";
import { IoClose, IoInformationCircleOutline } from "react-icons/io5";
import FoodImage from "./FoodImage";
import { HiMinus, HiPlus } from "react-icons/hi2";
import {
  useCart,
  parsePrice,
  formatSAR,
} from "../context/CartContext";

function ProductModal() {
  const { modalProduct, closeProductModal, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (modalProduct) {
      setQuantity(1);
      setNote("");
      document.body.style.overflow = "hidden";

      const onKeyDown = (e) => {
        if (e.key === "Escape") closeProductModal();
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKeyDown);
      };
    }
    document.body.style.overflow = "";
  }, [modalProduct, closeProductModal]);

  if (!modalProduct) return null;

  const unitPrice = parsePrice(modalProduct.price);
  const lineTotal = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      id: modalProduct.id,
      type: modalProduct.type,
      title: modalProduct.title,
      price: modalProduct.price,
      image: modalProduct.image,
      qty: quantity,
      note: note.trim(),
    });
    closeProductModal();
  };

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => q + 1);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={closeProductModal}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="relative w-full max-w-[520px] rounded-[18px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        {/* Close */}
        <button
          type="button"
          onClick={closeProductModal}
          className="absolute -right-2 -top-2 z-10 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#e53935] text-white shadow-lg transition hover:bg-[#c62828] active:scale-95"
          aria-label="Close"
        >
          <IoClose className="h-[22px] w-[22px]" />
        </button>

        <div className="p-6 pt-7">
          {/* Product header */}
          <div className="flex gap-4">
            <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl border border-gray-border bg-gray-input">
              <FoodImage
                src={modalProduct.image}
                alt={modalProduct.title}
                className="h-full w-full"
                loading="eager"
              />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-start gap-1.5">
                <h2
                  id="product-modal-title"
                  className="flex-1 text-[17px] font-bold leading-snug text-navy"
                >
                  {modalProduct.title}
                </h2>
                <IoInformationCircleOutline className="mt-0.5 h-[22px] w-[22px] shrink-0 text-[#8b9cb8]" />
              </div>
              <p className="mt-2 text-[20px] font-bold text-navy">
                {modalProduct.price}
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-[15px] font-semibold text-navy">Quantity:</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={decrease}
                disabled={quantity <= 1}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full border-2 border-orange text-orange transition hover:bg-orange-light disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <HiMinus className="h-4 w-4 stroke-[2.5]" />
              </button>
              <span className="min-w-[24px] text-center text-[18px] font-bold text-navy">
                {quantity}
              </span>
              <button
                type="button"
                onClick={increase}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full border-2 border-orange text-orange transition hover:bg-orange-light active:scale-95"
                aria-label="Increase quantity"
              >
                <HiPlus className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Special instructions */}
          <div className="mt-6">
            <label
              htmlFor="special-instructions"
              className="mb-2 block text-[15px] font-semibold text-navy"
            >
              Special Instructions
            </label>
            <textarea
              id="special-instructions"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note (extra mayo, cheese, etc.)"
              className="w-full resize-none rounded-xl border border-gray-border bg-white px-4 py-3 text-sm text-navy placeholder:text-gray-muted outline-none transition focus:border-orange/40 focus:ring-2 focus:ring-orange/15"
            />
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-orange py-4 text-[16px] font-bold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition hover:bg-orange-dark hover:shadow-[0_6px_20px_rgba(249,115,22,0.45)] active:scale-[0.99]"
          >
            Add to Cart - {formatSAR(lineTotal)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
