import BrandSplash from "@/components/BrandSplash";

// Route-level loading UI; only shows on navigations that actually wait.
export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-paper">
      <BrandSplash />
    </div>
  );
}
