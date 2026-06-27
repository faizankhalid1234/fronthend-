import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTimeOutline,
  IoRestaurantOutline,
  IoReceiptOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  fetchOrdersByPhone,
  setOrderPollPhone,
  subscribeOrdersUpdated,
  bootstrapOrders,
} from "../services/orderService";
import { formatSAR } from "../context/CartContext";

const PHONE_KEY = "bk_my_orders_phone";

const STATUS_CONFIG = {
  pending: {
    style: "bg-amber-100 text-amber-800 border-amber-200",
    icon: IoTimeOutline,
    hint: "Waiting for restaurant to review your order.",
  },
  approved: {
    style: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: IoCheckmarkCircle,
    hint: "Approved — you can complete payment from checkout.",
  },
  processing: {
    style: "bg-sky-100 text-sky-800 border-sky-200",
    icon: IoRestaurantOutline,
    hint: "Kitchen is preparing your food.",
  },
  rejected: {
    style: "bg-red-100 text-red-800 border-red-200",
    icon: IoCloseCircle,
    hint: "Items were not available. Please order something else.",
  },
  paid: {
    style: "bg-navy/10 text-navy border-navy/20",
    icon: IoCheckmarkCircle,
    hint: "Payment received. Thank you for your order!",
  },
};

function OrderCard({ order }) {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-border/80 bg-white shadow-[0_4px_20px_rgba(26,35,64,0.06)]">
      <div className="flex flex-col gap-3 border-b border-gray-border/80 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-navy">{order.id}</p>
          <p className="mt-0.5 text-[12px] text-gray-muted">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase ${config.style}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="space-y-3 px-4 py-4">
        <p className="rounded-xl bg-[#f8f9fc] px-3 py-2 text-[12px] text-gray-muted">{config.hint}</p>

        <div className="rounded-xl bg-[#f8f9fc] p-3 text-[13px]">
          <p className="font-bold text-navy">{order.customer?.name}</p>
          <p className="text-gray-muted">{order.customer?.phone}</p>
          <p className="mt-1 text-[12px] text-gray-muted">{order.customer?.address}</p>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-gray-muted">
            <IoReceiptOutline className="h-4 w-4 text-orange" />
            Items ({order.items?.length || 0})
          </p>
          <ul className="space-y-1.5">
            {order.items?.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                className="flex flex-col gap-1 rounded-lg border border-gray-border/80 px-3 py-2 text-[12px] min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between"
              >
                <span className="min-w-0 break-words text-navy">
                  {item.title} ×{item.qty}
                </span>
                <span className="shrink-0 font-bold text-orange">{item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-2 text-[12px] min-[400px]:grid-cols-3">
          <div className="rounded-xl bg-page px-3 py-2">
            <p className="text-gray-muted">Subtotal</p>
            <p className="font-bold text-navy">{formatSAR(order.subtotal)}</p>
          </div>
          <div className="rounded-xl bg-page px-3 py-2">
            <p className="text-gray-muted">Delivery</p>
            <p className="font-bold text-navy">{formatSAR(order.deliveryFee)}</p>
          </div>
          <div className="rounded-xl bg-orange-pale px-3 py-2">
            <p className="text-gray-muted">Total</p>
            <p className="text-[16px] font-bold text-orange">{formatSAR(order.total)}</p>
          </div>
        </div>

        {order.adminNote ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
            <span className="font-semibold">Restaurant note:</span> {order.adminNote}
          </p>
        ) : null}

        {order.status === ORDER_STATUS.PAID && order.paymentMethod ? (
          <p className="text-center text-[11px] text-gray-muted">
            Paid via {order.paymentMethod.replace(/_/g, " ").toUpperCase()}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function MyOrders() {
  const { user } = useAuth();
  const [phone, setPhone] = useState(
    () => user?.phone || localStorage.getItem(PHONE_KEY) || ""
  );
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async (phoneValue = phone, { silent = false } = {}) => {
    const trimmed = phoneValue.trim();
    if (!trimmed) {
      setError("Please enter your phone number.");
      return;
    }
    if (!silent) setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await fetchOrdersByPhone(trimmed);
      setOrders(data);
      localStorage.setItem(PHONE_KEY, trimmed);
      setOrderPollPhone(trimmed);
    } catch {
      if (!silent) {
        setError("Could not load orders. Make sure backend is running.");
        setOrders([]);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [phone]);

  const phoneRef = useRef(phone);
  phoneRef.current = phone;

  useEffect(() => {
    bootstrapOrders();
    const saved = phoneRef.current.trim();
    if (saved) loadOrders(saved);

    return subscribeOrdersUpdated(() => {
      const current = phoneRef.current.trim();
      if (current) loadOrders(current, { silent: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto min-h-[calc(100vh-90px)] max-w-[800px] px-4 py-8 sm:px-5 sm:py-10">
      <div className="rounded-2xl bg-gradient-to-r from-navy to-navy-light p-5 text-white shadow-lg sm:p-6">
        <h1 className="text-[24px] font-bold sm:text-[28px]">My Orders</h1>
        <p className="mt-2 max-w-xl text-[13px] text-white/85 sm:text-[14px]">
          Enter the phone number you used at checkout. Pending orders refresh every 30 seconds.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          loadOrders();
        }}
        className="mt-5 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
      >
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number e.g. 03029655325"
          className="flex-1 rounded-xl border border-gray-border px-4 py-3 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-orange px-6 py-3 text-[14px] font-bold text-white transition hover:bg-orange-dark disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Loading..." : "View Orders"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
          {error}
        </p>
      )}

      {searched && !loading && orders.length === 0 && !error && (
        <div className="mt-6 rounded-2xl bg-white py-14 text-center shadow-sm">
          <p className="text-4xl">📭</p>
          <p className="mt-3 font-bold text-navy">No orders found</p>
          <p className="mt-1 text-[13px] text-gray-muted">
            Place an order from the{" "}
            <Link to="/menu" className="font-bold text-orange underline">
              menu
            </Link>
            .
          </p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-5 flex items-center justify-between gap-2 text-[12px] text-gray-muted">
          <p>
            {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </p>
          <p className="hidden sm:block">Auto-refresh while pending: every 30 sec</p>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {orders.map((order) => (
          <OrderCard key={`${order.id}-${order.status}-${order.updatedAt}`} order={order} />
        ))}
      </div>
    </div>
  );
}

export default MyOrders;
