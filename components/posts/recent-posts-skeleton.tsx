export const RecentPostsSkeleton = () => {
  return (
    <div className="grid h-fit grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          className="flex h-[110px] w-full items-center justify-center rounded bg-slate-50"
          key={`recent-post-skeleton-${i}`}
        ></div>
      ))}
    </div>
  )
}
