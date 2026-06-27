function MenuLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative h-[72px] w-[72px]">
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-orange/20 border-t-orange" />
        <div
          className="absolute inset-2 animate-spin rounded-full border-[3px] border-navy/10 border-b-navy"
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🍽️</span>
        </div>
      </div>
      <p className="mt-5 text-[15px] font-semibold text-navy">Loading menu...</p>
      <div className="mt-3 flex gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-orange [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-orange [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-orange [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default MenuLoader;
