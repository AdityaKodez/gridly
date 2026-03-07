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
import { DashboardHeader } from "@/features/dashboard/dashboard-header";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("[Dashboard] Unhandled render error", error);
  }, [error]);

  return (
    <>
      <DashboardHeader title="Error" />
      <div className="flex flex-1 items-center justify-center p-6">
        <Empty className="flex-none w-full max-w-md border border-dashed p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </EmptyMedia>
            <EmptyTitle>Dashboard failed to load</EmptyTitle>
            <EmptyDescription>
              Please retry. If this keeps happening, check server logs.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={reset}>Retry</Button>
          </EmptyContent>
        </Empty>
      </div>
    </>
  );
}
