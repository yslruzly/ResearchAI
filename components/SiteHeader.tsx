import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SiriOrb from "@/components/ui/siri-orb";
import MobileNav from "@/components/MobileNav";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";

// Shared header. It is 60px tall; scroll-padding-top in globals.css and the
// 100dvh-60px sections assume that, so keep them in sync.
export default function SiteHeader({
  variant,
  working = false,
}: {
  variant: "landing" | "tool";
  working?: boolean;
}) {
  // brand links to #top on landing, back to / on the tool page
  const brand = (
    <span className="flex items-center gap-2.5">
      <span className="relative flex items-center justify-center">
        <SiriOrb size="30px" animationDuration={working ? 6 : 20} dots={false} />
        {working && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-accent" />
        )}
      </span>
      <span className="font-display text-lg text-ink">ResearchAI</span>
    </span>
  );

  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center gap-3.5 border-b border-white/10 bg-paper/55 px-5 backdrop-blur-xl backdrop-saturate-150 sm:px-7">
      {variant === "tool" && (
        <>
          <Link
            href="/"
            className="mr-1 flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            back
          </Link>
          <div className="h-4 w-px bg-border" />
        </>
      )}

      {variant === "landing" ? (
        <a
          href="#top"
          aria-label="Back to top"
          className="flex items-center rounded-md transition-opacity hover:opacity-80"
        >
          {brand}
        </a>
      ) : (
        <Link
          href="/"
          aria-label="ResearchAI home"
          className="flex items-center rounded-md transition-opacity hover:opacity-80"
        >
          {brand}
        </Link>
      )}

      {variant === "landing" ? (
        <>
          {/* absolute-centered so the brand/CTA widths don't skew it */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
            {NAV_LINKS.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="font-mono text-sm text-muted transition-colors hover:text-ink"
              >
                {label}
              </a>
            ))}
          </nav>
          {/* on mobile the CTA lives in the menu panel */}
          <Link
            href="/research"
            className={cn(
              "ml-auto hidden items-center gap-1.5 rounded-full bg-ink py-2 pl-4 pr-3.5 md:flex",
              "text-sm font-medium text-paper transition-opacity hover:opacity-90"
            )}
          >
            Open the agent
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <MobileNav />
        </>
      ) : (
        <>
          <div className="mx-0.5 hidden h-1 w-1 rounded-full bg-border2 sm:block" />
          <span className="hidden font-mono text-xs text-muted sm:inline">
            agentic research assistant
          </span>
          <span className="glass ml-auto hidden rounded-full border border-white/10 px-2.5 py-1 font-mono text-xs text-muted sm:inline">
            search by Jina <span className="text-border2">·</span> synthesis by Groq
          </span>
        </>
      )}
    </header>
  );
}
