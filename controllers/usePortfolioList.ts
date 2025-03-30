import { useQuery } from "react-query";
import { getFreelancerPortfolio } from "@/helpers/http/portfolio";
import { queryKeys } from "@/helpers/const/queryKeys";

export const usePortfolioList = (freelancerId: string) => {
  const { data, error, isLoading, refetch, isRefetching } = useQuery(
    queryKeys.getFreelancerPortfolio(freelancerId),
    () =>
      getFreelancerPortfolio(freelancerId).catch((err) => {
        console.log("Error fetching portfolio:", err);
        // Return empty array instead of throwing
        return { data: [] };
      }),
    {
      enabled: !!freelancerId,
      // Don't retry on error for unauthenticated users viewing profiles
      retry: false,
    }
  );
  return {
    portfolioData: data?.data || [],
    error,
    isLoading,
    refetch,
    isRefetching,
  };
};
