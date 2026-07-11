"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV_LINKS } from "@/lib/nav";

// Hamburger nav below md; drops a full-width panel under the header.
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // esc closes; body scroll locks while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="ml-auto md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="glass flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-ink"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-x-0 bottom-0 top-[60px] z-30 bg-paper/70 backdrop-blur-sm"
            />

            <motion.nav
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
              className="glass-blur fixed inset-x-0 top-[60px] z-40 border-b border-white/10 bg-paper/70 px-5 pb-5 pt-2"
            >
              <ul className="flex flex-col">
                {NAV_LINKS.map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[48px] items-center border-b border-white/10 font-mono text-sm text-muted transition-colors hover:text-ink"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>

              <Link
                href="/research"
                onClick={() => setOpen(false)}
                className="mt-4 flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-paper"
              >
                Open the agent
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
