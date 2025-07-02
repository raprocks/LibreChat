import { Skeleton } from '~/components/ui';

export default function SkeletonForm() {
  return (
    <div>
      <div className="flex flex-col items-center justify-between px-4 sm:flex-row dark:text-gray-200">
        <Skeleton className="mb-1 flex h-10 w-32 flex-row items-center font-bold sm:text-xl md:mb-0 md:h-12 md:text-2xl" />
      </div>
      <div className="flex h-full w-full flex-col md:flex-row">
        {/* Left Section */}
        <div className="border-border-medium-alt flex-1 overflow-y-auto p-4 md:max-h-[calc(100vh-150px)] md:border-r">
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  );
}
