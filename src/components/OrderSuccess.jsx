import { IoCheckmarkCircle } from "react-icons/io5";
import { useCart, formatSAR } from "../context/CartContext";
import { getPaymentMethod } from "../data/paymentMethods";

function OrderSuccess() {
  const { lastOrder, closeCart } = useCart();

  if (!lastOrder) return null;

  const payment = getPaymentMethod(lastOrder.paymentMethod);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="shrink-0 bg-gradient-to-b from-green-support/10 to-white px-4 py-8 text-center">
        <IoCheckmarkCircle className="mx-auto h-16 w-16 text-green-support" />
        <h2 className="mt-3 text-[20px] font-bold text-navy">Order Placed!</h2>
        <p className="mt-1 text-[13px] text-gray-muted">
          Thank you — your order is confirmed.
        </p>
      </div>

      <div className="flex-1 px-4 pb-4">
        <div className="rounded-xl border border-gray-border bg-page p-4 text-[13px]">
          <div className="flex justify-between gap-2">
            <span className="text-gray-muted">Order ID</span>
            <span className="font-bold text-navy">{lastOrder.id}</span>
          </div>
          <div className="mt-2.5 flex justify-between gap-2">
            <span className="text-gray-muted">Total paid</span>
            <span className="font-bold text-orange">{formatSAR(lastOrder.total)}</span>
          </div>
          <div className="mt-2.5 flex justify-between gap-2">
            <span className="text-gray-muted">Payment</span>
            <span className="font-semibold text-navy">{payment?.label}</span>
          </div>
          <div className="mt-2.5 flex justify-between gap-2">
            <span className="text-gray-muted">Items</span>
            <span className="font-semibold text-navy">{lastOrder.items.length}</span>
          </div>
          {lastOrder.paymentMeta?.transactionId && (
            <div className="mt-2.5 flex justify-between gap-2">
              <span className="text-gray-muted">Transaction</span>
              <span className="font-mono text-[10px] text-navy">
                {lastOrder.paymentMeta.transactionId}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-xl border border-gray-border bg-white p-4 text-left text-[12px] leading-relaxed text-gray-muted">
          <p className="font-semibold text-navy">Delivery to:</p>
          <p className="mt-1">{lastOrder.customer.address}</p>
          <p className="mt-2">
            We will contact you at{" "}
            <span className="font-semibold text-navy">{lastOrder.customer.phone}</span>
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-border px-4 py-4">
        <button
          type="button"
          onClick={closeCart}
          className="w-full rounded-xl bg-navy py-3.5 text-[15px] font-bold text-white transition hover:bg-navy-light"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
