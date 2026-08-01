"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Folder, Loader2, Play } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  status: string;
  level: string;
  mode: string;
  projectType: string;
  createdAt: string;
  updatedAt: string;
  packId: string | null;
  packMode: string | null;
  packTier: string | null;
  stepCount: number;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/projects")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setProjects(data.projects);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    generating: "bg-yellow-500/20 text-yellow-500",
    generated: "bg-blue-500/20 text-blue-500",
    executing: "bg-orange-500/20 text-orange-500",
    completed: "bg-green-500/20 text-green-500",
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Projetos</h1>
            <p className="text-xs text-muted-foreground">{projects.length} projetos</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Folder className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Ainda não há projetos gerados</p>
            <Button onClick={() => router.push("/")}>Criar primeiro projeto</Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-border bg-card/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{p.title}</h3>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${statusColors[p.status] ?? statusColors.draft}`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{p.projectType}</span>
                        <span>·</span>
                        <span>{p.level}</span>
                        <span>·</span>
                        <span>{p.mode}</span>
                        {p.packMode && (<><span>·</span><span>{p.packMode}</span></>)}
                        {p.stepCount > 0 && (<><span>·</span><span>{p.stepCount} steps</span></>)}
                        <span>·</span>
                        <span>{new Date(p.updatedAt).toLocaleDateString("pt-PT")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {p.packId && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/project/${p.packId}/execute`)}
                        >
                          <Play className="mr-1.5 h-3 w-3" />
                          Execute
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
