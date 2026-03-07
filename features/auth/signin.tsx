"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { authConfig } from "@/config";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import type { IconType } from "react-icons";
import { z } from "zod";

type AuthProvider = (typeof authConfig.auth.providers)[number];

const callbackURLSchema = z
  .string()
  .startsWith("/")
  .refine((value) => !value.startsWith("//"), {
    message: "callbackURL must be a relative path",
  });

const providerMeta: Record<AuthProvider, { icon: IconType; label: string }> = {
  github: { icon: FaGithub, label: "GitHub" },
  google: { icon: FaGoogle, label: "Google" },
  discord: { icon: FaDiscord, label: "Discord" },
};

export function SignInForm({
  enabledProviders,
  className,
  ...props
}: React.ComponentProps<"form"> & { enabledProviders: AuthProvider[] }) {
  const { auth } = authConfig;
  const searchParams = useSearchParams();
  const callbackURLParam = searchParams.get("callbackURL");
  const callbackURL = callbackURLSchema.safeParse(callbackURLParam).success
    ? callbackURLParam!
    : auth.redirectAfterSignIn;

  const [loading, setLoading] = useState<AuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (provider: AuthProvider) => {
    setLoading(provider);
    setError(null);
    try {
      await signIn.social({
        provider,
        callbackURL,
      });
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error(err);
      setLoading(null);
    }
  };

  return (
    <form className={cn("flex flex-col gap-8", className)} {...props}>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-doto tracking-tight flex flex-col gap-1">
          <span className="text-primary flex items-center gap-3 font-bold">
            {auth.title}
            <auth.titleIcon className="size-8 fill-primary/20" />
          </span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {auth.subtitle}
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {enabledProviders.map((provider) => {
          const meta = providerMeta[provider];
          const Icon = meta.icon;
          const isProviderLoading = loading === provider;

          return (
            <Button
              key={provider}
              onClick={() => handleSignIn(provider)}
              disabled={!!loading}
              variant="outline"
              type="button"
              size="lg"
              className="w-full justify-center gap-3 h-12 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProviderLoading ? <Spinner /> : <Icon className="size-5" />}
              <span>
                {isProviderLoading
                  ? `Connecting to ${meta.label}...`
                  : `Continue with ${meta.label}`}
              </span>
            </Button>
          );
        })}
      </div>

      {enabledProviders.length === 0 && (
        <Empty className="flex-none border border-dashed p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-muted text-muted-foreground">
              <auth.titleIcon className="size-5 fill-muted-foreground/40" />
            </EmptyMedia>
            <EmptyTitle>No sign-in methods configured</EmptyTitle>
            <EmptyDescription>
              Add OAuth credentials in your environment to enable sign-in.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        By continuing, you agree to our{" "}
        <Link
          href="/terms"
          className="text-primary/50 hover:underline underline-offset-4"
          prefetch
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-primary/50 hover:underline underline-offset-4"
          prefetch
        >
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
