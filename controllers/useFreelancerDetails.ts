import { useQuery } from 'react-query';
import { queryKeys } from 'helpers/const/queryKeys';
import { getFreelancerDetails } from 'helpers/http/freelancer';

export function useFreelancerDetails(freelancerId: string) {
  const { data, refetch, isLoading, isRefetching } = useQuery(
    queryKeys.getFreelancerDetails(freelancerId),
    () =>
      getFreelancerDetails(freelancerId).catch((err) => {
        throw err;
      }),
    { enabled: !!freelancerId }
  );
  return {
    freelancerData: data?.data,
    isLoading,
    refetch,
    isRefetching,
  };
}
