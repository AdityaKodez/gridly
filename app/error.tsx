"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[App] Unhandled render error", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Empty className="flex-none w-full max-w-md border border-dashed p-6">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>An unexpected error occurred. Try again.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={reset}>Retry</Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
