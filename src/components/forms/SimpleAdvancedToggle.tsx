"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, Settings } from "lucide-react";

interface SimpleAdvancedToggleProps {
  mode: "simple" | "advanced";
  onToggle: () => void;
}

export function SimpleAdvancedToggle({ mode, onToggle }: SimpleAdvancedToggleProps) {
  return (
    <div className="relative flex items-center rounded-full border border-border bg-card/50 p-0.5">
      {/* Background slider */}
      <motion.div
        className="absolute inset-y-0.5 rounded-full bg-primary"
        initial={false}
        animate={{
          left: mode === "simple" ? "2px" : "50%",
          right: mode === "simple" ? "50%" : "2px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative z-10 flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
          mode === "simple" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sparkles className="h-3 w-3" />
        Simplificada
      </button>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative z-10 flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
          mode === "advanced" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Settings className="h-3 w-3" />
        Avançada
      </button>
    </div>
  );
}
