import { Button } from "@/components/ui/button";
import { ArrowRight, DatabaseIcon } from "lucide-react";
import { appConfig, landingConfig } from "@/config";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { getGitHubRepoStars } from "@/lib/github";

const { hero } = landingConfig;

export const Hero = async () => {
  const stars = await getGitHubRepoStars(appConfig.github);

  return (
    <section className="container mx-auto max-w-6xl px-6 py-20 md:py-28 text-left border-x border-dashed border-b">
      <div className="max-w-3xl">
       
        <h1 className="text-4xl md:text-6xl tracking-tight font-semibold leading-tight">
          <span className="text-primary">
          {hero.titleAccent}
  
          </span>
          <span className="block mt-2 text-foreground">{hero.title}</span>
        </h1>

        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {hero.subtitle}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Link href="/sign-in" prefetch className="cursor-pointer">
          <Button size="lg" className="w-full sm:w-auto">
            {hero.cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link
          href={appConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            <FaGithub />
            Star on GitHub
            <span className="ml-1 rounded-md bg-background px-1.5 py-0.5 text-xs tabular-nums text-foreground">
              {stars.toLocaleString()}
            </span>
          </Button>
        </Link>
      </div>
    </section>
  );
};
