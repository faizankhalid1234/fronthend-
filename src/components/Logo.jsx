import BrandIcon from "./BrandIcon";

function Logo({ variant = "default" }) {
  const isLight = variant === "light";

  return (
    <a href="/" className="flex items-center gap-2.5 shrink-0 group">
      <div className="leading-none">
        <span
          className={`block text-[22px] font-extrabold tracking-tight uppercase ${
            isLight ? "text-white" : "text-orange"
          }`}
        >
          BHANDU
        </span>
        <span
          className={`block text-[11px] font-semibold tracking-[0.12em] uppercase ${
            isLight ? "text-orange" : "text-orange"
          }`}
        >
          Khan
        </span>
      </div>
      <BrandIcon size={48} className="shrink-0 shadow-md shadow-orange/25 ring-2 ring-orange/20 transition-transform group-hover:scale-105 rounded-[14px]" />
    </a>
  );
}

export default Logo;
