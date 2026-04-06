"use client";

import { useEffect } from "react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public page error:", error.message, error.digest);
  }, [error]);

  return (
    <main className="min-h-screen bg-rush-surface flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-2xl font-bold text-rush-dark-green mb-4">
          Something went wrong
        </h1>
        <p className="text-rush-umber mb-8 max-w-md">
          We&apos;re having trouble loading this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-sm bg-rush-dark-green px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
