export default function PublicLoading() {
  return (
    <main className="min-h-screen bg-rush-surface">
      <div className="animate-pulse">
        {/* Page header skeleton */}
        <div className="bg-rush-surface-container-low py-16 lg:py-24 px-6 lg:px-8">
          <div className="max-w-screen-2xl mx-auto">
            <div className="h-3 w-24 rounded bg-rush-light-gray mb-6" />
            <div className="h-10 w-80 rounded bg-rush-light-gray mb-4" />
            <div className="h-5 w-[32rem] max-w-full rounded bg-rush-light-gray" />
          </div>
        </div>

        {/* Content area — neutral lines, no grid assumptions */}
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-16 space-y-4">
          <div className="h-4 w-full max-w-2xl rounded bg-rush-surface-container" />
          <div className="h-4 w-full max-w-xl rounded bg-rush-surface-container" />
          <div className="h-4 w-full max-w-lg rounded bg-rush-surface-container" />
          <div className="h-4 w-full max-w-2xl rounded bg-rush-surface-container mt-8" />
          <div className="h-4 w-full max-w-md rounded bg-rush-surface-container" />
        </div>
      </div>
    </main>
  );
}
