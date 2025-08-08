import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PaperCardSkeleton() {
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <Skeleton className="h-8 w-16 shrink-0" />
        </div>

        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
    </Card>
  );
}

export function PaperGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <PaperCardSkeleton key={i} />
      ))}
    </div>
  );
}