import { useQuery } from 'react-query';
import { manageDispute } from '@/helpers/http/dispute';

/*
 * This hook will fetch the freelancer details
 */
function useDisputes({ page, limit }: { page: number; limit: number }) {
  const { data, isLoading, refetch, isRefetching } = useQuery(
    ['get-freelancer-details', page],
    () =>
      manageDispute({
        action: 'get_dispute',
        page,
        limit,
      }),
    { keepPreviousData: true }
  );
  return {
    data: data?.data || [],
    totalResults: data?.total | 0,
    isLoading,
    refetch,
    isRefetching,
  };
}

export default useDisputes;
