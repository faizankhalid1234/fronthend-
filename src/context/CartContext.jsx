import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { getDeliveryFee, subscribeSiteUpdated } from "../services/siteStore";
import {
  createOrderRequest,
  saveOrder,
  processPayment,
  getOrderById,
  getActiveOrderId,
  setActiveOrderId,
  updateOrder,
  finalizeOrderPayment,
  canPayForOrder,
  ORDER_STATUS,
  subscribeOrdersUpdated,
  setOrderPollPhone,
} from "../services/orderService";

const CartContext = createContext(null);

export function parsePrice(price) {
  return parseFloat(String(price).replace(/[^\d.]/g, "")) || 0;
}

export function formatSAR(amount) {
  return `${amount.toFixed(2)} SAR`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartView, setCartView] = useState("cart");
  const [lastOrder, setLastOrder] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [deliveryFeeRate, setDeliveryFeeRate] = useState(() => getDeliveryFee());

  useEffect(() => subscribeSiteUpdated(() => setDeliveryFeeRate(getDeliveryFee())), []);

  const refreshActiveOrder = useCallback(() => {
    const id = getActiveOrderId();
    if (!id) {
      setActiveOrder(null);
      return null;
    }
    const order = getOrderById(id);
    if (!order) {
      setActiveOrderId(null);
      setActiveOrder(null);
      return null;
    }
    setActiveOrder(order);
    return order;
  }, []);

  useEffect(() => {
    refreshActiveOrder();
    return subscribeOrdersUpdated(refreshActiveOrder);
  }, [refreshActiveOrder]);

  useEffect(() => {
    const openCheckout = () => {
      setCartOpen(true);
      setCartView("checkout");
    };
    window.addEventListener("open-checkout-cart", openCheckout);
    return () => window.removeEventListener("open-checkout-cart", openCheckout);
  }, []);

  const openProductModal = useCallback((product) => {
    setModalProduct(product);
  }, []);

  const closeProductModal = useCallback(() => {
    setModalProduct(null);
  }, []);

  const openCart = useCallback(() => {
    setCartOpen(true);
    setCartView((v) => (v === "success" ? "cart" : v));
  }, []);

  const closeCart = useCallback(() => {
    setCartOpen(false);
    setTimeout(() => {
      setCartView((v) => (v === "success" ? "cart" : v));
      setLastOrder(null);
    }, 300);
  }, []);

  const startCheckout = useCallback(() => {
    if (!items.length && !activeOrder) return;
    setCartView("checkout");
  }, [items.length, activeOrder]);

  const backToCart = useCallback(() => setCartView("cart"), []);

  const addItem = useCallback(({ qty = 1, note = "", ...item }) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.type === item.type
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, qty: i.qty + qty, note: note || i.note }
            : i
        );
      }
      return [...prev, { ...item, qty, note }];
    });
    setCartOpen(true);
    setCartView("cart");
  }, []);

  const removeItem = useCallback((id, type) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  }, []);

  const updateQty = useCallback((id, type, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.type === type ? { ...i, qty } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + parsePrice(i.price) * i.qty, 0),
    [items]
  );

  const deliveryFee = items.length > 0 ? deliveryFeeRate : 0;
  const total = subtotal + deliveryFee;

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  const submitOrderRequest = useCallback(
    async ({ name, phone, address }) => {
      if (!items.length) {
        throw new Error("Your cart is empty. Add items before checkout.");
      }

      setPlacingOrder(true);

      try {
        const order = createOrderRequest({
          items,
          subtotal,
          deliveryFee,
          customer: { name, phone, address },
        });

        saveOrder(order);
        setActiveOrderId(order.id);
        setActiveOrder(order);
        setOrderPollPhone(phone.trim());
        localStorage.setItem("bk_my_orders_phone", phone.trim());
        setItems([]);
      } finally {
        setPlacingOrder(false);
      }
    },
    [items, subtotal, deliveryFee]
  );

  const completeOrderPayment = useCallback(
    async ({ paymentMethod, cardNumber, cardExpiry, cardCvv }) => {
      const order = refreshActiveOrder() || activeOrder;
      if (!order) {
        throw new Error("No active order found. Please submit your order again.");
      }

      if (order.status === ORDER_STATUS.REJECTED) {
        throw new Error("Out of stock — your order was rejected by the restaurant.");
      }

      if (!canPayForOrder(order.status)) {
        throw new Error("Please wait until the restaurant approves your order.");
      }

      setPlacingOrder(true);

      try {
        const paymentMeta = {};
        if (paymentMethod === "card" || paymentMethod === "mada") {
          paymentMeta.last4 = cardNumber?.slice(-4) || "****";
        }

        const paymentResult = await processPayment(paymentMethod, paymentMeta);
        if (!paymentResult.success) {
          throw new Error("Payment failed. Please try again.");
        }

        const paidOrder = finalizeOrderPayment(order, {
          paymentMethod,
          paymentMeta: {
            ...paymentMeta,
            transactionId: paymentResult.transactionId,
          },
        });

        updateOrder(order.id, paidOrder);
        setActiveOrderId(null);
        setActiveOrder(null);
        setLastOrder(paidOrder);
        setCartView("success");
      } finally {
        setPlacingOrder(false);
      }
    },
    [activeOrder, refreshActiveOrder]
  );

  const clearActiveOrder = useCallback(() => {
    setActiveOrderId(null);
    setActiveOrder(null);
    setCartView("cart");
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        count,
        modalProduct,
        openProductModal,
        closeProductModal,
        cartOpen,
        openCart,
        closeCart,
        cartView,
        startCheckout,
        backToCart,
        submitOrderRequest,
        completeOrderPayment,
        placingOrder,
        lastOrder,
        activeOrder,
        refreshActiveOrder,
        clearActiveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
