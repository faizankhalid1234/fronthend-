import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { loadAllMenuData } from "../services/foodApi";
import { mergeMenuWithSite, subscribeSiteUpdated } from "../services/siteStore";

const MenuContext = createContext(null);

const EMPTY = {
  menuCatalog: {},
  menuCategories: [],
  deals: [],
  homeCategories: [],
  menuItems: [],
  settings: {},
};

export function MenuProvider({ children }) {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshFromSite = useCallback(() => {
    if (apiData) {
      setApiData((prev) => ({ ...prev }));
    }
  }, [apiData]);

  useEffect(() => {
    let active = true;

    loadAllMenuData()
      .then((result) => {
        if (active) {
          setApiData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load menu");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => subscribeSiteUpdated(refreshFromSite), [refreshFromSite]);

  const data = useMemo(() => {
    if (!apiData) return EMPTY;
    return mergeMenuWithSite(apiData);
  }, [apiData]);

  const value = useMemo(
    () => ({ ...data, loading, error }),
    [data, loading, error]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within MenuProvider");
  return ctx;
}
