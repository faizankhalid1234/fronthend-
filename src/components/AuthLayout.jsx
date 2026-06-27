import { Link } from "react-router-dom";
import Logo from "./Logo";

function AuthLayout({ title, subtitle, children, footer, standalone = false }) {
  return (
    <div
      className={`flex items-center justify-center px-4 py-8 sm:py-10 ${
        standalone ? "min-h-screen pb-[max(2rem,env(safe-area-inset-bottom))]" : "min-h-[calc(100vh-90px)]"
      }`}
    >
      <div className="w-full max-w-[440px]">
        <div className="mb-6 flex justify-center sm:mb-8">
          <Logo />
        </div>

        <div className="rounded-[22px] border border-gray-border bg-white p-5 shadow-[0_8px_32px_rgba(26,35,64,0.08)] sm:p-8">
          <div className="mb-5 text-center sm:mb-6">
            <h1 className="text-[22px] font-bold text-navy sm:text-[24px]">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-muted">{subtitle}</p>
            )}
          </div>

          {children}
        </div>

        {footer && <div className="mt-5 text-center text-sm sm:mt-6">{footer}</div>}
      </div>
    </div>
  );
}

export function AuthLink({ to, children }) {
  return (
    <Link to={to} className="font-semibold text-orange transition hover:text-orange-dark">
      {children}
    </Link>
  );
}

export default AuthLayout;
