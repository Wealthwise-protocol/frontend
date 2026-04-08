import { Skeleton } from "@/components/ui/skeleton"

export function PageLoader() {
  return (
    <div className="flex min-h-svh">
      {/* Sidebar skeleton — desktop only */}
      <div className="hidden w-56 shrink-0 border-r border-border bg-card p-4 md:block">
        <Skeleton className="h-6 w-24" />
        <div className="mt-8 flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Topbar skeleton */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4 md:px-6">
          <Skeleton className="h-8 w-48 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-4 md:p-6">
          <Skeleton className="h-8 w-48" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
          <Skeleton className="mt-6 h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
