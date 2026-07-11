"use client";
// From smoothui.dev's skeleton-loader, recolored.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps {
  children?: ReactNode;
  className?: string;
  loading?: boolean;
}

export default function Skeleton({ loading = true, children, className }: SkeletonProps) {
  if (!loading && children) return <>{children}</>;

  if (loading && children) {
    return (
      <div aria-busy="true" aria-live="polite" className={cn("relative", className)}>
        <div className="invisible">{children}</div>
        <div aria-hidden="true" className="absolute inset-0 animate-pulse rounded-[inherit] bg-border2/70" />
      </div>
    );
  }

  return <div aria-busy="true" className={cn("animate-pulse rounded-md bg-border2/70", className)} />;
}
