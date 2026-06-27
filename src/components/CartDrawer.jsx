import { useEffect } from "react";
import { IoClose, IoTrashOutline, IoArrowBack } from "react-icons/io5";
import { HiMinus, HiPlus } from "react-icons/hi2";
import {
  useCart,
  parsePrice,
  formatSAR,
} from "../context/CartContext";
import FoodImage from "./FoodImage";
import CheckoutPanel from "./CheckoutPanel";
import OrderSuccess from "./OrderSuccess";

const STEPS = [
  { key: "cart", label: "Cart" },
  { key: "checkout", label: "Checkout" },
  { key: "success", label: "Done" },
];

function StepBar({ current }) {
  const idx = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-0.5 border-b border-gray-border bg-page px-3 py-2.5 sm:gap-1 sm:px-5 sm:py-3">
      {STEPS.map((step, i) => {
        const active = i === idx;
        const done = i < idx;
        return (
          <div key={step.key} className="flex min-w-0 flex-1 items-center gap-0.5 sm:gap-1">
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold sm:h-6 sm:w-6 sm:text-[11px] ${
                active
                  ? "bg-orange text-white"
                  : done
                    ? "bg-green-support text-white"
                    : "bg-gray-border text-gray-muted"
              }`}
            >
              {done ? "✓" : i + 1}
            </div>
            <span
              className={`hidden truncate text-[10px] font-semibold min-[380px]:inline sm:text-[11px] ${
                active ? "text-orange" : done ? "text-navy" : "text-gray-muted"
              }`}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`mx-1 h-px flex-1 ${done ? "bg-green-support/40" : "bg-gray-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CartDrawer() {
  const {
    items,
    cartOpen,
    closeCart,
    removeItem,
    updateQty,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    count,
    cartView,
    startCheckout,
    backToCart,
    activeOrder,
  } = useCart();

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
      const onKey = (e) => {
        if (e.key === "Escape") closeCart();
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
    document.body.style.overflow = "";
  }, [cartOpen, closeCart]);

  if (!cartOpen) return null;

  const titles = {
    cart: "Your Cart",
    checkout: "Checkout",
    success: "Order Confirmed",
  };

  return (
    <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={closeCart}
        aria-label="Close cart"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-white shadow-[-8px_0_40px_rgba(26,35,64,0.15)] sm:max-w-[440px]">
        {/* Header — always on top */}
        <div className="shrink-0 border-b border-gray-border bg-white px-3 py-3 sm:px-4 sm:py-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              {cartView === "checkout" && (
                <button
                  type="button"
                  onClick={backToCart}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-input text-navy transition hover:bg-gray-border"
                  aria-label="Back to cart"
                >
                  <IoArrowBack className="h-5 w-5" />
                </button>
              )}
              <div className="min-w-0">
                <h2 className="truncate text-[16px] font-bold text-navy sm:text-[17px]">
                  {titles[cartView]}
                </h2>
                {cartView === "cart" && (
                  <p className="text-[11px] text-gray-muted">
                    {count} item{count !== 1 ? "s" : ""}
                  </p>
                )}
                {cartView === "checkout" && (
                  <p className="text-[11px] text-gray-muted">Complete your order</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-input text-navy transition hover:bg-gray-border"
              aria-label="Close"
            >
              <IoClose className="h-5 w-5" />
            </button>
          </div>
        </div>

        <StepBar current={cartView} />

        {/* Body — fills remaining height */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {cartView === "checkout" && <CheckoutPanel />}

          {cartView === "success" && <OrderSuccess />}

          {cartView === "cart" && (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                {items.length === 0 && !activeOrder ? (
                  <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                    <span className="text-5xl">🛒</span>
                    <p className="mt-4 text-[16px] font-semibold text-navy">Cart is empty</p>
                    <p className="mt-1 text-sm text-gray-muted">
                      Add items from the menu to get started
                    </p>
                    <button
                      type="button"
                      onClick={closeCart}
                      className="mt-6 rounded-full bg-orange px-6 py-2.5 text-sm font-bold text-white"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : items.length === 0 && activeOrder ? (
                  <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                    <span className="text-4xl">⏳</span>
                    <p className="mt-4 text-[16px] font-semibold text-navy">Order in progress</p>
                    <p className="mt-1 text-sm text-gray-muted">
                      {activeOrder.id} — waiting for restaurant or payment
                    </p>
                    <button
                      type="button"
                      onClick={startCheckout}
                      className="mt-6 rounded-full bg-orange px-6 py-2.5 text-sm font-bold text-white"
                    >
                      Continue Checkout
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {items.map((item) => {
                      const lineTotal = parsePrice(item.price) * item.qty;
                      return (
                        <li
                          key={`${item.type}-${item.id}`}
                          className="flex gap-3 rounded-xl border border-gray-border bg-page p-3"
                        >
                          <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-lg">
                            <FoodImage src={item.image} alt={item.title} className="h-full w-full" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-[13px] font-bold leading-snug text-navy line-clamp-2">
                                {item.title}
                              </h3>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id, item.type)}
                                className="shrink-0 text-gray-muted transition hover:text-red-500"
                                aria-label="Remove item"
                              >
                                <IoTrashOutline className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="mt-0.5 text-[13px] font-semibold text-orange">
                              {formatSAR(lineTotal)}
                            </p>
                            {item.note && (
                              <p className="mt-1 text-[11px] text-gray-muted line-clamp-1">
                                Note: {item.note}
                              </p>
                            )}
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQty(item.id, item.type, item.qty - 1)}
                                disabled={item.qty <= 1}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-orange text-orange disabled:opacity-40"
                                aria-label="Decrease quantity"
                              >
                                <HiMinus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-[20px] text-center text-sm font-bold text-navy">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.id, item.type, item.qty + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-orange text-orange"
                                aria-label="Increase quantity"
                              >
                                <HiPlus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {(items.length > 0 || activeOrder) && (
                <div className="shrink-0 border-t border-gray-border bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-4">
                  <div className="mb-2 flex items-center justify-between text-[13px] text-navy">
                    <span>Subtotal</span>
                    <span>{formatSAR(activeOrder?.subtotal ?? subtotal)}</span>
                  </div>
                  <div className="mb-3 flex items-center justify-between text-[13px] text-gray-muted">
                    <span>Delivery fee</span>
                    <span>{formatSAR(activeOrder?.deliveryFee ?? deliveryFee)}</span>
                  </div>
                  <div className="mb-4 flex items-center justify-between rounded-xl bg-orange-pale px-3 py-2.5">
                    <span className="text-[14px] font-semibold text-navy">Total</span>
                    <span className="text-[18px] font-bold text-orange">
                      {formatSAR(activeOrder?.total ?? total)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={startCheckout}
                    className="w-full rounded-xl bg-orange py-3.5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition hover:bg-orange-dark"
                  >
                    {items.length > 0 ? "Proceed to Checkout" : "Continue Checkout"}
                  </button>
                  {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="mt-2 w-full py-2 text-center text-[13px] font-medium text-gray-muted transition hover:text-red-500"
                  >
                    Clear cart
                  </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

export default CartDrawer;
