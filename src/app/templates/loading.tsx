import { Skeleton } from "@/components/ui/skeleton";

export default function TemplatesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <Skeleton className="h-5 w-48" />
        </div>
      </header>
      <main className="container mx-auto max-w-7xl px-6 py-12 space-y-12">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex gap-1 pt-1">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-14 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
