import { Card, CardHeader, CardFooter } from "@/components/ui/card";

export default function VideoCardSkeleton() {
  return (
    <Card className="@container/card relative w-full max-w-sm bg-transparent animate-pulse">
      <div className="absolute top-[-0.5rem] right-[-0.5rem] z-50 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>

        <div className="flex items-center gap-2 group min-w-0">
          <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
        </div>
      </CardHeader>

      <div className="relative mx-4 mb-4 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
        <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-gray-400 dark:bg-gray-500" />

          <div className="absolute bottom-2 right-2 h-5 w-12 bg-gray-400 dark:bg-gray-500 rounded" />
        </div>
      </div>

      <CardFooter className="flex-col items-start gap-2 text-sm pt-0">
        <div className="flex justify-between w-full items-center">
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
      </CardFooter>
    </Card>
  );
}

export function VideoCardSkeletonWithShimmer() {
  return (
    <div className="relative overflow-hidden">
      <VideoCardSkeleton />
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
