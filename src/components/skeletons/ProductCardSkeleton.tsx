import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton({
  isSidebar = false,
}: {
  isSidebar?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      {/* Image Skeleton */}
      <div className={isSidebar ? "h-50 lg:h-70" : "h-40 lg:h-50"}>
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-2 p-2">
        {/* Title - 2 lines */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        {/* Price */}
        <Skeleton className="h-4 w-20 lg:hidden" />

        {/* Category & Campus */}
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 6,
  isSidebar = false,
}: {
  count?: number;
  isSidebar?: boolean;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} isSidebar={isSidebar} />
      ))}
    </>
  );
}
