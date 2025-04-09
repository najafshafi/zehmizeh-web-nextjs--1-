import { useQuery } from 'react-query';
import { getMyAllJobs } from '@/helpers/http/freelancer';

/*
 * This hook will load the client jobs
 */
function useFreelancerJobs({ query, limit }: { query: string; limit: number }) {
  /* This query is being set from the browser url (Search params) from the parent component */

  const params = new URLSearchParams(query);

  const status = params.get('filter') || 'all'; // default active tab = all
  const page = params.get('pg') || '1'; // default page = 1
  const text = params.get('keyword') || ''; // default page = ''
  const filter = params.get('sort') || '';

  const payload = {
    status,
    page: parseInt(page),
    limit,
    text,
    filter,
  };

  // const debouncedQuery = useDebounce(query, 5);

  const { data, isLoading, refetch, isRefetching } = useQuery(
    ['get-my-all-jobs', query],
    () => getMyAllJobs(payload),
    { keepPreviousData: false, enabled: !!query } // If query is passed then only this will be called
  );

  return {
    data: data?.data || [],
    totalResults: data?.total || 0,
    isLoading,
    refetch,
    isRefetching,
  };
}

export default useFreelancerJobs;
