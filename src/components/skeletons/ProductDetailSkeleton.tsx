import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left: Image Gallery Skeleton */}
          <div className="lg:col-span-5">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex lg:flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 shrink-0" />
                ))}
              </div>
              {/* Main Image */}
              <div className="flex-1">
                <Skeleton className="w-full aspect-square" />
              </div>
            </div>
          </div>

          {/* Middle: Product Info Skeleton */}
          <div className="lg:col-span-4 space-y-4">
            {/* Category Badge */}
            <Skeleton className="h-6 w-24" />

            {/* Title - 2 lines */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>

            {/* Price */}
            <div className="py-4">
              <Skeleton className="h-12 w-48" />
            </div>

            {/* Sale Type Badge */}
            <Skeleton className="h-6 w-28" />
          </div>

          {/* Right: Actions Skeleton */}
          <div className="lg:col-span-3">
            <div className="p-6 border rounded-lg space-y-4 bg-white">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>

        {/* Store Info Skeleton */}
        <div className="mb-8 p-6 border rounded-lg bg-white space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-8 border rounded-lg bg-white">
          <div className="flex border-b p-4 gap-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="p-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Reviews Skeleton */}
        <div className="mb-8 p-6 border rounded-lg bg-white space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="space-y-2 py-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
