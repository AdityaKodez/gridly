import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { appConfig } from "@/config";
import Link from "next/link";
import GridlyLogo from "@/components/gridly-logo";
import { FaGithub } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getGitHubRepoStars } from "@/lib/github";

export const Header = async () => {
  const [session, stars] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getGitHubRepoStars(appConfig.github),
  ]);


  return (
    <div
      className="container mx-auto sticky top-0 z-50 max-w-6xl px-6 
    backdrop-blur-2xl h-14 border-b border-dashed border-x flex justify-between items-center"
    >
      <Link href="/" className="flex items-center gap-2 group" prefetch>
        <GridlyLogo
          size={18}
          className="text-primary/60 group-hover:text-primary transition-colors"
        />
        <span className="font-doto text-xl font-bold tracking-tighter">
          {appConfig.name.toUpperCase()}
        </span>
      </Link>
      <div className="flex items-center gap-4 ">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="https://buymeacoffee.com/adikodez"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                className="rounded-full active:scale-95 transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-muted hidden sm:flex items-center gap-2"
              >
                <HeartIcon className="size-4 fill-yellow-500 group-hover:animate-pulse" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Buy me a coffee ☕</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={appConfig.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                className="group h-9 rounded-full active:scale-95 transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-muted px-3"
              >
                <FaGithub className="transition-transform duration-500 ease-in-out group-hover:rotate-12 group-hover:scale-110" />
                <span className="ml-1 text-xs font-medium tabular-nums">
                  {stars.toLocaleString()}
                </span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Star on GitHub</p>
          </TooltipContent>
        </Tooltip>
        <ModeToggle />
        <Link href={session?.user ? "/dashboard" : "/sign-in"} prefetch>
          <Button variant={"outline"} size={"sm"}>
            {session?.user ? "Dashboard" : "Log in"}
          </Button>
        </Link>
      </div>
    </div>
  );
};
