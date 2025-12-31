'use client';

export default function GlobalError({ error, reset }) {
  const code = error?.statusCode || error?.code || 'Error';

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white px-8 py-10 text-center shadow-lg">
        <div className="mb-2 text-6xl font-bold text-orange-500">{code}</div>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Something went wrong!</h2>
        <p className="mb-6 text-gray-600">{error?.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={() => reset()}
          className="rounded bg-orange-500 px-6 py-2 text-white transition hover:bg-orange-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
