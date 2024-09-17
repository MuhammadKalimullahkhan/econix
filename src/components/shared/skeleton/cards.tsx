import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export default function CardsSkeleton() {
  return (
    <>
      {[...Array(12)].map((_, i) => (
        <div key={i} className="mt-4">
          <SkeletonCard key={i} />
        </div>
      ))}
    </>
  );
}
