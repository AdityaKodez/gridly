"use client";

import { UIMessage } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import { Bot, Terminal, Clock } from "lucide-react";
import { MessageResponse } from "@/components/ai-elements/message";
import { memo } from "react";

interface MessageProps {
  message: UIMessage;
}

function ToolResult({ part }: { part: UIMessage["parts"][number] }) {
  if (part.type === "tool-getUserInfo") {
    const result = part.output as
      | { name: string; email: string; id: string }
      | undefined;

    return (
      <div className="mt-2 rounded-xl border bg-muted/60 p-3 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-muted-foreground mb-2 font-sans font-medium uppercase tracking-widest text-[10px]">
          <Terminal className="size-3" />
          User Info
        </div>
        {result ? (
          <div className="space-y-1 text-[13px]">
            <div>
              <span className="text-muted-foreground">name: </span>
              <span>{result.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">email: </span>
              <span>{result.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">id: </span>
              <span className="opacity-60">{result.id.slice(0, 18)}…</span>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground italic">Loading…</span>
        )}
      </div>
    );
  }

  if (part.type === "tool-getCurrentTime") {
    const result = part.output as
      | { datetime: string; date: string; time: string }
      | undefined;

    return (
      <div className="mt-2 rounded-xl border bg-muted/60 p-3 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-muted-foreground mb-2 font-sans font-medium uppercase tracking-widest text-[10px]">
          <Clock className="size-3" />
          Current Time
        </div>
        {result ? (
          <div className="space-y-1 text-[13px]">
            <div>
              <span className="text-muted-foreground">date: </span>
              <span>{result.date}</span>
            </div>
            <div>
              <span className="text-muted-foreground">time: </span>
              <span>{result.time}</span>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground italic">Loading…</span>
        )}
      </div>
    );
  }

  return null;
}

export const  ChatMessage = memo( function ChatMessage ({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-end gap-3 font-mono",
        isUser && "flex-row-reverse",
      )}
    >
      {/* Avatar — only for AI */}
      {!isUser && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground">
          <Bot className="size-4" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "text-foreground rounded-bl-sm",
        )}
      >
        {message.parts.map((part, i) => {
          switch (part.type) {
            case "text":
              return (
                <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                  <MessageResponse>{part.text}</MessageResponse>
                </div>
              );
            case "tool-getUserInfo":
            case "tool-getCurrentTime":
              return <ToolResult key={`${message.id}-${i}`} part={part} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";