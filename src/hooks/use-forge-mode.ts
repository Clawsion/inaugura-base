"use client";

import { useState, useEffect, useCallback } from "react";

export type ForgeMode = "simple" | "advanced";

const STORAGE_KEY = "inaugura:forge-mode";

/**
 * Hook que gere o modo Simplificada/Avançada do Forge.
 * Persiste no localStorage. Default: "simple" (para a maioria dos users).
 */
export function useForgeMode() {
  const [mode, setMode] = useState<ForgeMode>("simple");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "simple" || saved === "advanced") {
        setMode(saved);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === "simple" ? "advanced" : "simple";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setSimple = useCallback(() => {
    setMode("simple");
    try { localStorage.setItem(STORAGE_KEY, "simple"); } catch {}
  }, []);

  const setAdvanced = useCallback(() => {
    setMode("advanced");
    try { localStorage.setItem(STORAGE_KEY, "advanced"); } catch {}
  }, []);

  return { mode, toggle, setSimple, setAdvanced, loaded };
}
