"use client";
// Based on smoothui.dev's typewriter-text, extended to styled segments so part
// of the headline can be italic. Types, holds, erases, loops.

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TypewriterSegment {
  text: string;
  className?: string;
  /** Render as <em> rather than <span>. */
  em?: boolean;
  /** Force a line break before this segment. */
  breakBefore?: boolean;
}

export interface TypewriterTextProps {
  segments: TypewriterSegment[];
  className?: string;
  typeSpeed?: number;
  eraseSpeed?: number;
  holdAfterType?: number;
  holdAfterErase?: number;
  loop?: boolean;
}

function Caret() {
  return (
    <span className="ml-1 inline-block h-[0.9em] w-[2px] animate-pulse bg-accent align-middle" />
  );
}

export default function TypewriterText({
  segments,
  className,
  typeSpeed = 45,
  eraseSpeed = 28,
  holdAfterType = 1800,
  holdAfterErase = 500,
  loop = true,
}: TypewriterTextProps) {
  const total = segments.reduce((n, s) => n + s.text.length, 0);
  const [count, setCount] = useState(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setCount(total);
      return;
    }

    // chained timeouts, not setInterval, so nothing fires after unmount
    let timer: ReturnType<typeof setTimeout>;

    const step = (n: number, dir: 1 | -1) => {
      if (!alive.current) return;
      setCount(n);

      if (dir === 1 && n >= total) {
        if (!loop) return;
        timer = setTimeout(() => step(total - 1, -1), holdAfterType);
        return;
      }
      if (dir === -1 && n <= 0) {
        timer = setTimeout(() => step(1, 1), holdAfterErase);
        return;
      }
      timer = setTimeout(() => step(n + dir, dir), dir === 1 ? typeSpeed : eraseSpeed);
    };

    step(0, 1);

    return () => {
      alive.current = false;
      clearTimeout(timer);
    };
  }, [total, typeSpeed, eraseSpeed, holdAfterType, holdAfterErase, loop]);

  let remaining = count;
  let caretPlaced = false;

  return (
    <span className={className}>
      {segments.map((segment, i) => {
        const shown = Math.max(0, Math.min(remaining, segment.text.length));
        remaining -= segment.text.length;

        const isCaretHere = !caretPlaced && (shown < segment.text.length || i === segments.length - 1);
        if (isCaretHere) caretPlaced = true;

        const Tag = segment.em ? "em" : "span";

        return (
          <span key={i}>
            {segment.breakBefore && <br />}
            <Tag className={cn(segment.em && "italic", segment.className)}>
              {segment.text.slice(0, shown)}
            </Tag>
            {isCaretHere && <Caret />}
          </span>
        );
      })}
    </span>
  );
}
