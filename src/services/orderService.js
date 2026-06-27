const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const ACTIVE_ORDER_KEY = "bk_active_order";
const ORDERS_API = `${API_URL}/api/orders`;
export const ORDER_POLL_MS = 30000;

export const ORDER_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  PROCESSING: "processing",
  REJECTED: "rejected",
  PAID: "paid",
};

export const ORDER_STATUS_LABELS = {
  pending: "Pending review",
  approved: "Approved",
  processing: "Processing",
  rejected: "Rejected",
  paid: "Paid",
};

export function canPayForOrder(status) {
  return status === ORDER_STATUS.APPROVED || status === ORDER_STATUS.PROCESSING;
}

let ordersCache = null;
let bootstrapPromise = null;
let pollTimer = null;
let pollListenerCount = 0;
let pollPhone = null;
let pollInFlight = false;

function notifyOrdersUpdated() {
  window.dispatchEvent(new CustomEvent("orders-updated"));
}

function normalizePhone(phone = "") {
  return String(phone).replace(/\D/g, "");
}

function orderFingerprint(order) {
  return `${order.status}|${order.updatedAt}|${order.adminNote || ""}`;
}

function ordersChanged(current, fresh) {
  if (current.length !== fresh.length) return true;
  const freshMap = new Map(fresh.map((o) => [o.id, orderFingerprint(o)]));
  return current.some((o) => freshMap.get(o.id) !== orderFingerprint(o));
}

function mergeOrdersIntoCache(freshList) {
  const map = new Map(readOrders().map((o) => [o.id, o]));
  for (const order of freshList) {
    map.set(order.id, order);
  }
  ordersCache = [...map.values()].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

function customerNeedsPolling() {
  const activeId = getActiveOrderId();
  if (activeId) {
    const order = getOrderById(activeId);
    if (!order || order.status === ORDER_STATUS.PENDING) return true;
  }

  if (pollPhone?.trim()) {
    const phoneNorm = normalizePhone(pollPhone);
    return readOrders().some(
      (o) =>
        normalizePhone(o.customer?.phone) === phoneNorm &&
        o.status === ORDER_STATUS.PENDING
    );
  }

  return false;
}

function syncPollTimer() {
  if (pollListenerCount <= 0) {
    stopOrderPolling();
    return;
  }
  if (customerNeedsPolling()) {
    startOrderPolling();
  } else {
    stopOrderPolling();
  }
}

async function fetchOrderByIdFromApi(id) {
  const res = await fetch(`${ORDERS_API}/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

async function fetchOrdersByPhoneFromApi(phone) {
  const res = await fetch(`${ORDERS_API}?phone=${encodeURIComponent(phone)}`);
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

async function postOrderToApi(order) {
  const res = await fetch(ORDERS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

async function patchOrderToApi(id, patch) {
  const res = await fetch(`${ORDERS_API}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update order");
  const data = await res.json();
  return data.order || data;
}

async function runOrderPoll() {
  if (pollInFlight) return;
  if (!customerNeedsPolling()) {
    syncPollTimer();
    return;
  }

  pollInFlight = true;

  try {
    const targets = [];
    const activeId = getActiveOrderId();
    if (activeId) {
      const cached = getOrderById(activeId);
      if (!cached || cached.status === ORDER_STATUS.PENDING) {
        targets.push(fetchOrderByIdFromApi(activeId).catch(() => null));
      }
    }
    if (pollPhone?.trim()) {
      const phoneNorm = normalizePhone(pollPhone);
      const hasPending = readOrders().some(
        (o) =>
          normalizePhone(o.customer?.phone) === phoneNorm &&
          o.status === ORDER_STATUS.PENDING
      );
      if (hasPending || !readOrders().length) {
        targets.push(fetchOrdersByPhoneFromApi(pollPhone.trim()).catch(() => []));
      }
    }

    if (!targets.length) {
      syncPollTimer();
      return;
    }

    const results = await Promise.all(targets);
    const freshList = results.flatMap((r) => (Array.isArray(r) ? r : r ? [r] : []));
    if (!freshList.length) return;

    const current = readOrders();
    if (ordersChanged(current, freshList)) {
      mergeOrdersIntoCache(freshList);
      notifyOrdersUpdated();
    }
  } catch {
    /* API not ready */
  } finally {
    pollInFlight = false;
    syncPollTimer();
  }
}

function startOrderPolling() {
  if (pollTimer) return;
  pollTimer = setInterval(runOrderPoll, ORDER_POLL_MS);
  document.addEventListener("visibilitychange", onVisibilityChange);
}

function stopOrderPolling() {
  if (!pollTimer) return;
  clearInterval(pollTimer);
  pollTimer = null;
  document.removeEventListener("visibilitychange", onVisibilityChange);
}

function onVisibilityChange() {
  if (document.visibilityState === "visible" && customerNeedsPolling()) {
    runOrderPoll();
  }
}

export function setOrderPollPhone(phone) {
  pollPhone = phone?.trim() || null;
  syncPollTimer();
  if (customerNeedsPolling()) runOrderPoll();
}

export function clearOrderPollPhone() {
  pollPhone = null;
  syncPollTimer();
}

export async function bootstrapOrders() {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    try {
      const activeId = getActiveOrderId();
      if (activeId) {
        const order = await fetchOrderByIdFromApi(activeId);
        ordersCache = [order];
      } else {
        ordersCache = [];
      }
      notifyOrdersUpdated();
      syncPollTimer();
      return ordersCache;
    } catch {
      ordersCache = [];
      return ordersCache;
    }
  })();

  return bootstrapPromise;
}

export function readOrders() {
  return ordersCache || [];
}

export function getOrderById(id) {
  return readOrders().find((o) => o.id === id) || null;
}

export function saveOrder(order) {
  ordersCache = [order, ...readOrders().filter((o) => o.id !== order.id)];
  notifyOrdersUpdated();
  syncPollTimer();
  postOrderToApi(order)
    .then((saved) => {
      mergeOrdersIntoCache([saved]);
      notifyOrdersUpdated();
      syncPollTimer();
    })
    .catch(() => {});
  return order;
}

export function updateOrder(id, patch) {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  const updated = {
    ...orders[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  orders[idx] = updated;
  ordersCache = [...orders];
  notifyOrdersUpdated();
  syncPollTimer();
  patchOrderToApi(id, patch)
    .then((saved) => {
      mergeOrdersIntoCache([saved]);
      notifyOrdersUpdated();
      syncPollTimer();
    })
    .catch(() => {});
  return updated;
}

export function updateOrderStatus(id, status, adminNote = "") {
  return updateOrder(id, {
    status,
    adminNote,
    statusUpdatedAt: new Date().toISOString(),
  });
}

export function setActiveOrderId(id) {
  if (id) {
    sessionStorage.setItem(ACTIVE_ORDER_KEY, id);
  } else {
    sessionStorage.removeItem(ACTIVE_ORDER_KEY);
  }
  syncPollTimer();
  if (customerNeedsPolling()) runOrderPoll();
}

export function getActiveOrderId() {
  return sessionStorage.getItem(ACTIVE_ORDER_KEY);
}

export function createOrderRequest({ items, subtotal, deliveryFee, customer }) {
  return {
    id: `BKH-${Date.now().toString(36).toUpperCase()}`,
    items: items.map((i) => ({
      id: i.id,
      type: i.type,
      title: i.title,
      price: i.price,
      qty: i.qty,
      note: i.note || "",
      image: i.image,
    })),
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    customer,
    paymentMethod: null,
    paymentMeta: {},
    status: ORDER_STATUS.PENDING,
    adminNote: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function finalizeOrderPayment(order, { paymentMethod, paymentMeta = {} }) {
  return {
    ...order,
    paymentMethod,
    paymentMeta,
    status: ORDER_STATUS.PAID,
    paidAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/** Demo payment — simulates API delay */
export async function processPayment(paymentMethodId, _meta = {}) {
  const delay = paymentMethodId === "cod" ? 400 : 1400;
  await new Promise((r) => setTimeout(r, delay));

  if (paymentMethodId === "card" || paymentMethodId === "mada") {
    return { success: true, transactionId: `TXN-${Date.now().toString(36).toUpperCase()}` };
  }

  if (
    ["stc_pay", "apple_pay", "google_pay", "jazzcash"].includes(paymentMethodId)
  ) {
    return { success: true, transactionId: `WLT-${Date.now().toString(36).toUpperCase()}` };
  }

  return { success: true, transactionId: null };
}

export async function fetchOrdersByPhone(phone) {
  const data = await fetchOrdersByPhoneFromApi(phone);
  mergeOrdersIntoCache(data);
  notifyOrdersUpdated();
  syncPollTimer();
  return data;
}

export function subscribeOrdersUpdated(handler) {
  const onCustom = () => handler();
  window.addEventListener("orders-updated", onCustom);

  pollListenerCount += 1;
  syncPollTimer();
  if (customerNeedsPolling()) runOrderPoll();

  return () => {
    window.removeEventListener("orders-updated", onCustom);
    pollListenerCount -= 1;
    syncPollTimer();
  };
}

export { normalizePhone };

export async function refreshOrdersNow() {
  if (customerNeedsPolling()) await runOrderPoll();
}
