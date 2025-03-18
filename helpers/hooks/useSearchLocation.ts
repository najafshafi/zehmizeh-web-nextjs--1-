'use client'; // Add this directive since we're using client-side hooks

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

function useLocationSearch() {
  const searchParams = useSearchParams();
  
  const paramsObject = useMemo(() => {
    // Convert URLSearchParams to a plain object
    return Object.fromEntries(searchParams?.entries() ?? []);
  }, [searchParams]);

  return paramsObject;
}

export default useLocationSearch;