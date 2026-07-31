"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Palette, Type, Layers, Cpu } from "lucide-react";

const STEPS = [
  { icon: Sparkles, label: "A analisar briefing" },
  { icon: Palette, label: "A gerar paleta" },
  { icon: Type, label: "A escolher tipografia" },
  { icon: Layers, label: "A recomendar layout" },
  { icon: Cpu, label: "A detetar skills & MCP" },
];

export function LoadingSteps() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="premium-card mx-auto flex max-w-md flex-col gap-3 p-8"
    >
      <div className="mb-2 flex items-center justify-center gap-2 text-primary">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="font-mono text-sm tracking-wide">
          A forjar o projeto…
        </span>
      </div>
      <ul className="space-y-2">
        {STEPS.map((step, i) => (
          <motion.li
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.25, type: "spring", stiffness: 200 }}
            className="flex items-center gap-3 text-sm text-muted-foreground"
          >
            <step.icon className="h-4 w-4 text-primary/70" />
            <span>{step.label}</span>
            <motion.span
              className="ml-auto h-1 w-1 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
