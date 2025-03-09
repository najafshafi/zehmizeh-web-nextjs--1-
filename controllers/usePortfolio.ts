import { useQuery } from 'react-query';
import { getFreelancerPortfolio, getPortfolio } from '@/helpers/http/portfolio';

function usePortfolio(freelancer_id?: string) {
  const { data, isLoading, refetch, isRefetching } = useQuery(
    freelancer_id ? 'get-freelancer-portfolio' : 'get-portfolio',
    () =>
      freelancer_id ? getFreelancerPortfolio(freelancer_id) : getPortfolio(),
    freelancer_id ? { enabled: !!freelancer_id } : {}
  );
  return {
    portfolioData: data?.data || [],
    isLoading,
    refetch,
    isRefetching,
  };
}

export default usePortfolio;
