import {
  FaMoneyBillWave,
  FaCreditCard,
  FaMobileAlt,
  FaApple,
  FaWallet,
} from "react-icons/fa";
import { SiGooglepay } from "react-icons/si";

export const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: FaMoneyBillWave,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard",
    icon: FaCreditCard,
    color: "text-navy",
    bg: "bg-blue-50",
  },
  {
    id: "mada",
    label: "Mada Card",
    description: "Saudi debit card",
    icon: FaWallet,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    id: "stc_pay",
    label: "STC Pay",
    description: "Pay via STC Pay wallet",
    icon: FaMobileAlt,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: "apple_pay",
    label: "Apple Pay",
    description: "Fast & secure checkout",
    icon: FaApple,
    color: "text-navy",
    bg: "bg-gray-100",
  },
  {
    id: "google_pay",
    label: "Google Pay",
    description: "One-tap payment",
    icon: SiGooglepay,
    color: "text-navy",
    bg: "bg-gray-50",
  },
  {
    id: "jazzcash",
    label: "JazzCash",
    description: "Mobile wallet (Pakistan)",
    icon: FaMobileAlt,
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

export const DELIVERY_FEE = 5;

export function getPaymentMethod(id) {
  return PAYMENT_METHODS.find((m) => m.id === id);
}
