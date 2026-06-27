const BASE = "https://www.themealdb.com/api/json/v1/1";

export const MENU_CATEGORY_CONFIG = [
  { id: "ramadan", title: "RAMADAN SPECIAL", arabicTitle: "", fetch: { type: "category", value: "Breakfast" } },
  { id: "appetizer", title: "APPETIZER", arabicTitle: "مقبلات", fetch: { type: "category", value: "Starter" } },
  { id: "deals", title: "Deals", arabicTitle: "", fetch: { type: "category", value: "Miscellaneous" } },
  { id: "barbeque", title: "BARBEQUE", arabicTitle: "مشويات", fetch: { type: "category", value: "Chicken" } },
  { id: "juices", title: "FRESH JUICES", arabicTitle: "عصيرات", fetch: { type: "search", value: "orange" } },
  { id: "chowmien", title: "CHOWMIEN", arabicTitle: "مكرونة", fetch: { type: "category", value: "Pasta" } },
  { id: "shakes", title: "SHAKES", arabicTitle: "المخفوق", fetch: { type: "search", value: "chocolate" } },
  { id: "salad", title: "SALAD", arabicTitle: "سلطات", fetch: { type: "category", value: "Vegetarian" } },
];

export const HOME_CATEGORY_CONFIG = [
  { title: "APPETIZER", arabicTitle: "المقبلات", apiCategory: "Starter" },
  { title: "SALAD", arabicTitle: "سلطات", apiCategory: "Vegetarian" },
  { title: "SOUP", arabicTitle: "شوربة", apiCategory: "Miscellaneous" },
  { title: "BARBEQUE", arabicTitle: "مشويات", apiCategory: "Chicken" },
  { title: "SEAFOOD", arabicTitle: "مأكولات بحرية", apiCategory: "Seafood" },
  { title: "RICE", arabicTitle: "أرز", apiCategory: "Side" },
  { title: "CHICKEN", arabicTitle: "دجاج", apiCategory: "Chicken" },
  { title: "MUTTON", arabicTitle: "لحم", apiCategory: "Lamb" },
];

async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchApiCategories() {
  const data = await apiGet("/categories.php");
  return data.categories || [];
}

export async function fetchMealsByCategory(category) {
  const data = await apiGet(`/filter.php?c=${encodeURIComponent(category)}`);
  return data.meals || [];
}

export async function fetchMealsBySearch(query) {
  const data = await apiGet(`/search.php?s=${encodeURIComponent(query)}`);
  return data.meals || [];
}

export async function fetchRandomMeals(count = 8) {
  const results = await Promise.all(
    Array.from({ length: count }, () => apiGet("/random.php"))
  );
  return results.map((r) => r.meals?.[0]).filter(Boolean);
}

export function mealPrice(id) {
  const n = parseInt(String(id).replace(/\D/g, ""), 10) || 10;
  return `${((n % 45) + 8).toFixed(2)} SAR`;
}

export function transformMeal(meal, index, categoryId, categoryName = "") {
  const vegCategories = ["Vegetarian", "Vegan", "Breakfast"];
  return {
    id: meal.idMeal || `${categoryId}-${index}`,
    title: (meal.strMeal || "Special Dish").toUpperCase(),
    arabicTitle: "",
    price: mealPrice(meal.idMeal || index),
    image: meal.strMealThumb,
    description: meal.strInstructions
      ? `${meal.strInstructions.slice(0, 100).trim()}...`
      : "Freshly prepared with quality ingredients.",
    isVeg: vegCategories.includes(categoryName) || vegCategories.includes(meal.strCategory),
  };
}

export async function fetchMealsForConfig(config) {
  const { fetch: src } = config;
  if (src.type === "category") {
    return fetchMealsByCategory(src.value);
  }
  return fetchMealsBySearch(src.value);
}

export async function loadAllMenuData() {
  const apiCategories = await fetchApiCategories();
  const categoryThumbMap = Object.fromEntries(
    apiCategories.map((c) => [c.strCategory, c.strCategoryThumb])
  );

  const catalogEntries = await Promise.all(
    MENU_CATEGORY_CONFIG.map(async (config) => {
      const meals = await fetchMealsForConfig(config);
      const items = meals.slice(0, 12).map((m, i) =>
        transformMeal(m, i, config.id, config.fetch.value)
      );
      return [config.id, items];
    })
  );

  const menuCatalog = Object.fromEntries(catalogEntries);

  const menuCategories = MENU_CATEGORY_CONFIG.map((config) => ({
    id: config.id,
    title: config.title,
    arabicTitle: config.arabicTitle,
    image:
      menuCatalog[config.id]?.[0]?.image ||
      categoryThumbMap[config.fetch.value] ||
      "",
  }));

  const dealSources = ["Chicken", "Beef", "Seafood", "Lamb"];
  const dealMealGroups = await Promise.all(
    dealSources.map((c) => fetchMealsByCategory(c))
  );
  const dealMeals = dealMealGroups.flat().slice(0, 4);

  const deals = dealMeals.map((meal, i) => {
    const price = mealPrice(meal.idMeal);
    const amount = price.replace(" SAR", "");
    return {
      id: meal.idMeal,
      title: meal.strMeal,
      price,
      badgePrice: `${amount}\nSAR`,
      posterType: "platter",
      posterTitle: meal.strMeal,
      image: meal.strMealThumb,
      dealIndex: i,
    };
  });

  const homeCategories = HOME_CATEGORY_CONFIG.map((cfg, i) => ({
    id: i + 1,
    title: cfg.title,
    arabicTitle: cfg.arabicTitle,
    image: categoryThumbMap[cfg.apiCategory] || menuCategories[i % menuCategories.length]?.image,
  }));

  const popularMeals = await fetchRandomMeals(8);
  const menuItems = popularMeals.map((m) => ({
    id: m.idMeal,
    title: m.strMeal,
    arabicTitle: "",
    description: m.strInstructions
      ? `${m.strInstructions.slice(0, 90).trim()}...`
      : "Chef special dish.",
    price: mealPrice(m.idMeal),
    image: m.strMealThumb,
  }));

  return { menuCatalog, menuCategories, deals, homeCategories, menuItems };
}
