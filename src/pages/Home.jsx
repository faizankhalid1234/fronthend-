import { Link } from "react-router-dom";
import DealCard from "../components/DealCard";
import CategoryCard from "../components/CategoryCard";
import FoodCard from "../components/FoodCard";
import PromoBanner from "../components/PromoBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import { useMenu } from "../context/MenuContext";

function SectionLoader() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-orange/20 border-t-orange" />
    </div>
  );
}

function Home() {
  const { deals, homeCategories, menuItems, loading, error } = useMenu();

  if (loading) {
    return (
      <main>
        <SectionLoader />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-[1320px] px-4 py-20 text-center">
        <p className="text-red-500">{error}</p>
        <p className="mt-2 text-sm text-gray-muted">Check your internet connection and refresh.</p>
      </main>
    );
  }

  return (
    <main>
      <section className="mx-auto max-w-[1320px] px-4 pt-8 md:px-5 md:pt-[30px] lg:px-8">
        <h1 className="mb-6 text-[24px] font-bold text-navy md:text-[26px]">
          Deals Items
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-4 pt-10 md:px-5 md:pt-12 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-[22px] font-bold text-navy md:text-[24px]">
            Our Menu
          </h2>
          <Link
            to="/menu"
            className="rounded-full bg-orange-pale px-5 py-2 text-sm font-semibold text-orange transition hover:bg-orange-light"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 lg:gap-4">
          {homeCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-4 pt-10 md:px-5 md:pt-12 lg:px-8">
        <h2 className="mb-5 text-[22px] font-bold text-navy md:text-[24px]">
          Popular Dishes
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {menuItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <div className="pt-14 md:pt-16 lg:pt-[58px]">
        <PromoBanner />
      </div>

      <div className="pt-14 md:pt-16 lg:pt-[58px]">
        <WhyChooseUs />
      </div>
    </main>
  );
}

export default Home;
