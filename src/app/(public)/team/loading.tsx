export default function TeamLoading() {
  return (
    <main className="bg-rush-surface min-h-screen animate-pulse">
      {/* Hero */}
      <div className="pt-32 pb-20 max-w-screen-2xl mx-auto px-8">
        <div className="ml-0 lg:ml-12 space-y-4">
          <div className="h-3 w-28 rounded bg-rush-light-gray" />
          <div className="h-12 w-96 max-w-full rounded bg-rush-light-gray" />
          <div className="h-5 w-[28rem] max-w-full rounded bg-rush-surface-container mt-2" />
        </div>
      </div>

      {/* PI bio panel — full-bleed two-column */}
      <div className="flex flex-col lg:flex-row items-stretch">
        <div className="lg:w-2/3 bg-rush-surface-container-low p-10 md:p-16 space-y-4">
          <div className="h-3 w-32 rounded bg-rush-light-gray" />
          <div className="h-8 w-64 rounded bg-rush-light-gray" />
          <div className="h-3 w-48 rounded bg-rush-surface-container-high mt-2" />
          <div className="space-y-2 mt-6">
            <div className="h-4 w-full max-w-sm rounded bg-rush-surface-container-high" />
            <div className="h-4 w-full max-w-xs rounded bg-rush-surface-container-high" />
            <div className="h-4 w-full max-w-sm rounded bg-rush-surface-container-high" />
          </div>
        </div>
        <div className="lg:w-1/3 h-[280px] lg:h-auto bg-rush-surface-container" />
      </div>

      {/* Staff section */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-24">
        <div className="space-y-3 mb-14 ml-0 lg:ml-12">
          <div className="h-3 w-24 rounded bg-rush-light-gray" />
          <div className="h-8 w-72 rounded bg-rush-light-gray" />
        </div>

        {/* Staff card rows */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-rush-surface-container-high rounded-sm p-10 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-5 pb-5 border-b border-rush-outline-variant/20 last:border-0 last:pb-0">
                <div className="shrink-0 w-24 h-24 rounded-sm bg-rush-surface-container" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-5 w-40 rounded bg-rush-light-gray" />
                  <div className="h-3 w-28 rounded bg-rush-surface-container" />
                  <div className="h-3 w-full max-w-xs rounded bg-rush-surface-container mt-2" />
                  <div className="h-3 w-full max-w-[200px] rounded bg-rush-surface-container" />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-5 bg-rush-surface-container rounded-sm p-10 space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-5 pb-5 border-b border-rush-outline-variant/20 last:border-0 last:pb-0">
                <div className="shrink-0 w-24 h-24 rounded-sm bg-rush-surface-container-high" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-5 w-36 rounded bg-rush-light-gray" />
                  <div className="h-3 w-24 rounded bg-rush-surface-container-high" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
