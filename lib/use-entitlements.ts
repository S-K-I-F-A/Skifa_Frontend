"use client";
import { useEffect, useState } from "react";
import { backendRequest, type Entitlements } from "./backend";
export function useEntitlements() {
  const [value, setValue] = useState<Entitlements>({
    pro: false,
    walletActive: false,
    profileVisible: false,
    companyActive: false,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    backendRequest<Entitlements>("/entitlements")
      .then((result) => {
        if (active)
          setValue({
            pro: result.pro === true,
            walletActive: result.walletActive === true,
            profileVisible: result.profileVisible === true,
            companyActive: result.companyActive === true,
          });
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  return { ...value, loading };
}
