"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SiriOrb from "@/components/ui/siri-orb";
import MobileNav from "@/components/MobileNav";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";

// Shared header. The outer stays 60px so the page never jumps; on the landing
// page the inner bar detaches into a centered floating pill once the hero is
// scrolled past (logo slides in from the left, CTA from the right) and snaps
// back to full width at the top. md+ only: the mobile menu is pinned to
// top-[60px]. scroll-padding-top in globals.css assumes the 60px height too.
export default function SiteHeader({
  variant,
  working = false,
}: {
  variant: "landing" | "tool";
  working?: boolean;
}) {
  const [detached, setDetached] = useState(false);

  useEffect(() => {
    if (variant !== "landing") return;
    const hero = document.getElementById("top");
    if (!hero) return;
    // top margin matches the header, so the hero counts as gone once it's only
    // behind the bar; without it, landing on #how-it-works never detaches
    const io = new IntersectionObserver(([entry]) => setDetached(!entry.isIntersecting), {
      rootMargin: "-64px 0px 0px 0px",
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [variant]);

  // brand links to #top on landing, back to / on the tool page
  const brand = (
    <span className="flex items-center gap-2.5">
      <span
        className={cn(
          "relative flex items-center justify-center transition-transform duration-300",
          detached && "md:scale-[0.85]"
        )}
      >
        <SiriOrb size="30px" animationDuration={working ? 6 : 20} dots={false} />
        {working && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-accent" />
        )}
      </span>
      <span
        className={cn(
          "font-display text-ink transition-all duration-300",
          detached ? "text-lg md:text-base" : "text-lg"
        )}
      >
        ResearchAI
      </span>
    </span>
  );

  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-start justify-center">
      <div
        className={cn(
          "relative flex h-full w-full max-w-full items-center gap-3.5 px-5 sm:px-7",
          "border border-x-transparent border-t-transparent border-b-white/10",
          "bg-paper/55 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300",
          detached &&
            "md:mt-1.5 md:h-12 md:max-w-[820px] md:rounded-full md:border-white/10 md:bg-paper/70 md:px-5 md:shadow-lg md:shadow-black/40"
        )}
      >
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
                  className={cn(
                    "font-mono text-muted transition-all duration-300 hover:text-ink",
                    detached ? "text-sm md:text-xs" : "text-sm"
                  )}
                >
                  {label}
                </a>
              ))}
            </nav>
            {/* on mobile the CTA lives in the menu panel */}
            <Link
              href="/research"
              className={cn(
                "ml-auto hidden items-center gap-1.5 rounded-full bg-ink pl-4 pr-3.5 md:flex",
                "text-sm font-medium text-paper transition-all duration-300 hover:opacity-90",
                detached ? "py-2 md:py-1 md:text-xs" : "py-2"
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
      </div>
    </header>
  );
}
