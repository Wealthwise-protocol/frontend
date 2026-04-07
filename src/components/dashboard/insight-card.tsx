import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { IconSparkles } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchAiInsight } from "@/services/chat"

export function InsightCard() {
  const { data: insight, isLoading, isError } = useQuery({
    queryKey: ["ai-insight"],
    queryFn: fetchAiInsight,
    staleTime: 1000 * 60 * 30,
  })

  if (isError || (!isLoading && !insight)) return null

  return (
    <Card className="border-l-[3px] border-l-primary/60">
      <CardContent className="p-5">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <>
            <p className="mb-1.5 flex items-center gap-1.5 text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
              <IconSparkles className="size-3 text-primary" />
              X Insight
            </p>
            <p className="text-xs/relaxed text-foreground">{insight}</p>
            <div className="mt-3">
              <Button variant="outline" size="lg" asChild>
                <Link to="/dashboard/chat">Ask X</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
