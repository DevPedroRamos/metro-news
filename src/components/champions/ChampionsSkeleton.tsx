import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const PodiumSkeleton = () => {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((index) => (
          <Card key={index} className="relative">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-2" />
                <Skeleton className="h-6 w-6 mx-auto" />
              </div>
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-5 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 mx-auto" />
                <Skeleton className="h-4 w-28 mx-auto" />
              </div>
              <div className="flex gap-2 mt-4 justify-center">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" />
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <div className="grid grid-cols-5 gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        {[...Array(10)].map((_, index) => (
          <div key={index} className="p-4 border-b last:border-b-0">
            <div className="grid grid-cols-5 gap-4 items-center">
              <Skeleton className="h-4 w-8" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export const FilterTabsSkeleton = () => {
  return (
    <div className="flex gap-2 mb-6">
      {[0, 1, 2].map((index) => (
        <Skeleton key={index} className="h-10 w-32" />
      ))}
    </div>
  );
};