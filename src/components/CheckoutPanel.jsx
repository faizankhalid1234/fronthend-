import { useState, useRef, useEffect } from "react";
import { IoTimeOutline, IoCloseCircle, IoCheckmarkCircle } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useCart, formatSAR } from "../context/CartContext";
import { PAYMENT_METHODS, getPaymentMethod } from "../data/paymentMethods";
import {
  canPayForOrder,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
} from "../services/orderService";

const DEMO_CUSTOMER = {
  name: "Faizan Khalid",
  phone: "03029655325",
  address: "House 12, Main Boulevard, Riyadh / Lahore",
};

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";

const STATUS_CHIP = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  processing: "bg-sky-100 text-sky-800 border-sky-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  paid: "bg-navy/10 text-navy border-navy/20",
};

function OrderStatusBanner({ order }) {
  if (!order) return null;

  if (order.status === ORDER_STATUS.PENDING) {
    return (
      <div className="mb-4 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-2.5 sm:mb-4 sm:gap-3 sm:p-3">
        <IoTimeOutline className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="text-[13px] font-bold text-amber-800">Waiting for restaurant</p>
          <p className="mt-0.5 text-[12px] text-amber-700">
            Your order {order.id} is sent. Admin will check if items are available.
          </p>
          <a
            href={`${ADMIN_URL}/login`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-[12px] font-bold text-orange underline underline-offset-2"
          >
            Staff? Open Admin Panel →
          </a>
        </div>
      </div>
    );
  }

  if (order.status === ORDER_STATUS.REJECTED) {
    return (
      <div className="mb-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3">
        <IoCloseCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <div>
          <p className="text-[13px] font-bold text-red-700">Out of stock</p>
          <p className="mt-0.5 text-[12px] text-red-600">
            Sorry — the restaurant does not have your items right now.
            {order.adminNote ? ` Note: ${order.adminNote}` : ""}
          </p>
        </div>
      </div>
    );
  }

  if (canPayForOrder(order.status)) {
    return (
      <div className="mb-4 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
        <IoCheckmarkCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <div>
          <p className="text-[13px] font-bold text-green-800">
            {order.status === ORDER_STATUS.PROCESSING
              ? "Order is processing — admin is preparing your food"
              : "Order approved — items are available"}
          </p>
          <p className="mt-0.5 text-[12px] text-green-700">
            Status: {ORDER_STATUS_LABELS[order.status]}. Please complete payment below.
            {order.adminNote ? ` Note: ${order.adminNote}` : ""}
          </p>
        </div>
      </div>
    );
  }

  if (order.status === ORDER_STATUS.PAID) {
    return (
      <div className="mb-4 flex gap-3 rounded-xl border border-navy/20 bg-navy/5 p-3">
        <IoCheckmarkCircle className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
        <div>
          <p className="text-[13px] font-bold text-navy">Payment completed</p>
          <p className="mt-0.5 text-[12px] text-gray-muted">
            Status: {ORDER_STATUS_LABELS.paid}. Your order is confirmed.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

function CheckoutPanel() {
  const { user } = useAuth();
  const {
    subtotal,
    deliveryFee,
    total,
    count,
    items,
    activeOrder,
    submitOrderRequest,
    completeOrderPayment,
    placingOrder,
    clearActiveOrder,
  } = useCart();
  const errorRef = useRef(null);

  const checkoutOrder = activeOrder;
  const hasSubmittedOrder = Boolean(checkoutOrder);
  const canPay = checkoutOrder && canPayForOrder(checkoutOrder.status);
  const isRejected = checkoutOrder?.status === ORDER_STATUS.REJECTED;
  const displayTotal = checkoutOrder?.total ?? total;
  const displayCount = checkoutOrder?.items?.length ?? count;
  const displaySubtotal = checkoutOrder?.subtotal ?? subtotal;
  const displayDelivery = checkoutOrder?.deliveryFee ?? deliveryFee;

  const [name, setName] = useState(
    checkoutOrder?.customer?.name ||
      (user?.name && user.name !== "Guest" ? user.name : DEMO_CUSTOMER.name)
  );
  const [phone, setPhone] = useState(
    checkoutOrder?.customer?.phone || user?.phone || DEMO_CUSTOMER.phone
  );
  const [address, setAddress] = useState(
    checkoutOrder?.customer?.address || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardNumber, setCardNumber] = useState("4111111111111111");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!checkoutOrder) {
      setAddress("");
    }
  }, [checkoutOrder]);

  const needsCard = paymentMethod === "card" || paymentMethod === "mada";

  const fillDemo = () => {
    setName(DEMO_CUSTOMER.name);
    setPhone(DEMO_CUSTOMER.phone);
    setAddress(DEMO_CUSTOMER.address);
    setPaymentMethod("cod");
    setFieldErrors({});
    setError("");
  };

  const showError = (msg, fields = {}) => {
    setError(msg);
    setFieldErrors(fields);
    requestAnimationFrame(() => {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const nextFieldErrors = {};
    if (!name.trim()) nextFieldErrors.name = true;
    if (!phone.trim()) nextFieldErrors.phone = true;
    if (!address.trim()) nextFieldErrors.address = true;

    if (Object.keys(nextFieldErrors).length) {
      showError("Please fill all delivery details marked with *.", nextFieldErrors);
      return;
    }

    try {
      await submitOrderRequest({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
    } catch (err) {
      showError(err.message || "Could not submit order. Please try again.");
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (isRejected) {
      showError("Out of stock — your order was rejected by the restaurant.");
      return;
    }

    if (!canPay) {
      showError("Please wait until the restaurant approves your order.");
      return;
    }

    if (needsCard && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
      showError("Please enter card details for card payment.");
      return;
    }

    try {
      await completeOrderPayment({
        paymentMethod,
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardExpiry,
        cardCvv,
      });
    } catch (err) {
      showError(err.message || "Payment failed. Please try again.");
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-navy outline-none focus:ring-2 focus:ring-orange/15 ${
      fieldErrors[field]
        ? "border-red-400 focus:border-red-400"
        : "border-gray-border focus:border-orange"
    }`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-orange/20 bg-gradient-to-r from-orange-pale to-white px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-muted sm:text-[11px]">
              Order total
            </p>
            <p className="text-[20px] font-bold text-orange sm:text-[22px]">{formatSAR(displayTotal)}</p>
          </div>
          <div className="text-left text-[12px] text-navy sm:text-right">
            <p>{displayCount} item{displayCount !== 1 ? "s" : ""}</p>
            <p className="text-gray-muted">
              {formatSAR(displaySubtotal)} + {formatSAR(displayDelivery)} delivery
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        {hasSubmittedOrder && checkoutOrder && (
          <div className="mb-3 flex justify-center">
            <span
              className={`rounded-full border px-3 py-1 text-[12px] font-bold ${STATUS_CHIP[checkoutOrder.status]}`}
            >
              Order status: {ORDER_STATUS_LABELS[checkoutOrder.status]}
            </span>
          </div>
        )}
        <OrderStatusBanner order={checkoutOrder} />

        {!hasSubmittedOrder && (
          <form id="order-request-form" onSubmit={handleSubmitRequest}>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-[14px] font-bold text-navy">Delivery Details</h3>
              <button
                type="button"
                onClick={fillDemo}
                className="w-full shrink-0 rounded-full bg-navy px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-navy-light sm:w-auto sm:py-1"
              >
                Use demo info
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label htmlFor="checkout-name" className="mb-1 block text-[11px] font-medium text-gray-muted">
                  Full name *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((f) => ({ ...f, name: false }));
                  }}
                  placeholder="e.g. Faizan Khalid"
                  required
                  className={inputClass("name")}
                />
              </div>
              <div>
                <label htmlFor="checkout-phone" className="mb-1 block text-[11px] font-medium text-gray-muted">
                  Phone number *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setFieldErrors((f) => ({ ...f, phone: false }));
                  }}
                  placeholder="e.g. 03029655325"
                  required
                  className={inputClass("phone")}
                />
              </div>
              <div>
                <label htmlFor="checkout-address" className="mb-1 block text-[11px] font-medium text-gray-muted">
                  Delivery address *
                </label>
                <textarea
                  id="checkout-address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setFieldErrors((f) => ({ ...f, address: false }));
                  }}
                  placeholder="Street, area, city"
                  rows={2}
                  required
                  className={`${inputClass("address")} resize-none`}
                />
              </div>
            </div>
          </form>
        )}

        {hasSubmittedOrder && checkoutOrder?.items?.length > 0 && (
          <section className="mb-4">
            <h3 className="text-[14px] font-bold text-navy">Your order</h3>
            <ul className="mt-2 space-y-2">
              {checkoutOrder.items.map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  className="flex flex-col gap-1 rounded-lg border border-gray-border bg-page px-3 py-2 text-[12px] min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between"
                >
                  <span className="min-w-0 break-words text-navy">
                    {item.title} × {item.qty}
                  </span>
                  <span className="shrink-0 font-semibold text-orange">{item.price}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {canPay && (
          <form id="payment-form" onSubmit={handlePayment}>
            <section>
              <h3 className="text-[14px] font-bold text-navy">Payment Method</h3>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                        active
                          ? "border-orange bg-orange-pale ring-1 ring-orange/30"
                          : "border-gray-border bg-white hover:border-orange/30"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${method.bg}`}
                      >
                        <Icon className={`h-4 w-4 ${method.color}`} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-bold text-navy">
                          {method.label}
                        </span>
                      </span>
                      <span
                        className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                          active ? "border-orange bg-orange" : "border-gray-border"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </section>

            {needsCard && (
              <section className="mt-4 rounded-xl border border-gray-border bg-page p-3">
                <p className="mb-2 text-[12px] font-semibold text-navy">Card details (demo)</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card number"
                    className="w-full rounded-lg border border-gray-border bg-white px-3 py-2 text-sm outline-none focus:border-orange"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="rounded-lg border border-gray-border bg-white px-3 py-2 text-sm outline-none focus:border-orange"
                    />
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="CVV"
                      className="rounded-lg border border-gray-border bg-white px-3 py-2 text-sm outline-none focus:border-orange"
                    />
                  </div>
                </div>
              </section>
            )}
          </form>
        )}
      </div>

      <div
        ref={errorRef}
        className="shrink-0 border-t border-gray-border bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(26,35,64,0.06)] sm:px-4 sm:py-4"
      >
        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2.5 text-[12px] font-semibold text-red-600">
            {error}
          </p>
        )}

        {!hasSubmittedOrder ? (
          <button
            type="submit"
            form="order-request-form"
            disabled={placingOrder || items.length === 0}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange py-3 text-[14px] font-bold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition hover:bg-orange-dark disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5 sm:text-[15px]"
          >
            {placingOrder ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending order...
              </>
            ) : (
              <>Submit Order — {formatSAR(total)}</>
            )}
          </button>
        ) : canPay ? (
          <button
            type="submit"
            form="payment-form"
            disabled={placingOrder}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange py-3 text-[14px] font-bold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition hover:bg-orange-dark disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5 sm:text-[15px]"
          >
            {placingOrder ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing payment...
              </>
            ) : (
              <>Pay Now — {formatSAR(displayTotal)}</>
            )}
          </button>
        ) : isRejected ? (
          <button
            type="button"
            onClick={clearActiveOrder}
            className="w-full rounded-xl bg-navy py-3.5 text-[15px] font-bold text-white transition hover:bg-navy-light"
          >
            Start New Order
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-gray-border py-3.5 text-[15px] font-bold text-gray-muted"
          >
            {checkoutOrder?.status === ORDER_STATUS.PENDING
              ? "Waiting for admin approval..."
              : `Status: ${ORDER_STATUS_LABELS[checkoutOrder?.status] || "Updated"}`}
          </button>
        )}

        <p className="mt-2 text-center text-[11px] text-gray-muted">
          {!hasSubmittedOrder
            ? "Order goes to admin first — payment after approval"
            : checkoutOrder?.status === ORDER_STATUS.PENDING
              ? "Status: Pending — waiting for admin to approve, process, or reject"
              : canPay
                ? `Status: ${ORDER_STATUS_LABELS[checkoutOrder.status]} · ${getPaymentMethod(paymentMethod)?.label}`
                : isRejected
                  ? `Status: ${ORDER_STATUS_LABELS.rejected} — items unavailable`
                  : checkoutOrder?.status === ORDER_STATUS.PAID
                    ? `Status: ${ORDER_STATUS_LABELS.paid} — thank you!`
                    : `Status: ${ORDER_STATUS_LABELS[checkoutOrder?.status] || "Updated"}`}
        </p>
        {hasSubmittedOrder && checkoutOrder?.status === ORDER_STATUS.PENDING && (
          <p className="mt-2 text-center">
            <a
              href={`${ADMIN_URL}/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-bold text-orange hover:underline"
            >
              Restaurant staff — open Admin Panel
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default CheckoutPanel;
