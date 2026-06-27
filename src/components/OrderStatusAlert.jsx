import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoClose,
  IoTimeOutline,
  IoRestaurantOutline,
} from "react-icons/io5";
import {
  bootstrapOrders,
  getActiveOrderId,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  readOrders,
  subscribeOrdersUpdated,
  normalizePhone,
} from "../services/orderService";
import { formatSAR } from "../context/CartContext";

const PHONE_KEY = "bk_my_orders_phone";

const STATUS_UI = {
  [ORDER_STATUS.APPROVED]: {
    icon: IoCheckmarkCircle,
    header: "Order Approved!",
    tone: "from-emerald-500 to-green-600",
    message:
      "Restaurant ne aapka order approve kar diya hai. Ab aap payment complete kar sakte hain.",
  },
  [ORDER_STATUS.PROCESSING]: {
    icon: IoRestaurantOutline,
    header: "Order Processing",
    tone: "from-sky-500 to-blue-600",
    message: "Admin ne order process kar diya hai — kitchen mein aapka khana tayyar ho raha hai.",
  },
  [ORDER_STATUS.REJECTED]: {
    icon: IoCloseCircle,
    header: "Order Rejected",
    tone: "from-red-500 to-rose-600",
    message:
      "Sorry — restaurant ne order reject kar diya hai. Items abhi available nahi hain.",
  },
  [ORDER_STATUS.PAID]: {
    icon: IoCheckmarkCircle,
    header: "Payment Received",
    tone: "from-navy to-navy-light",
    message: "Payment confirm ho gayi hai. Shukriya!",
  },
  [ORDER_STATUS.PENDING]: {
    icon: IoTimeOutline,
    header: "Order Pending",
    tone: "from-amber-500 to-orange",
    message: "Aapka order abhi restaurant review kar raha hai.",
  },
};

function OrderStatusAlert() {
  const [alert, setAlert] = useState(null);
  const statusMapRef = useRef(new Map());
  const readyRef = useRef(false);
  const queueRef = useRef([]);
  const showingRef = useRef(false);

  const showNext = useCallback(() => {
    if (showingRef.current || !queueRef.current.length) return;
    showingRef.current = true;
    setAlert(queueRef.current.shift());
  }, []);

  const checkStatusUpdates = useCallback(() => {
    if (!readyRef.current) return;

    const activeId = getActiveOrderId();
    const savedPhone = localStorage.getItem(PHONE_KEY) || "";
    const phoneNorm = normalizePhone(savedPhone);

    const relevant = readOrders().filter((order) => {
      if (activeId && order.id === activeId) return true;
      if (phoneNorm && normalizePhone(order.customer?.phone) === phoneNorm) return true;
      return false;
    });

    for (const order of relevant) {
      const prev = statusMapRef.current.get(order.id);
      const next = order.status;

      if (prev && prev !== next) {
        const ui = STATUS_UI[next] || STATUS_UI[ORDER_STATUS.PENDING];
        queueRef.current.push({
          order,
          prevStatus: prev,
          newStatus: next,
          ui,
        });
      }

      statusMapRef.current.set(order.id, next);
    }

    showNext();
  }, [showNext]);

  useEffect(() => {
    bootstrapOrders().then(() => {
      readOrders().forEach((o) => statusMapRef.current.set(o.id, o.status));
      readyRef.current = true;
    });

    return subscribeOrdersUpdated(checkStatusUpdates);
  }, [checkStatusUpdates]);

  const dismiss = () => {
    setAlert(null);
    showingRef.current = false;
    setTimeout(showNext, 300);
  };

  if (!alert) return null;

  const { order, ui, newStatus } = alert;
  const Icon = ui.icon;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="alertdialog"
        aria-labelledby="order-status-title"
        className="max-h-[92vh] w-full max-w-md animate-[fadeSlideIn_0.35s_ease] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className={`bg-gradient-to-r px-4 py-4 text-white sm:px-5 ${ui.tone}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p id="order-status-title" className="text-[17px] font-bold leading-tight">
                  {ui.header}
                </p>
                <p className="mt-0.5 text-[12px] text-white/90">
                  Order {order.id} · {ORDER_STATUS_LABELS[newStatus]}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg p-1 hover:bg-white/15"
              aria-label="Close"
            >
              <IoClose className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="max-h-[50vh] space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
          <p className="text-[13px] leading-relaxed text-navy">{ui.message}</p>

          <div className="rounded-xl bg-[#f8f9fc] px-3 py-2 text-[12px]">
            <span className="font-semibold text-navy">Status: </span>
            <span className="font-bold text-orange">{ORDER_STATUS_LABELS[newStatus]}</span>
          </div>

          {order.adminNote ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
              <span className="font-semibold">Restaurant note:</span> {order.adminNote}
            </p>
          ) : null}

          <ul className="space-y-1.5 rounded-xl border border-gray-border/80 p-3">
            {order.items?.slice(0, 4).map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                className="flex justify-between gap-2 text-[12px]"
              >
                <span className="min-w-0 truncate text-navy">
                  {item.title} ×{item.qty}
                </span>
                <span className="shrink-0 font-semibold text-orange">{item.price}</span>
              </li>
            ))}
            {order.items?.length > 4 ? (
              <li className="text-[11px] text-gray-muted">+{order.items.length - 4} more items</li>
            ) : null}
          </ul>

          <div className="flex items-center justify-between rounded-xl bg-orange-pale px-3 py-2">
            <span className="text-[13px] font-semibold text-navy">Total</span>
            <span className="text-[16px] font-bold text-orange">{formatSAR(order.total)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-border/80 px-4 py-3 sm:flex-row sm:px-5 sm:py-4">
          {newStatus === ORDER_STATUS.APPROVED || newStatus === ORDER_STATUS.PROCESSING ? (
            <button
              type="button"
              onClick={() => {
                dismiss();
                window.dispatchEvent(new CustomEvent("open-checkout-cart"));
              }}
              className="flex-1 rounded-xl bg-orange py-3 text-[13px] font-bold text-white"
            >
              Go to Checkout & Pay
            </button>
          ) : (
            <Link
              to="/my-orders"
              onClick={dismiss}
              className="flex-1 rounded-xl bg-navy py-3 text-center text-[13px] font-bold text-white"
            >
              View My Orders
            </Link>
          )}
          <button
            type="button"
            onClick={dismiss}
            className="rounded-xl border border-gray-border px-4 py-3 text-[13px] font-semibold text-navy"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderStatusAlert;
