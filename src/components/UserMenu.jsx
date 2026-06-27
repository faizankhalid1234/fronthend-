import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonOutline, IoLogOutOutline, IoChevronDown } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

function UserMenu() {
  const { user, logout, isGuest } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  const displayName = isGuest ? "Guest" : user.name.split(" ")[0];

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-[46px] max-w-[160px] items-center gap-2 rounded-full bg-orange px-4 text-[13px] font-semibold text-white shadow-[0_3px_12px_rgba(249,115,22,0.35)] transition hover:bg-orange-dark sm:px-5 sm:text-[14px]"
      >
        <IoPersonOutline className="h-[19px] w-[19px] shrink-0" />
        <span className="truncate">{displayName}</span>
        <IoChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[220px] overflow-hidden rounded-xl border border-gray-border bg-white py-1 shadow-lg">
          <div className="border-b border-gray-border px-4 py-3">
            <p className="text-sm font-bold text-navy">{user.name}</p>
            {isGuest ? (
              <p className="mt-0.5 text-xs text-gray-muted">Browsing as guest</p>
            ) : (
              <p className="mt-0.5 truncate text-xs text-gray-muted">{user.email}</p>
            )}
          </div>
          {isGuest && (
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="block border-b border-gray-border px-4 py-3 text-sm font-semibold text-orange transition hover:bg-orange-light"
            >
              Create Account
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <IoLogOutOutline className="h-[18px] w-[18px]" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

function AuthButton({ compact = false, onClick }) {
  return (
    <Link
      to="/login"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full bg-orange font-semibold text-white shadow-[0_3px_12px_rgba(249,115,22,0.35)] transition hover:bg-orange-dark ${
        compact
          ? "h-[44px] w-full justify-center text-sm"
          : "h-[46px] px-5 text-[14px]"
      }`}
    >
      <IoPersonOutline className="h-[19px] w-[19px]" />
      <span>Log In</span>
    </Link>
  );
}

export { UserMenu, AuthButton };
