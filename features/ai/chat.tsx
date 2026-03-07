"use client";

import {DefaultChatTransport} from "ai";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {useChat} from "@ai-sdk/react";
import {ArrowUp, Bot, BotIcon, Loader2} from "lucide-react";
import {useCallback, useEffect, useRef, useState} from "react";
import {ChatMessage} from "./message";

const SUGGESTED_PROMPTS = [
  "Who am I logged in as?",
  "What's the current time?",
  "What can you help me with?",
];

const chatTransport = new DefaultChatTransport({
  api: "/api/ai/chat",
});

export function Chat() {
  const { messages, sendMessage, status, error, clearError } = useChat({
    transport: chatTransport,
  });

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isStreaming = status === "streaming" || status === "submitted";
  const isEmpty = messages.length === 0;
  const messageCount = messages.length;
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: isStreaming ? "auto" : "smooth" });
  }, [messageCount , isStreaming]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  const  handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;
    if (error) {
      clearError();
    }
    sendMessage({ text });
    setInput("");
  }, [input, isStreaming, error, clearError, sendMessage]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col" style={{ height: "100%", minHeight: 0 }}>
      {/* ── Scrollable messages ── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isEmpty ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center min-h-full gap-6 px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary relative">
              <BotIcon className="size-7" />
            <div className={"ring-1 ring-inset ring-foreground"}></div>

            </div>

            <div className="space-y-2 max-w-sm">
              <h2 className="text-2xl font-semibold tracking-tight">
                How can I help you?
              </h2>
              <p className="text-sm text-muted-foreground">
                Ask me anything — I can answer questions and interact with the
                app on your behalf.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-md">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage({ text: prompt })}
                  className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Message list ── */
          <div className="mx-auto w-full max-w-2xl px-4 py-6 space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Typing indicator */}
            {isStreaming && (
              <div className="flex items-end gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-primary border border-border">
                  <Bot className="size-4" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3 flex gap-1 items-center">
                  <span className="size-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:0ms]" />
                  <span className="size-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:150ms]" />
                  <span className="size-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input footer ── */}
      <div className="shrink-0 bg-background/95 px-4">
        <div className="mx-auto w-full max-w-2xl space-y-2">
          <div
            className={cn(
              "flex items-center gap-2 rounded-2xl border bg-muted/40 px-4 py-3 transition-all",
              "focus-within:border-primary/50 focus-within:bg-background focus-within:shadow-sm",
            )}
          >
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AI…"
              rows={1}
              disabled={isStreaming}
              className="flex-1 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 min-h-11 max-h-45 leading-6"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className={cn(
                "size-8 shrink-0 rounded-full transition-all",
                !input.trim() || isStreaming ? "opacity-40" : "opacity-100",
              )}
            >
              {isStreaming ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </div>
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error.message}
            </p>
          )}

          <p className="text-center text-[11px] text-muted-foreground/60">
            AI may make mistakes. Please verify important info.
          </p>
        </div>
      </div>
    </div>
  );
}
