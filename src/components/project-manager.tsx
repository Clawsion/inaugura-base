"use client";

// ============================================================================
// ProjectManager — histórico, cópia, reset total e reset individual
// ============================================================================
// Funcionalidades:
//  1. Histórico — guarda specs geradas em localStorage
//  2. Copiar projeto atual — duplica o form atual
//  3. Reset total — limpa tudo
//  4. Reset de página individual — limpa secções específicas
// ============================================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History, Copy, RotateCcw, Trash2, Save, FolderOpen, X, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { FormValues } from "@/lib/schemas";

interface SavedProject {
  id: string;
  name: string;
  timestamp: number;
  form: FormValues;
  hasResult: boolean;
}

interface ProjectManagerProps {
  form: FormValues;
  onResetAll: () => void;
  onResetSection: (section: string) => void;
  onLoadProject: (form: FormValues) => void;
}

const STORAGE_KEY = "inaugura-base-projects";

function loadProjects(): SavedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: SavedProject[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.slice(0, 20)));
  } catch {
    // localStorage pode estar cheio
  }
}

const RESET_SECTIONS = [
  { id: "briefing", label: "Briefing & Nicho" },
  { id: "design", label: "Design Visual & Layout" },
  { id: "skills", label: "Skills & Integrações" },
  { id: "fonts", label: "Font Playground" },
  { id: "palette", label: "Paleta de Cores" },
  { id: "typography", label: "Tipografia" },
  { id: "extras", label: "Extras & Configuração" },
];

export function ProjectManager({ form, onResetAll, onResetSection, onLoadProject }: ProjectManagerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"history" | "copy" | "reset">("history");
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjects(loadProjects());
  }, []);

  const handleSave = () => {
    const name = `Projeto ${new Date().toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}`;
    const project: SavedProject = {
      id: Date.now().toString(),
      name,
      timestamp: Date.now(),
      form: { ...form },
      hasResult: false,
    };
    const next = [project, ...projects].slice(0, 20);
    setProjects(next);
    saveProjects(next);
    toast.success(`Projeto guardado: "${name}"`);
  };

  const handleCopy = () => {
    const name = `Cópia ${new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`;
    const project: SavedProject = {
      id: Date.now().toString(),
      name,
      timestamp: Date.now(),
      form: { ...form },
      hasResult: false,
    };
    const next = [project, ...projects].slice(0, 20);
    setProjects(next);
    saveProjects(next);
    toast.success(`Cópia criada: "${name}"`);
  };

  const handleLoad = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    onLoadProject(project.form);
    toast.success(`Projeto carregado: "${project.name}"`);
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    saveProjects(next);
    toast.success("Projeto removido");
  };

  const handleResetAll = () => {
    onResetAll();
    toast.success("Projeto reiniciado — tudo limpo");
    setOpen(false);
  };

  const handleResetSection = (section: string) => {
    onResetSection(section);
    toast.success(`Secção reiniciada: ${RESET_SECTIONS.find(s => s.id === section)?.label}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-1">
        {/* Save current */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          title="Guardar projeto atual"
        >
          <Save className="h-3.5 w-3.5" />
        </Button>
        {/* Copy */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          title="Copiar projeto atual"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        {/* Open manager */}
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            title="Histórico & Reset"
          >
            <History className="h-3.5 w-3.5" />
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-2xl gap-0 border-border bg-card p-0 sm:rounded-2xl">
        <DialogTitle className="sr-only">Gestão de Projetos</DialogTitle>
        <DialogDescription className="sr-only">
          Histórico, cópia e reset de projetos.
        </DialogDescription>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <FolderOpen className="h-4 w-4 text-primary" />
            Gestão de Projetos
          </h3>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-7 w-7">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border p-2">
          {([
            { id: "history", label: "Histórico", icon: Clock },
            { id: "copy", label: "Copiar", icon: Copy },
            { id: "reset", label: "Reset", icon: RotateCcw },
          ] as const).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                tab === t.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="h-3 w-3" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {/* HISTORY TAB */}
          {tab === "history" && (
            <div className="space-y-2">
              {projects.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <Clock className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  Nenhum projeto guardado ainda.
                  <br />
                  Clica no ícone <Save className="inline h-3 w-3" /> para guardar.
                </div>
              ) : (
                projects.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(p.timestamp).toLocaleString("pt-PT")}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoad(p.id)}
                      className="h-7 text-[10px]"
                    >
                      Carregar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(p.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* COPY TAB */}
          {tab === "copy" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Cria uma cópia do projeto atual. Útil para experimentar variações sem perder o original.
              </p>
              <Button
                type="button"
                onClick={handleCopy}
                className="w-full gap-2"
              >
                <Copy className="h-4 w-4" />
                Copiar projeto atual
              </Button>
              <div className="text-[10px] text-muted-foreground">
                A cópia ficará guardada no histórico com timestamp.
              </div>
            </div>
          )}

          {/* RESET TAB */}
          {tab === "reset" && (
            <div className="space-y-3">
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Reset individual (por secção)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {RESET_SECTIONS.map((s) => (
                    <Button
                      key={s.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetSection(s.id)}
                      className="h-8 justify-start gap-2 text-[11px]"
                    >
                      <RotateCcw className="h-3 w-3" />
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-destructive">
                  Reset total (todas as secções)
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetAll}
                  className="w-full gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar tudo — recomeçar do zero
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
