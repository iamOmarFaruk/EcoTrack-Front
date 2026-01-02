import clsx from 'clsx'

export default function Skeleton({ className }) {
  return <div className={clsx('animate-pulse rounded-md bg-muted/70', className)} />
}

// Challenge Card Skeleton
export function ChallengeCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      {/* Content skeleton */}
      <div className="p-5 flex flex-col gap-3">
        {/* Category skeleton */}
        <Skeleton className="h-3 w-20 mb-1" />

        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-1" />

        {/* Stats skeleton */}
        <div className="flex items-center mb-1">
          <Skeleton className="h-4 w-4 rounded-full mr-2" />
          <Skeleton className="h-3 w-32" />
        </div>

        {/* Divider line */}
        <div className="border-t border-border/60 my-1"></div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-[42px] w-32 rounded-[5px]" />
      </div>
    </div>
  )
}

// Event Card Skeleton
export function EventCardSkeleton() {
  return (
    <div className="h-full rounded-lg border border-border bg-surface shadow-sm">
      <div className="p-4 flex flex-col h-full">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-3" />

        <div className="space-y-2 mb-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        <div className="mt-auto">
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  )
}

// Tip Card Skeleton
export function TipCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-lg border border-border bg-surface shadow-sm flex flex-col">
      {/* Header with avatar */}
      <div className="p-4 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-3 w-20 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 flex-1">
        <Skeleton className="h-5 w-2/3 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between border-t">
        <Skeleton className="h-7 w-16 rounded-full" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

// Community Stats Card Skeleton
export function CommunityStatsCardSkeleton() {
  return (
    <div className="h-full rounded-lg border border-border bg-surface shadow-sm">
      <div className="p-4 flex items-center gap-4 h-full">
        <div className="flex-shrink-0">
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
        <div className="min-w-0 flex-1">
          <Skeleton className="h-6 w-16 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}


