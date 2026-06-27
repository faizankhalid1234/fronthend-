const SITE_KEY = "bk_site_data";

export const DEFAULT_SETTINGS = {
  restaurantName: "BHANDU KHAN",
  contactName: "Faizan Khalid",
  phone: "03029655325",
  email: "fk5095129@gmail.com",
  whatsapp: "923029655325",
  address: "House 12, Main Boulevard, Riyadh / Lahore",
  deliveryFee: 5,
  copyrightYear: 2026,
};

function notifySiteUpdated() {
  window.dispatchEvent(new CustomEvent("site-data-updated"));
}

export function readSiteData() {
  try {
    const raw = JSON.parse(localStorage.getItem(SITE_KEY) || "null");
    if (!raw || typeof raw !== "object") return {};
    return raw;
  } catch {
    return {};
  }
}

export function saveSiteData(data) {
  localStorage.setItem(SITE_KEY, JSON.stringify(data));
  notifySiteUpdated();
}

export function updateSiteData(patch) {
  const next = { ...readSiteData(), ...patch, updatedAt: new Date().toISOString() };
  saveSiteData(next);
  return next;
}

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...(readSiteData().settings || {}) };
}

export function saveSettings(settings) {
  const data = readSiteData();
  data.settings = { ...DEFAULT_SETTINGS, ...data.settings, ...settings };
  saveSiteData(data);
  return data.settings;
}

export function getDeliveryFee() {
  const fee = Number(getSettings().deliveryFee);
  return Number.isFinite(fee) && fee >= 0 ? fee : DEFAULT_SETTINGS.deliveryFee;
}

export function mergeMenuWithSite(apiData) {
  const site = readSiteData();
  const settings = getSettings();

  return {
    menuCatalog:
      site.menuCatalog && Object.keys(site.menuCatalog).length > 0
        ? site.menuCatalog
        : apiData.menuCatalog,
    menuCategories:
      site.menuCategories?.length > 0 ? site.menuCategories : apiData.menuCategories,
    deals: site.deals?.length > 0 ? site.deals : apiData.deals,
    homeCategories:
      site.homeCategories?.length > 0 ? site.homeCategories : apiData.homeCategories,
    menuItems: site.menuItems?.length > 0 ? site.menuItems : apiData.menuItems,
    settings,
  };
}

export function subscribeSiteUpdated(handler) {
  const onStorage = (e) => {
    if (e.key === SITE_KEY) handler();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("site-data-updated", handler);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("site-data-updated", handler);
  };
}

export function newItemId(prefix = "item") {
  return `${prefix}-${Date.now().toString(36)}`;
}
