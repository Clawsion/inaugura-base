"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Hook de autosave — persiste qualquer valor serializável em localStorage.
 * Recarrega automaticamente quando a página volta (refresh, F5, volta tab).
 */
export function useAutosave<T>(key: string, initial: T, debounceMs = 500) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  // Load do localStorage no mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setValue({ ...initial, ...parsed });
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, [key]);

  // Save com debounce
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // localStorage cheio ou indisponível
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [key, value, loaded, debounceMs]);

  const reset = useCallback(() => {
    setValue(initial);
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key, initial]);

  return [value, setValue, reset, loaded] as const;
}
