"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowUp, Bot, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";
import { ChatMessage } from "@/features/ai/message";

const QUICK_PROMPTS = ["Who am I logged in as?", "What's the current time?"];

const chatTransport = new DefaultChatTransport({ api: "/api/ai/chat" });

export function AiWidget() {
  const { messages, sendMessage, status, error, clearError } = useChat({
    transport: chatTransport,
  });

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const isStreaming = status === "streaming" || status === "submitted";
  const isEmpty = messages.length === 0;

  function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isStreaming) return;
    if (error) {
      clearError();
    }
    sendMessage({ text: msg });
    setInput("");
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-3.5" />
          </div>
          <span className="text-sm font-medium">AI Assistant</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
        <Link
          href="/ai"
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Open full chat
          <ExternalLink className="size-3" />
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4">
        {isEmpty ? (
          <div className="flex flex-col gap-3 py-5">
            <Empty className="border-0 p-0 py-1">
              <EmptyHeader>
                <EmptyMedia
                  variant="icon"
                  className="bg-primary/10 text-primary"
                >
                  <Bot className="size-5" />
                </EmptyMedia>
                <EmptyTitle className="text-base">Ask the AI</EmptyTitle>
                <EmptyDescription className="text-xs">
                  Try one of these prompts to see it in action.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="max-w-none">
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleSend(p)}
                      className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/60 transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Typing indicator */}
            {isStreaming && (
              <div className="flex items-end gap-2">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground">
                  <Bot className="size-3.5" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-muted px-3 py-2 flex gap-1 items-center">
                  <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0ms]" />
                  <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:150ms]" />
                  <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4 pt-2 border-t border-border">
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2 transition-all",
            "focus-within:border-primary/50 focus-within:bg-background focus-within:shadow-sm",
          )}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI something..."
            disabled={isStreaming}
            className="flex-1 border-0 bg-transparent p-0 text-xs shadow-none focus-visible:ring-0 h-auto"
          />
          <Button
            size="icon"
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
            className={cn(
              "size-6 shrink-0 rounded-full transition-all",
              !input.trim() || isStreaming ? "opacity-40" : "opacity-100",
            )}
          >
            {isStreaming ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <ArrowUp className="size-3" />
            )}
          </Button>
        </div>
        {error && (
          <p className="mt-2 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-[11px] text-destructive">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
