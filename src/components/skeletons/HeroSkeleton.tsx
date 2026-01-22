export default function HeroSkeleton() {
  return (
    <section className="flex flex-col lg:flex-row items-center gap-3 sm:gap-4 lg:gap-5 w-full h-auto lg:h-140">
      {/* Left Card Skeleton - Category Products */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-full flex items-start rounded-lg border border-gray-200 overflow-hidden bg-muted">
        {/* Background skeleton */}
        <div className="w-full h-full bg-linear-to-r from-muted via-muted-foreground/10 to-muted animate-pulse"></div>

        {/* Top icon and text skeleton */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-5 lg:left-5 flex items-center gap-2 sm:gap-3 w-4/5 lg:w-3/4">
          <div className="size-10 sm:size-12 lg:size-15 bg-background/30 rounded-lg animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 sm:h-4 bg-background/30 rounded animate-pulse w-3/4"></div>
            <div className="h-3 sm:h-4 bg-background/30 rounded animate-pulse w-1/2"></div>
          </div>
        </div>

        {/* Bottom card skeleton */}
        <div className="absolute w-full bottom-0 left-0 px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
          <div className="bg-background/30 backdrop-blur-sm w-full h-20 sm:h-24 lg:h-28 rounded-xl flex items-center justify-between px-3 sm:px-4 lg:px-5">
            {/* Product info skeleton */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="size-14 sm:size-16 lg:size-20 bg-muted-foreground/20 rounded-lg animate-pulse shrink-0"></div>
              <div className="space-y-2">
                <div className="h-3 sm:h-4 bg-muted-foreground/20 rounded animate-pulse w-32 sm:w-40"></div>
                <div className="h-2 sm:h-3 bg-muted-foreground/20 rounded animate-pulse w-24 sm:w-32"></div>
              </div>
            </div>
            {/* Arrow buttons skeleton */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <div className="rounded-full w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-muted-foreground/20 animate-pulse"></div>
              <div className="hidden sm:block w-8 h-3 bg-muted-foreground/20 rounded animate-pulse"></div>
              <div className="rounded-full w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-muted-foreground/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Card Skeleton - Featured Product */}
      <div className="relative w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-full flex items-center rounded-lg border border-gray-200 overflow-hidden bg-muted">
        {/* Background skeleton */}
        <div className="w-full h-full bg-linear-to-r from-muted via-muted-foreground/10 to-muted animate-pulse"></div>

        {/* Bottom info skeleton */}
        <div className="absolute bottom-0 left-0 flex items-center justify-between w-full h-16 sm:h-18 lg:h-20 px-3 sm:px-4 lg:px-5 bg-background/30 backdrop-blur-sm">
          <div className="space-y-2 w-1/2">
            <div className="h-3 sm:h-4 bg-muted-foreground/30 rounded animate-pulse w-3/4"></div>
            <div className="h-2 sm:h-3 bg-muted-foreground/30 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="rounded-full h-8 sm:h-9 lg:h-10 w-24 sm:w-28 lg:w-32 bg-muted-foreground/30 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
