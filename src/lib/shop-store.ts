import { useEffect, useState } from "react";

export type ThemeId = "maroon" | "black" | "cream";
export type LangId = "ta" | "en";

export interface ShopProfile {
  shopName: string;
  logoDataUrl: string | null;
  language: LangId;
  location: string;
  theme: ThemeId;
}

const KEY = "swarna_shop_profile_v1";

export function getShopProfile(): ShopProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ShopProfile) : null;
  } catch {
    return null;
  }
}

export function saveShopProfile(p: ShopProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearShopProfile() {
  localStorage.removeItem(KEY);
}

export function useShopProfile() {
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setProfile(getShopProfile());
    setReady(true);
  }, []);
  return {
    profile,
    ready,
    save: (p: ShopProfile) => {
      saveShopProfile(p);
      setProfile(p);
    },
    clear: () => {
      clearShopProfile();
      setProfile(null);
    },
  };
}