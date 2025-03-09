import { useQuery } from 'react-query';
import { getFreelancerPortfolio } from 'helpers/http/portfolio';
import { queryKeys } from 'helpers/const/queryKeys';

export const usePortfolioList = (freelancerId: string) => {
  const { data, isLoading, refetch, isRefetching } = useQuery(
    queryKeys.getFreelancerPortfolio(freelancerId),
    () => getFreelancerPortfolio(freelancerId),
    { enabled: !!freelancerId }
  );
  return {
    portfolioData: data?.data || [],
    isLoading,
    refetch,
    isRefetching,
  };
};
