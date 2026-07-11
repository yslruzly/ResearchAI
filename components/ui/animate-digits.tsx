"use client";
// From ui.unlumen.com's animate-digits, with reduced-motion handling added.

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface ExitItem {
  id: number;
  char: string;
  exitY: number;
}

let nextId = 0;

function DigitCell({
  char,
  isDigit,
  enterY = 24,
  enterBlur = 32,
  enterScale = 0.7,
}: {
  char: string;
  isDigit: boolean;
  enterY?: number;
  enterBlur?: number;
  enterScale?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [exitQueue, setExitQueue] = useState<ExitItem[]>([]);
  const prevChar = useRef(char);
  const firstRender = useRef(true);

  const spring = { stiffness: 170, damping: 12 };
  const y = useSpring(0, spring);
  const opacity = useSpring(1, spring);
  const scale = useSpring(1, spring);
  const blur = useSpring(0, spring);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  useEffect(() => {
    if (!isDigit || shouldReduceMotion) return;

    const prev = prevChar.current;
    prevChar.current = char;

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (char === prev || !/\d/.test(prev)) return;

    const up = Number(char) > Number(prev);
    const id = nextId++;
    setExitQueue((q) => [...q, { id, char: prev, exitY: up ? -enterY : enterY }].slice(-3));

    y.jump(up ? enterY : -enterY);
    opacity.jump(0);
    scale.jump(enterScale);
    blur.jump(enterBlur);

    y.set(0);
    opacity.set(1);
    scale.set(1);
    blur.set(0);
  }, [char, isDigit, shouldReduceMotion, enterY, enterBlur, enterScale, y, opacity, scale, blur]);

  if (!isDigit || shouldReduceMotion) return <span>{char}</span>;

  return (
    <span className="relative grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
      <AnimatePresence>
        {exitQueue.map(({ id, char: exitChar, exitY }) => (
          <motion.span
            key={id}
            aria-hidden
            initial={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
            animate={{ opacity: 0, scale: 0.7, filter: "blur(8px)", y: exitY }}
            transition={{ type: "spring", stiffness: 170, damping: 15 }}
            onAnimationComplete={() => setExitQueue((q) => q.filter((i) => i.id !== id))}
          >
            {exitChar}
          </motion.span>
        ))}
      </AnimatePresence>
      <motion.span style={{ opacity, scale, filter, y }}>{char}</motion.span>
    </span>
  );
}

export function AnimateDigits({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center tabular-nums", className)}>
      {value.split("").map((char, i) => (
        <DigitCell key={i} char={char} isDigit={/\d/.test(char)} />
      ))}
    </span>
  );
}
