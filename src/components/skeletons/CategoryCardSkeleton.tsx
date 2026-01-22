import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-background transition-all hover:shadow-md">
      {/* Image Skeleton */}
      <div className="relative h-48">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function CategoryGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </>
  );
}
