import { Skeleton } from "../ui/skeleton";

const CardSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
};

export default CardSkeleton;
