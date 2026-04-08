import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { IconSparkles } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchAiInsight } from "@/services/chat"

export function InsightCard() {
  const { data: insight, isLoading, isError } = useQuery({
    queryKey: ["ai-insight"],
    queryFn: fetchAiInsight,
    staleTime: 1000 * 60 * 30,
  })

  if (isError || (!isLoading && !insight)) return null

  return (
    <Card className="insight-card">
      <CardContent className="p-5">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <>
            <p className="mb-1.5 flex items-center gap-1.5 section-label">
              <span className="inline-flex items-center justify-center rounded-md bg-primary/10 p-2 text-primary"><IconSparkles className="size-3" /></span>
              X Insight
            </p>
            <p className="text-sm leading-relaxed text-foreground">{insight}</p>
            <div className="mt-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/chat">Ask X</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
