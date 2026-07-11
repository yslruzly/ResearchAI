import { Suspense } from "react";
import ResearchTool from "@/components/research/ResearchTool";
import SiteHeader from "@/components/SiteHeader";
import Skeleton from "@/components/ui/skeleton";

// ResearchTool reads useSearchParams, so without a real fallback this route
// would SSR an empty body and stay blank until hydration.
function ToolSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <SiteHeader variant="tool" />
      <div className="mx-auto w-full max-w-[1000px] px-5 py-12 sm:px-7">
        <Skeleton className="mb-3 h-3 w-40" />
        <Skeleton className="mb-2 h-9 w-72" />
        <Skeleton className="mb-7 h-9 w-56" />
        <Skeleton className="mb-4 h-[52px] w-full rounded-xl" />
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-7 w-40 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <Suspense fallback={<ToolSkeleton />}>
      <ResearchTool />
    </Suspense>
  );
}
