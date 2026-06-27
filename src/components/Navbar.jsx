import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useMenu } from "../context/MenuContext";
import { UserMenu, AuthButton } from "./UserMenu";
import Logo from "./Logo";
import LanguageDropdown from "./LanguageDropdown";
import SearchBar from "./SearchBar";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/menu", label: "Menu" },
  { to: "/my-orders", label: "My Orders" },
  { to: "/offers", label: "Offers" },
];

function CartButton({ compact = false }) {
  const { total, count, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={`relative flex items-center gap-2 rounded-full bg-navy font-bold text-white shadow-[0_3px_12px_rgba(26,35,64,0.35)] transition hover:bg-navy-light hover:shadow-[0_4px_16px_rgba(26,35,64,0.45)] ${
        compact
          ? "h-[40px] px-3.5 text-xs"
          : "h-[46px] px-5 text-[14px] tracking-wide"
      }`}
      aria-label="Open shopping cart"
    >
      <HiOutlineShoppingBag className={compact ? "h-4 w-4" : "h-[19px] w-[19px]"} />
      <span>{total.toFixed(2)} SAR</span>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-orange px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
          {count}
        </span>
      )}
    </button>
  );
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const { settings } = useMenu();
  const whatsapp = settings?.whatsapp || "923029655325";

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap text-[15px] font-semibold transition-colors hover:text-orange ${
      isActive ? "text-orange" : "text-navy"
    }`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-border/80 bg-white shadow-[0_1px_8px_rgba(26,35,64,0.04)]">
      <div className="mx-auto max-w-[1320px] px-4 md:px-5 lg:px-8">
        <div className="flex h-[90px] items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 lg:gap-3.5">
            <Logo />
            <div className="hidden sm:flex items-center gap-2">
              <LanguageDropdown />
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[42px] items-center gap-2 rounded-full bg-green-support px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-green-support-dark"
              >
                <FaWhatsapp className="h-[18px] w-[18px]" />
                <span className="hidden md:inline">Support</span>
              </a>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="hidden md:block">
              <SearchBar />
            </div>

            <CartButton />

            <div className="hidden sm:block">
              {isLoggedIn ? <UserMenu /> : <AuthButton />}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-border text-navy lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <IoClose className="h-6 w-6" />
              ) : (
                <IoMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-gray-border pb-5 pt-4 lg:hidden">
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <LanguageDropdown />
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[42px] items-center gap-2 rounded-full bg-green-support px-4 text-sm font-semibold text-white"
              >
                <FaWhatsapp className="h-[18px] w-[18px]" />
                Support
              </a>
            </div>
            <SearchBar className="mb-4 md:hidden" />
            <nav className="mb-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={linkClass}
                  onClick={closeMobile}
                >
                  <span className="block rounded-lg px-3 py-2.5 hover:bg-orange-light whitespace-nowrap">
                    {link.label}
                  </span>
                </NavLink>
              ))}
            </nav>
            <div className="sm:hidden">
              {isLoggedIn ? (
                <div onClick={closeMobile}>
                  <UserMenu />
                </div>
              ) : (
                <AuthButton compact onClick={closeMobile} />
              )}
            </div>
            {!isLoggedIn && (
              <p className="mt-3 text-center text-sm text-gray-muted sm:hidden">
                New here?{" "}
                <Link
                  to="/signup"
                  onClick={closeMobile}
                  className="font-semibold text-orange"
                >
                  Sign Up
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
