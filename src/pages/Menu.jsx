import { useEffect, useState, useRef } from "react";
import { BsGridFill, BsListUl } from "react-icons/bs";
import { GiChickenLeg } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import MenuCategoryStrip from "../components/MenuCategoryStrip";
import MenuItemCard from "../components/MenuItemCard";
import MenuLoader from "../components/MenuLoader";
import { useMenu } from "../context/MenuContext";

function Menu() {
  const { menuCategories, menuCatalog, loading, error } = useMenu();
  const [activeCategory, setActiveCategory] = useState("ramadan");
  const [displayCategory, setDisplayCategory] = useState("ramadan");
  const [dietFilter, setDietFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [switching, setSwitching] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (menuCategories.length && !menuCatalog[activeCategory]) {
      const first = menuCategories[0].id;
      setActiveCategory(first);
      setDisplayCategory(first);
    }
  }, [menuCategories, menuCatalog, activeCategory]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    setDietFilter("all");
  }, [displayCategory]);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1320px] px-4 py-20">
        <MenuLoader />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-[1320px] px-4 py-20 text-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  const category = menuCategories.find((c) => c.id === displayCategory);
  const items = menuCatalog[displayCategory] || [];

  const filtered = items.filter((item) => {
    if (dietFilter === "veg") return item.isVeg;
    if (dietFilter === "nonveg") return !item.isVeg;
    return true;
  });

  const sectionTitle = category?.arabicTitle
    ? `${category.title} (${category.arabicTitle})`
    : category?.title;

  const handleCategorySelect = (id) => {
    if (id === activeCategory || switching) return;

    setActiveCategory(id);
    setSwitching(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setDisplayCategory(id);
      setSwitching(false);
    }, 120);
  };

  return (
    <main className="mx-auto max-w-[1320px] px-4 pb-12 pt-7 md:px-5 md:pt-8 lg:px-8">
      <MenuCategoryStrip
        categories={menuCategories}
        activeId={activeCategory}
        onSelect={handleCategorySelect}
        disabled={switching}
      />

      <div
        className={`mt-4 flex flex-wrap gap-2 transition-opacity duration-150 ${
          switching ? "pointer-events-none opacity-50" : "opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={() => setDietFilter("nonveg")}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
            dietFilter === "nonveg"
              ? "bg-navy text-white"
              : "bg-[#eef0f4] text-navy hover:bg-gray-border"
          }`}
        >
          <GiChickenLeg className="h-3.5 w-3.5" />
          Non-Veg
        </button>
        <button
          type="button"
          onClick={() => setDietFilter("veg")}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
            dietFilter === "veg"
              ? "bg-green-support text-white"
              : "bg-[#eef0f4] text-navy hover:bg-gray-border"
          }`}
        >
          <FaLeaf className="h-3.5 w-3.5" />
          Veg
        </button>
        {dietFilter !== "all" && (
          <button
            type="button"
            onClick={() => setDietFilter("all")}
            className="rounded-full bg-orange-pale px-3.5 py-1.5 text-[13px] font-semibold text-orange"
          >
            Show All
          </button>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-b-2 border-orange/20 pb-3">
        <h1 className="text-[18px] font-extrabold uppercase tracking-wide text-orange md:text-[22px]">
          {sectionTitle}
        </h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
              viewMode === "list"
                ? "bg-navy text-white"
                : "bg-[#eef0f4] text-gray-muted hover:text-navy"
            }`}
            aria-label="List view"
          >
            <BsListUl className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
              viewMode === "grid"
                ? "bg-navy text-white"
                : "bg-[#eef0f4] text-gray-muted hover:text-navy"
            }`}
            aria-label="Grid view"
          >
            <BsGridFill className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative mt-4 min-h-[200px]">
        {switching ? (
          <MenuLoader />
        ) : filtered.length > 0 ? (
          <div
            className={`gap-3 ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                : "flex flex-col"
            }`}
          >
            {filtered.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-gray-muted">
            No items found for this filter.
          </p>
        )}
      </div>
    </main>
  );
}

export default Menu;
