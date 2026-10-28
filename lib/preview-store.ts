"use client";
import { useSyncExternalStore } from "react";
const EVENT = "skifa-preview-change";
export function savePreview(key: string, value: unknown) {
  sessionStorage.setItem(
    key,
    typeof value === "string" ? value : JSON.stringify(value),
  );
  window.dispatchEvent(new Event(EVENT));
}
function subscribe(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
export function usePreview(key: string, fallback: string) {
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return sessionStorage.getItem(key) ?? fallback;
      } catch {
        return fallback;
      }
    },
    () => fallback,
  );
}
export function readObject<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
export type CompanyPreview = {
  name?: string;
  email?: string;
  industry?: string;
  state?: string;
  city?: string;
  address?: string;
  description?: string;
  size?: string;
  contactName?: string;
  jobTitle?: string;
  phone?: string;
  contactEmail?: string;
  logo?: string;
  active?: boolean;
};
export type InternPreview = {
  fullName?: string;
  email?: string;
  headline?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  skill?: string;
  skills?: { name: string; level: string }[];
  visible?: boolean;
};
