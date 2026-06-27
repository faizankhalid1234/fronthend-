function PromoBanner() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 md:px-5 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 rounded-[22px] bg-gradient-to-r from-orange to-orange-dark px-8 py-10 shadow-[0_8px_32px_rgba(249,115,22,0.25)] md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold leading-snug text-white md:text-[28px]">
            Enjoy Authentic Arabic Taste with Special Family Deals
          </h2>
          <p className="mt-2 text-sm font-medium text-white/85 md:text-base">
            Freshly prepared Arabic meals, platters and rice deals delivered fast.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-orange shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Order Now
        </button>
      </div>
    </section>
  );
}

export default PromoBanner;
