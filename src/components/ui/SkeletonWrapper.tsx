import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeletonComponent?: React.ReactNode;
  className?: string;
}

/**
 * SkeletonWrapper - Wrapper component for conditional skeleton rendering
 *
 * Best practice component that handles loading states by conditionally
 * showing skeleton or actual content based on loading state.
 *
 * @example
 * <SkeletonWrapper
 *   isLoading={isLoadingData}
 *   skeletonComponent={<Skeleton className="h-20 w-full" />}
 * >
 *   <YourActualContent />
 * </SkeletonWrapper>
 */
export function SkeletonWrapper({
  isLoading,
  children,
  skeletonComponent,
  className,
}: SkeletonWrapperProps) {
  if (isLoading) {
    return (
      <div className={cn("animate-in fade-in-50", className)}>
        {skeletonComponent || <Skeleton className="h-20 w-full" />}
      </div>
    );
  }

  return (
    <div className={cn("animate-in fade-in-50 duration-500", className)}>
      {children}
    </div>
  );
}

/**
 * SkeletonText - Skeleton for text content
 */
export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard - Generic skeleton card for card-based layouts
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-4 space-y-3",
        className,
      )}>
      <Skeleton className="h-48 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

/**
 * SkeletonAvatar - Skeleton for avatar/profile images
 */
export function SkeletonAvatar({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <Skeleton className={cn("rounded-full", sizeClasses[size], className)} />
  );
}

/**
 * SkeletonButton - Skeleton for button elements
 */
export function SkeletonButton({
  variant = "default",
  className,
}: {
  variant?: "default" | "sm" | "lg";
  className?: string;
}) {
  const variantClasses = {
    default: "h-10 w-24",
    sm: "h-8 w-20",
    lg: "h-12 w-32",
  };

  return (
    <Skeleton
      className={cn("rounded-md", variantClasses[variant], className)}
    />
  );
}
