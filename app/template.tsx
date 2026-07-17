"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BrandSplash from "@/components/BrandSplash";

// How long the loading splash stays up, in ms. Edit this to taste.
const MIN_SPLASH_MS = 900;

// A template remounts on every navigation, so this holds the splash over the
// page for a minimum time even when the route itself loads instantly.
// loading.tsx still covers loads that take longer than this.
export default function Template({ children }: { children: React.ReactNode }) {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {children}
      <AnimatePresence>
        {splash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-paper"
          >
            <BrandSplash />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
