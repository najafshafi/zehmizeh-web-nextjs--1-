import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

function useLocationSearch() {
  const location = useLocation();
  const searchParams = useMemo(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    return Object.fromEntries(urlSearchParams.entries());
  }, [location]);
  return searchParams;
}
export default useLocationSearch;
