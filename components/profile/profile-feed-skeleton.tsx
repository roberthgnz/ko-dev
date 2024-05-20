export const ProfileFeedSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          className="mx-1 animate-pulse rounded-none border border-x-[0] border-y-[0] bg-white pb-6 text-card-foreground shadow-none last:border-b-0"
          key={`profile-feed-skeleton-${i}`}
        >
          <div className="flex justify-between p-6 pb-12">
            <div className="flex items-center gap-4 ">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-3.5 w-24 rounded bg-gray-200"></div>
                <div className="h-3.5 w-24 rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="w-18 h-3.5 rounded bg-gray-200"></div>
          </div>
          <div className="flex h-96 w-full  items-center justify-center rounded-md bg-gray-200"></div>
        </div>
      ))}
    </div>
  )
}
