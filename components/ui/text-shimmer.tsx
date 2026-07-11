import { cn } from "@/lib/utils";

export function TextShimmer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block animate-shimmer bg-[length:200%_100%] bg-clip-text text-transparent [background-image:linear-gradient(110deg,#666660_40%,#F0EDE8_50%,#666660_60%)]",
        className
      )}
    >
      {children}
    </span>
  );
}
