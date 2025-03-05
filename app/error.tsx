"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const Error: React.FC<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error("Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h2 className="text-red-600 text-2xl font-bold">Oops! Something went wrong.</h2>
      <p className="text-gray-500 mt-2">Please try again.</p>
      <button
        className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        onClick={reset}
      >
        Retry
      </button>
    </div>
  );
};

export default Error;