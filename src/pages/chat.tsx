import { useRef, useEffect, useCallback, useState } from "react"
import { usePageTitle } from "@/hooks/use-page-title"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Markdown from "react-markdown"
import {
  IconRobot,
  IconSend,
  IconTrash,
  IconSparkles,
  IconLoader2,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/error-messages"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FadeIn } from "@/components/ui/animated"
import { cn } from "@/lib/utils"
import {
  fetchChatHistory,
  sendChatMessage,
  clearChatHistory,
  type ChatMessage,
} from "@/services/chat"

const SUGGESTED_PROMPTS = [
  "What should I invest in?",
  "Analyze my portfolio",
  "Suggest a SIP plan for \u20B910,000/month",
  "Compare my funds",
]

export function ChatPage() {
  usePageTitle("Chat with X")
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [input, setInput] = useState("")

  const { data: messages = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ["chat-history"],
    queryFn: fetchChatHistory,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  })

  const { mutate: send, isPending: isSending } = useMutation({
    mutationFn: sendChatMessage,
    onMutate: async (message: string) => {
      setInput("")
      await queryClient.cancelQueries({ queryKey: ["chat-history"] })
      const previous = queryClient.getQueryData<ChatMessage[]>(["chat-history"])
      queryClient.setQueryData<ChatMessage[]>(["chat-history"], (old = []) => [
        ...old,
        { role: "user", content: message },
      ])
      return { previous }
    },
    onSuccess: (response: string) => {
      queryClient.setQueryData<ChatMessage[]>(["chat-history"], (old = []) => [
        ...old,
        { role: "assistant", content: response },
      ])
    },
    onError: (err: unknown, _vars, context) => {
      queryClient.setQueryData(["chat-history"], context?.previous)
      toast.error(getErrorMessage(err, "AI service unavailable, please try again"))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-history"] })
    },
  })

  const { mutate: clearChat } = useMutation({
    mutationFn: clearChatHistory,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["chat-history"] })
      const previous = queryClient.getQueryData<ChatMessage[]>(["chat-history"])
      queryClient.setQueryData<ChatMessage[]>(["chat-history"], [])
      return { previous }
    },
    onSuccess: () => {
      toast.success("Chat cleared")
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["chat-history"], context?.previous)
      toast.error("Failed to clear chat")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-history"] })
    },
  })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isSending])

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isSending) return
    send(trimmed)
  }, [input, isSending, send])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestion = (prompt: string) => {
    if (isSending) return
    send(prompt)
  }

  const showWelcome = messages.length === 0 && !isLoadingHistory

  return (
    <FadeIn className="flex h-[calc(100svh-3.5rem-2rem)] flex-col md:h-[calc(100svh-3.5rem-3rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <IconSparkles className="size-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              X — Your Financial Co-Pilot
            </h1>
          </div>
        </div>
        {messages.length > 0 && (
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Clear chat"
                  >
                    <IconTrash className="size-3.5 text-muted-foreground" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Clear chat</TooltipContent>
            </Tooltip>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all messages in this conversation.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => clearChat()}
                >
                  Clear
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card card-shadow p-3">
        {isLoadingHistory ? (
          <div className="flex h-full items-center justify-center">
            <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : showWelcome ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <IconRobot className="size-6" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Hi, I&apos;m X
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Your personal financial co-pilot. Ask me anything about your
                investments.
              </p>
            </div>
            <div className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSuggestion(prompt)}
                  className="rounded-lg border border-border bg-background px-3 py-2.5 text-left text-xs text-foreground transition-colors hover:bg-muted card-hover"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2.5",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {msg.role === "assistant" && (
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <IconRobot className="size-3.5" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] px-3 py-2 text-xs sm:max-w-[75%]",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                      : "rounded-2xl rounded-bl-sm border border-border bg-muted text-foreground",
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div className="chat-markdown">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isSending && (
              <div className="flex gap-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center bg-primary text-primary-foreground">
                  <IconRobot className="size-3.5" />
                </div>
                <div className="rounded-2xl rounded-bl-sm border border-border bg-muted px-3 py-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-block size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                    <span className="inline-block size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                    <span className="inline-block size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="flex items-end gap-2 pt-3">
        <label htmlFor="chat-input" className="sr-only">Message</label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask X anything about your finances..."
          disabled={isSending}
          rows={1}
          className={cn(
            "input-clean field-sizing-content max-h-32 min-h-8 flex-1 resize-none rounded-lg bg-background px-3 py-1.5 text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          aria-label="Send message"
        >
          <IconSend className="size-3.5" />
        </Button>
      </div>
    </FadeIn>
  )
}
