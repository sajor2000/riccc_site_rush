export default function PublicationsLoading() {
  return (
    <main className="bg-rush-surface text-rush-on-surface">
      <div className="animate-pulse">
        {/* Page header skeleton */}
        <div className="bg-rush-surface-container-low py-16 lg:py-24 px-6 lg:px-8">
          <div className="max-w-screen-2xl mx-auto">
            <div className="h-3 w-32 rounded bg-rush-light-gray mb-6" />
            <div className="h-10 w-56 rounded bg-rush-light-gray mb-4" />
            <div className="h-5 w-[36rem] max-w-full rounded bg-rush-light-gray" />
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-24">
          {/* External links skeleton */}
          <div className="flex gap-6 mb-10 pb-6 border-b border-rush-outline-variant/20">
            <div className="h-4 w-48 rounded bg-rush-light-gray" />
            <div className="h-4 w-36 rounded bg-rush-light-gray" />
          </div>

          {/* Search + filter skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1 h-10 rounded-sm bg-rush-surface-container" />
            <div className="w-32 h-10 rounded-sm bg-rush-surface-container" />
          </div>

          {/* Publication cards skeleton — two year groups */}
          {[1, 2].map((group) => (
            <div key={group} className="mb-8">
              <div className="h-6 w-16 rounded bg-rush-light-gray mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-sm bg-rush-surface-container"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
